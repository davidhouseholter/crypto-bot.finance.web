import { PaperClipIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserTradeBotsState } from "../../pkg/redux/reducers/userTradeBots";
import {
  getUserTradeBotById,
  getUserTradeBotOrdersById,
  getUserTradeBots,
} from "../../pkg/services/tradeBotServices";

let tradeBotDetails: any = null;

export default function TradeBotDetails() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [botDetails, setBotDetails] = useState<any>();
  const [tradeBots, setTradeBots] = useState<any[]>([]);
  const [tradeBotOrders, setTradeBotOrders] = useState<any[]>([]);
  const dispatch = useDispatch();

  const tradeBotsData = useSelector((state: any) => state.userTradeBotsMode?.value);
  const tradeBotId = router.query.tradeBotId ? +router.query.tradeBotId : 0;
  useEffect(() => {
    const fetchTradeBotData = async () => {
      const bot = await getUserTradeBotById(tradeBotId);
      tradeBotDetails = bot;
      setBotDetails(bot);
      fetchTradeBotOrderData();

    };
    const fetchTradeBotOrderData = async () => {
      const orders = await getUserTradeBotOrdersById(tradeBotId);
      setTradeBotOrders(orders);
    };

    if (tradeBotId == 0) {
      return;
    }
    if (tradeBotDetails != null && tradeBotDetails.id == tradeBotId) {
      setBotDetails(tradeBotDetails);

      fetchTradeBotOrderData();
    } else {
      fetchTradeBotData();
    }
  }, [tradeBotId]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const bots = await getUserTradeBots();
  //     dispatch(changeUserTradeBotsState(bots));
  //     setTradeBots(bots);
  //   };
  //   if (tradeBotsData != null) {
  //     setTradeBots(tradeBotsData);
  //   } else {
  //     fetchData();
  //   }

  // }, [dispatch, router, tradeBotsData]);

  useSelector((state: any) => {
    const message = state.signalrRMode.value;
    
    if (!botDetails || message == null) return;
    if (message.lastOrder) {

      if (botDetails.lastOrder == null) {
        setBotDetails({ ...botDetails, lastOrder: message.lastOrder });
      }
      if (botDetails.id != message.lastOrder.tradeBotId) return;
      if (message.lastOrder.id == botDetails.lastOrder.id) return;
      // setBotDetails({ ...botDetails, lastOrder: message.lastOrder });
      // const tradeBot = tradeBots.findIndex(
      //   (i) => message?.lastOrder.tradeBotId == i.id
      // );

      // if (tradeBot > -1) {

      //   const data = [...tradeBots];
      //   if (
      //     data[tradeBot].lastOrder != null &&
      //     data[tradeBot].lastOrder.id == message.lastOrder.id
      //   )
      //     return;

      //   data[tradeBot] = {
      //     ...data[tradeBot],
      //     lastOrder: message.lastOrder,
      //   };
      //   setTradeBots(data);

      //   dispatch(changeUserTradeBotsState(data));
      // }
    }
    if (message.currentSession) {
      console.log(message.currentSession.tradeBotId)
      if (botDetails.currentSession == null) {
        setBotDetails({ ...botDetails, currentSession: message.currentSession });
        return;
      }
      if (botDetails.id != message.currentSession.tradeBotId) return;
      if (message.currentSession.id == botDetails.currentSession.id) return;
      setBotDetails({ ...botDetails, currentSession: message.currentSession });
      // const tradeBot = tradeBots.findIndex(
      //   (i) => message?.currentSession.tradeBotId == i.id
      // );

      // if (tradeBot > -1) {
      //   const data = [...tradeBots];
      //   if (
      //     data[tradeBot].currentSession != null &&
      //     data[tradeBot].currentSession.id == message.currentSession.id
      //   )
      //     return;

      //   data[tradeBot] = {
      //     ...data[tradeBot],
      //     currentSession: message.currentSession,
      //   };

      //   setTradeBots(data);
      // }
    }

  });
  // useSelector((state: any) => {
  //   const message = state.signalrRMode.value;
  //   if (!tradeBots || message == null) return;
  //   if (message.lastOrder) {
  //     const tradeBot = tradeBots.findIndex(
  //       (i) => message?.lastOrder.tradeBotId == i.id
  //     );

  //     if (tradeBot > -1) {
  //       const data = [...tradeBots];
  //       if (
  //         data[tradeBot].lastOrder != null &&
  //         data[tradeBot].lastOrder.id == message.lastOrder.id
  //       )
  //         return;

  //       data[tradeBot] = {
  //         ...data[tradeBot],
  //         lastOrder: message.lastOrder,
  //       };
  //       dispatch(changeUserTradeBotsState(data));
  //     }
  //   }
  //   if (message.currentSession) {
  //     const tradeBot = tradeBots.findIndex(
  //       (i) => message?.currentSession.tradeBotId == i.id
  //     );

  //     if (tradeBot > -1) {
  //       const data = [...tradeBots];
  //       if (
  //         data[tradeBot].currentSession != null &&
  //         data[tradeBot].currentSession.id == message.currentSession.id
  //       )
  //         return;

  //       data[tradeBot] = {
  //         ...data[tradeBot],
  //         currentSession: message.currentSession,
  //       };
  //       dispatch(changeUserTradeBotsState(data));
  //     }
  //   }
  // });
  useSelector((state: any) => {
    const message = state.signalrRMode.value;

    if (!botDetails || message == null) return;

    if (message.lastOrder && message.lastOrder.tradeBotId == botDetails.id) {
      if (botDetails.id == message.lastOrder.tradeBotId) {
        if (botDetails.lastOrder == null) {
          botDetails.lastOrder = message.lastOrder;
          setBotDetails(botDetails);
        }
        if (message.lastOrder.id != botDetails.lastOrder.id) {
          botDetails.lastOrder = message.lastOrder;
          setBotDetails(botDetails);
        }
      }
    }
    if (
      message.currentSession &&
      botDetails.id == message.currentSession.tradeBotId
    ) {
      if (botDetails.id == message.currentSession.tradeBotId) {
        if (botDetails.currentSession == null) {
          botDetails.currentSession = message.currentSession;
          setBotDetails(botDetails);
          console.log("1", botDetails, message);
        }
        if (message.currentSession.id != botDetails.currentSession.id) {
          botDetails.currentSession = message.currentSession;
          setBotDetails(botDetails);
        }
      }
    }
  });
  return (
    botDetails && (
      <>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex ">
                <h3 className="text-xl leading-6 font-medium text-gray-900">
                  {botDetails.name}
                </h3>
                {botDetails.lastOrder && botDetails.currentSession && (
                  <span className="ml-2">
                    <>
                      {botDetails.lastOrder.orderSide == 1 ? (
                        <>
                          {botDetails.currentSession.percent >
                            botDetails.currentSession?.targetPercent && (
                              <span className="text-green-500">
                                {botDetails.currentSession?.percent.toFixed(2)}%
                              </span>
                            )}
                          {botDetails.currentSession?.percent >= 0 &&
                            botDetails.currentSession?.percent <=
                            botDetails.currentSession?.targetPercent && (
                              <span className="">
                                {botDetails.currentSession?.percent.toFixed(2)}%
                              </span>
                            )}
                          {botDetails.currentSession?.percent < 0 && (
                            <span className="">
                              {botDetails.currentSession?.percent.toFixed(2)}%
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {botDetails.currentSession?.percent < 0 && (
                            <>
                              {" "}
                              {-1 * botDetails.currentSession?.percent}%
                              <span>(above sell)</span>
                            </>
                          )}
                          {botDetails.currentSession?.percent >= 0 && (
                            <> {botDetails.currentSession?.percent}%</>
                          )}
                        </>
                      )}
                    </>
                  </span>
                )}
              </div>
              <p className=" text-sm text-gray-500">
                Wallet: {botDetails.tradeWallet.name}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-black-500">
                    Total Orders
                  </dt>
                  <dd className="mt-1 ">
                    {botDetails.totalOrders}{" "}
                    <p className="text-sm text-gray-900">
                      {" "}
                      {new Date(
                        botDetails.lastOrder?.dateCreated + "Z"
                      ).toLocaleString()}
                    </p>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Current Peak
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <p>
                      {botDetails.currentSession?.peakPercent.toFixed(2)}% ( $
                      {botDetails.currentSession?.peakPrice.toFixed(6)})
                    </p>
                    {botDetails.currentSession?.allowance > 0 && (
                      <p>
                        Allowance:{" "}
                        {botDetails.currentSession?.allowance.toFixed(2)}%
                      </p>
                    )}

                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Current Target
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <p>
                      {botDetails.currentSession?.targetPercent.toFixed(2)}% ( $
                      {botDetails.currentSession?.targetPrice.toFixed(2)})
                    </p>
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Funds</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${botDetails.funds}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Actions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div>
                      {/* (click)="onEditTradeBot(bot)" */}
                      <button type="button"
                        className="w-full rounded-md border border-transparent shadow-sm hover:bg-blue-700 bg-blue-500">Edit</button>
                      {/* (click)="onCreateTradeBotOrder()" */}
                      <button type="button"
                        className="mt-4 w-full rounded-md border border-transparent shadow-sm hover:bg-blue-500 bg-gray-300">Order</button>
                    </div>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Target Settings
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <p>
                      <span className="mr-2 font-medium text-black-500">
                        Sell:                      </span>
                      {botDetails.targetSellPercent}% (
                      {botDetails.peakVarianceDropSell}%)
                    </p>
                    <p>
                      <span className="mr-2  font-medium text-black-500">
                        Buy:
                      </span>
                      {botDetails.targetBuyPercent}% (
                      {botDetails.peakVarianceDropSell}%)
                    </p>
                  </dd>
                </div>

                <div className="sm:col-span-6">
                  <dt className="text-sm font-medium text-gray-500">Orders</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Side
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Coins
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Value
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Fees
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Profit
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeBotOrders && tradeBotOrders.map &&
                          tradeBotOrders.map((order) => (
                            <tr key={order.id}>
                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                <p>{new Date(order.dateCreated + "Z").toLocaleString()}</p>
                              </td>
                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                <p>{order.orderSide == 1 ? "Buy" : "Sell"}</p>
                              </td>

                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                {order.coinsFilled}
                              </td>

                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                {order.price}
                              </td>
                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                {order.executedValue}
                              </td>

                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                {order.fillFees}
                              </td>

                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                <p>
                                  {order.orderSide == 2 && (<>${order.profit} ({order.percent.toFixed(2)} %)</>)}
                                </p>
                              </td>
                              <td
                                scope="col"
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                <p>
                                  {order.orderSide == 1 && (<>${order.funds}</>)}
                                  {order.orderSide == 2 && (<>${order.executedValue - order.fillFees}</>)}

                                </p>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {/* <div className="grid grid-cols-2">
            <div className="">
              <pre>{JSON.stringify(botDetails, null, 2)}</pre>
            </div>
            <div className="">
              <pre>{JSON.stringify(tradeBotOrders, null, 2)}</pre>
            </div>
          </div> */}
        </div>
      </>
    )
  );
}
