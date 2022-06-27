import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserTradeBotsState } from "../redux/reducers/userTradeBots";
import { getUserTradeBots } from "../services/tradeBotServices";
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;

export interface AuthContext {

    user: any | undefined;
    setUser: (p: any | undefined) => void;
    tradeBots: any[];
}

// Provider hook that creates auth object and handles state
export function useProvideAuth(): AuthContext {
    const [user, setUser] = useState<any | undefined>({ name: "adfds" });
    const [tradeBots, setTradeBots] = useState<any[]>([]);
    const userProfile = useSelector((state: any) => state.userProfileMode.value);
    const [connection, setConnection] = useState<any | null>(null);
    const tradeBotsRef = useRef<any[]>([]);
    tradeBotsRef.current = tradeBots;

    const dispatch = useDispatch();
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Error)
            .withUrl(`${api}/hub/user`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();
        //   const callbacks = withCallbacks()
        //     .add('TradeBotSessionUpdate', (msg: string) => (dispatch) => {
        //       console.log('TradeBotSessionUpdate', msg)
        //       //dispatch(onUpdateSignarState(msg));
        //     })
        //     .add('TradeBotOrderUpdate', (msg: string) => (dispatch) => {
        //       console.log('TradeBotOrderUpdate', msg)
        //       //dispatch(onUpdateOrderSignarState(msg));
        //     });

        setConnection(connection);
    }, []);
    console.log()
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('TradeBotSessionUpdate', message => {
                        console.log('TradeBotSessionUpdate', message)
                        const tradeBot = tradeBotsRef.current.findIndex(
                            (i) => message?.currentSession.tradeBotId == i.id
                        );

                        if (tradeBot > -1) {
                            const data = [...tradeBotsRef.current];
                            if (
                                data[tradeBot].currentSession != null &&
                                data[tradeBot].currentSession.id == message.currentSession.id
                            )
                                return;

                            data[tradeBot] = {
                                ...data[tradeBot],
                                currentSession: message.currentSession,
                            };
                            dispatch(changeUserTradeBotsState(data));

                            setTradeBots(data);
                        }
                    });
                    connection.on('TradeBotOrderUpdate', message => {
                        const tradeBotIdx = tradeBotsRef.current.findIndex(
                            (i) => message.lastOrder.tradeBotId == i.id
                        );
                
                        if (tradeBotIdx > -1) {
                
                            const data = [...tradeBotsRef.current];
                            if (
                                data[tradeBotIdx].lastOrder != null &&
                                data[tradeBotIdx].lastOrder.id == message.lastOrder.id
                            )
                                return;
                
                            data[tradeBotIdx] = {
                                ...data[tradeBotIdx],
                                lastOrder: message.lastOrder,
                            };
                            setTradeBots(data);
                            dispatch(changeUserTradeBotsState(data));
                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        const fetchData = async () => {
            const bots = await getUserTradeBots();
            console.log(bots)
            // dispatch(changeUserTradeBotsState(bots));
            setTradeBots(bots);
            //init = true;
        };
        // if (userTradeBots != null) {
        //   setTradeBots(userTradeBots);
        // } else {
        //   fetchData();
        // }
        // const {addtest} = router.query;
        // if(addtest &&  userProfile){
        //   //router.replace('/trade-bots', undefined, { shallow: true });
        //   setTradeWalletData(userProfile.wallets[0]);
        //   setShowModal(true);
        // }
        fetchData();
    }, []);


    //   useSelector((state: any) => {
    //     const message = state.signalrRMode.value;
    //     if(!tradeBots || message == null) return;
    //     console.log(message.id)

    //     if(message.lastOrder) {
    //       const tradeBotIdx = tradeBots.findIndex(
    //         (i) => message?.lastOrder.tradeBotId == i.id
    //       );

    //       if (tradeBotIdx > -1) {

    //         const data = [...tradeBots];
    //         if (
    //           data[tradeBotIdx].lastOrder != null &&
    //           data[tradeBotIdx].lastOrder.id == message.lastOrder.id
    //         )
    //           return;

    //         data[tradeBotIdx] = {
    //           ...data[tradeBotIdx],
    //           lastOrder: message.lastOrder,
    //         };
    //         setTradeBots(data);
    //         dispatch(changeUserTradeBotsState(data));
    //       }
    //     }
    //     if(message.currentSession) {
    //       const tradeBot = tradeBots.findIndex(
    //         (i) => message?.currentSession.tradeBotId == i.id
    //       );

    //       if (tradeBot > -1) {
    //         const data = [...tradeBots];
    //         if (
    //           data[tradeBot].currentSession != null &&
    //           data[tradeBot].currentSession.id == message.currentSession.id
    //         )
    //           return;

    //         data[tradeBot] = {
    //           ...data[tradeBot],
    //           currentSession: message.currentSession,
    //         };
    //         dispatch(changeUserTradeBotsState(data));

    //         setTradeBots(data);
    //       }
    //     }

    //   });


    return {
        user,
        setUser,
        tradeBots
    };
}

const authContext = createContext<AuthContext>(null!);

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
export const useAuth = () => {
    return useContext(authContext);
};
