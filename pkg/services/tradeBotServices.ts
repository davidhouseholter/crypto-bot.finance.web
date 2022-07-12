import axios from "axios";
import { TradeWalletViewModel } from "../../components/tradebots/add-trade-wallet";
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;

export function getUserTradeBots() {
    return axios.get(`${api}/user/trade-bot`,{withCredentials: true})
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error.data;
      });
}
export function getUserTradeBotById(id: number) {
  return axios.get(`${api}/user/trade-bot/${id}`,{withCredentials: true})
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.data;
    });
}

export function getUserTradeBotOrdersById(id: number) {
  return axios.get(`${api}/user/trade-bot/${id}/orders`,{withCredentials: true})
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.data;
    });
}

export function saveTradeWallet(newTradeWallet: TradeWalletViewModel) {
  return axios.post(`${api}/user/trade-wallet`, newTradeWallet, {withCredentials: true});
}

export function getTradeWalletProfiles(newTradeWallet: TradeWalletViewModel) {
  return axios.post(`${api}/user/trade-wallet/get-profiles`, newTradeWallet, {withCredentials: true});
}

export function getTradePairs() {
  return axios.get(`${api}/home/pairs`, {withCredentials: true});
}

export function postStartUserTradeBot(tradeBot: any) {
  return axios.post(`${api}/user/trade-bot`, tradeBot, {withCredentials: true});
}

export function putStartUserTradeBot(tradeBot: any) {
  return axios.put(`${api}/user/trade-bot/${tradeBot.id}`, tradeBot, {withCredentials: true});
}

export function startUserTradeBot(tradeBot: any) {
  return axios.put(`${api}/user/trade-bot/${tradeBot.id}/start`, tradeBot, {withCredentials: true});
}
export function stopUserTradeBot(tradeBot: any) {
  return axios.put(`${api}/user/trade-bot/${tradeBot.id}/stop`, tradeBot, {withCredentials: true});
}
export function deleteUserTradeBot(tradeBot: any) {
  return axios.delete(`${api}/user/trade-bot/${tradeBot.id}`, {withCredentials: true});
}

export function  createTradeBotOrder(tradeBot: any) {
  return axios.post<any>(`${api}/user/trade-bot/${tradeBot.id}/orders/create`, null, {withCredentials: true})
}