
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { useDispatch, useSelector } from "react-redux";
import { onUpdateSignarState } from '../reducers/signalr';

const URL = process.env.HUB_ADDRESS ?? "https://api.crypto-bot.finance/hub/user"; 
let options = {
  transport: HttpTransportType.ServerSentEvents,
  logging: LogLevel.Information,
  withCredentials: true,
  skipNegotiation: false
};
export default class Connector {

  public connection: HubConnection;
 

  // public events: (onMessageReceived: (event: string, data: any) => void) => void;

  static instance: Connector;

  constructor() {

    this.connection = new HubConnectionBuilder()
      .withUrl(URL, options)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.start().then(() => { }).catch(err => console.log(err));

    this.connection.on("AccountNotification", (data: any) => {
      const dispatch = useDispatch();
      const update = {event:"AccountNotification", data:data}
      dispatch(onUpdateSignarState(update))
    });
    this.connection.on("TradeBotSessionUpdate", (data) => {
      const dispatch = useDispatch();
      const update = {event:"TradeBotSessionUpdate", data:data}
      dispatch(onUpdateSignarState(update))
    });
  }

  public register(name: string, handle: ((data: any) => void)) {
    this.connection?.on(name, handle);
  }

  public newMessage = (messages: string) => {
    this.connection.send("newMessage", "foo", messages).then(x => console.log("sent"))
  }

  public static getInstance(): Connector {

    if (!Connector.instance) {
      Connector.instance = new Connector();
    }
    return Connector.instance;
  }
}