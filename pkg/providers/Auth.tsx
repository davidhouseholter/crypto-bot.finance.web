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
    setTradeBots: (p: any | undefined) => void;
    coins: any[];
    setCoins: (p: any | undefined) => void;
}

// Provider hook that creates auth object and handles state
export function useProvideAuth(): AuthContext {
    const [user, setUser] = useState<any | undefined>({ name: "adfds" });
    const [tradeBots, setTradeBots] = useState<any[]>([]);
    const [coins, setCoins] = useState<any[]>([]);

    const userProfile = useSelector((state: any) => state.userProfileMode.value);
    const [connection, setConnection] = useState<any | null>(null);
    const tradeBotsRef = useRef<any[]>([]);
    tradeBotsRef.current = tradeBots;
    // {
    //     skipNegotiation: true,
    //     transport: HttpTransportType.WebSockets,
    // }
    const dispatch = useDispatch();
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Information)
            .withUrl(`${api}/hub/user`)
            .withAutomaticReconnect()
            .build();
        setConnection(connection);
    }, []);
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    //console.log('Connected!');

                    connection.on('TradeBotSessionUpdate', message => {
                        //console.log('TradeBotSessionUpdate', message)
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
                        console.log('TradeBotOrderUpdate', message)
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
                                totalOrders: data[tradeBotIdx].totalOrders + 1,
                                lastOrder: message.lastOrder,
                            };
                            setTradeBots(data);
                            dispatch(changeUserTradeBotsState(data));
                        }
                        else {
                            
                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        const fetchData = async () => {
            const bots = await getUserTradeBots();
            // dispatch(changeUserTradeBotsState(bots));
            setTradeBots(bots);
        };
    
        fetchData();
    }, []);

    return {
        user,
        setUser,
        tradeBots,
        setTradeBots,
        coins,
        setCoins
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
