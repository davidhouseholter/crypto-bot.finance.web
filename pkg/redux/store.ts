import { configureStore } from '@reduxjs/toolkit'
import themeModeReducer from './reducers/darkMode'
import userIdentityModeReducer from './reducers/userIdentityState'
import userProfileStateModeReducer from './reducers/userProfileState'
import userTradeBotsModeReducer from './reducers/userTradeBots'
import tradePairsReducer from './reducers/tradePairs'
import signarReducer, { onUpdateOrderSignarState, onUpdateSignarState } from './reducers/signalr'

import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { withCallbacks } from '../signalr/helpers'
import signalMiddleware from '../signalr/signalr-middleware'
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Error)
  .withUrl(`${api}/hub/user`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .withAutomaticReconnect()
  .build();
const callbacks = withCallbacks()
  .add('TradeBotSessionUpdate', (msg: string) => (dispatch) => {
    // console.log(msg)
    dispatch(onUpdateSignarState(msg));
  })
  .add('TradeBotOrderUpdate', (msg: string) => (dispatch) => {
   // console.log('TradeBotOrderUpdate', msg)
    dispatch(onUpdateOrderSignarState(msg));
  });
  
const signal = signalMiddleware({
  callbacks,
  connection,
  shouldConnectionStartImmediately:false
});
export const store = configureStore({
  middleware: [signal],
  reducer: {
    themeMode: themeModeReducer,
    userIdentityMode: userIdentityModeReducer,
    userProfileMode: userProfileStateModeReducer,
    userTradeBostMode: userTradeBotsModeReducer,
    changeTradePairMode: tradePairsReducer,
    signalrRMode: signarReducer,

  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch