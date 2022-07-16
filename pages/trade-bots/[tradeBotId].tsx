import Image from "next/image";
import { useRouter } from "next/router";
import { Confirm, Notify } from "notiflix";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdvancedChart } from "react-tradingview-embed";
import AddTradeBotModal from "../../components/tradebots/add-trade-bot";
import { useAuth } from "../../pkg/providers/Auth";
import { changeUserTradeBotsState } from "../../pkg/redux/reducers/userTradeBots";
import {
  createTradeBotOrder,
  getUserTradeBotById,
  getUserTradeBotOrdersById,
  getUserTradeBots,
  stopUserTradeBot,
} from "../../pkg/services/tradeBotServices";

export default function TradeBotDetails() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { tradeBots } = useAuth();
  const [tradeBot, setTradeBot] = useState<any>();

  const [tradeBotOrders, setTradeBotOrders] = useState<any[]>([]);

  // const tradeBotsData = useSelector((state: any) => state.userTradeBotsMode?.value);
  const tradeBotId = router.query.tradeBotId ? +router.query.tradeBotId : 0;
  // console.log(tradeBot)
  // const match = tradeBots.find(i => i.id == tradeBotId);
  const [botDetails, setBotDetails] = useState<any>(null);
  useEffect(() => {
  }, [tradeBotId]);
  useEffect(() => {
    const fetchTradeBotData = async () => {
      const bot = await getUserTradeBotById(tradeBotId);
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
    const botMatchDetails = tradeBots.find(i => i.id == tradeBotId);
    if (botMatchDetails) {
      setBotDetails(botMatchDetails);
      fetchTradeBotOrderData();
    } else {
      fetchTradeBotData();
    }

  }, [tradeBotId]);

  useEffect(() => {
    if (tradeBots == null) return;
    const message = tradeBots.find(i => i.id == tradeBotId);
    if (!botDetails || message == null) return;
    if (message.lastOrder) {

      if (botDetails.lastOrder == null || message.lastOrder.id != botDetails.lastOrder.id) {
        setBotDetails({ ...botDetails, lastOrder: message.lastOrder });
      }
    }
    if (message.currentSession) {
      if (botDetails.currentSession == null || message.currentSession.id != botDetails.currentSession.id) {
        setBotDetails({ ...botDetails, currentSession: message.currentSession });
      }
    }
  }, [tradeBots]);


  const onAddTradeBot = (showModal, newBot: any = null) => {
    setShowModal(showModal)
    if (newBot != null) {
      setBotDetails({ ...botDetails, ...newBot })
    }

  }
  const onCreateOrder = () => {
    Confirm.show(
      'Create New Order',
      'This will create a new market order at the current price fopposite of the last order. It will sell the last units bought or but for the funds of the bot.',
      'Yes',
      'No',
      async () => {
        try {
          const result = await createTradeBotOrder(botDetails);
          if (result) {
            console.log(result);
          }
          const orders = await getUserTradeBotOrdersById(tradeBotId);
          setTradeBotOrders(orders);
          setShowModal(false);
        } catch (e) {
          Notify.failure('Request Failed');
        }
      }, () => { }, {},
    );
  };
  const [showModal, setShowModal] = useState(false);
  const userProfile = useSelector((state: any) => state.userProfileMode.value);

  return (
    botDetails && (
      <>
        {showModal ? (
          <>
            <AddTradeBotModal
              setShowModal={onAddTradeBot}
              wallets={userProfile.wallets}
              tradeWalletData={{}}
              editTradeBot={botDetails}
            />
          </>
        ) : null}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className=" overflow-hidden sm:rounded-lg">
            <div className="py-5">
              <div className="flex ">

                <div className="flex items-center gap-4 rounded-lg p-5 bg-white shadow-card dark:bg-light-dark lg:flex-row">
                  <div className="w-full flex-col">
                    <div className="mb-3 flex items-center">
                      <Image
                        src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${`${botDetails.coin}`.toLowerCase()}.svg`}

                        width="32px" height="32px"
                      />
                      <h4 className="text-sm font-medium text-gray-900 ltr:ml-3 rtl:mr-3 dark:text-white">{botDetails.coin}{botDetails.name != "" && (<>: {botDetails.name}</>)}</h4>
                     
                    </div>
                    <p>${botDetails.currentSession?.price.toFixed(2)}</p>
                  </div>
                </div>
                {!botDetails.active && (
                  <div className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-card dark:bg-light-dark lg:flex-row">
                    <div className="w-full flex-col">
                      <div className="mb-3 flex items-center">

                        <p className=" text-sm text-gray-500">
                          Stopped
                        </p>
                      </div>
                    </div>
                  </div>

                )}

                <div className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-card dark:bg-light-dark lg:flex-row">
                  <div className="w-full flex-col">
                    <div className="mb-3 flex items-center">
                      <p className=" text-sm text-gray-500">
                        Wallet: {botDetails.tradeWallet.name}
                      </p>
                    </div>
                  </div>
                </div>



              </div>
            </div>

            <section className="bg-white shadow-card border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-black-500">
                    Total Orders
                  </dt>
                  <dd className="mt-1 ">
                    {botDetails.totalOrders}
                    {/* <p className="text-sm text-gray-900">
                      {new Date(
                        botDetails.lastOrder?.dateCreated + "Z"
                      ).toLocaleString()}
                    </p> */}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-black-500">
                    Current
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <p>
                      {botDetails.currentSession?.percent.toFixed(2)}%
                    </p>
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Peak
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
                  <dt className="text-sm font-medium text-gray-500">Funds</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${botDetails.funds}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Actions</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div>
                      {/*  */}
                      <button type="button"
                        onClick={() => { setShowModal(true) }}
                        className="w-full rounded-md border border-transparent shadow-sm hover:bg-blue-700 bg-blue-500">Edit</button>
                      {/* (click)="onCreateTradeBotOrder()" */}
                      <button type="button"
                        onClick={() => onCreateOrder()}
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
            </section>
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
