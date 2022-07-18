import { useState } from "react";
import { useSelector } from "react-redux";
import AddTradeBotModal from "../components/tradebots/add-trade-bot";
import AddTradeWalletModal, {
  TradeWalletViewModel,
} from "../components/tradebots/add-trade-wallet";
import { useRouter } from "next/router";
import { BeakerIcon, CurrencyDollarIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useAuth } from "../pkg/providers/Auth";

let init = false;
export default function TradeBotsPage() {
  const { user, tradeBots } = useAuth();
  const [editTradeBot, setEditTradeBot] = useState<any>(null);

  //const user = useSelector((state: any) => state.userMode.value);

  const [showModal, setShowModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [tradeWalletData, setTradeWalletData] = useState<any>(
    new TradeWalletViewModel()
  );
  const router = useRouter();
  const addTradeWallet = (modalState, tradeWallet: any = null) => {
    if (tradeWallet != null) {
      setTradeWalletData(tradeWallet);
      setShowAddWalletModal(false);
      setShowModal(true);
    }
    setShowAddWalletModal(modalState);
  };
  const onAddTradeBot = (showModal, addTradeWallet = false) => {
    setShowModal(showModal)
    setShowAddWalletModal(addTradeWallet)
  }
  const addTradeBot = () => {
    setEditTradeBot(null)
    setTradeWalletData(null)
    console.log(user);
    if (user.wallets.length == 0) {
      setShowAddWalletModal(true);
    } else {
      setShowModal(true);
    }
  };

  return user && (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all
          </p> */}
        </div>
        <div className=" sm:flex-none">
          <>
            <button
              className=" mt-4 sm:mt-0 sm:ml-16 bg-blue-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => addTradeBot()}
            >
              Add Trade Bot
            </button>
            {showModal ? (
              <>
                <AddTradeBotModal
                  setShowModal={onAddTradeBot}
                  wallets={user.wallets}
                  tradeWalletData={tradeWalletData}
                  editTradeBot={editTradeBot}
                />
              </>
            ) : null}
            {showAddWalletModal ? (
              <>
                <AddTradeWalletModal setShowModal={addTradeWallet} wallets={user.wallets} />
              </>
            ) : null}
          </>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Current Target
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Funds
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Orders
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Last Order
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Order Date
                    </th>

                    {/* <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Current Price
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Bot Details
                  </th> */}
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tradeBots && tradeBots.map((bot) => (
                    <tr
                      className="cursor-pointer hover:bg-blue-100"
                      key={bot.id}
                      onClick={(e) => {
                        router.push(`/trade-bots/${bot.id}`);
                      }}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 w-1/6">

                        <span>
                          {!bot.active && "stopped"}
                          {/*
                            <i *ngIf="!bot.active" class="red icon ion-md-close-circle-outline"></i>
                            <i *ngIf="bot.loading" class="icon ion-md-add-circle-outline"></i>
                            <i *ngIf="bot.pending" class="icon ion-md-warning"><span
                                class="ms-2">Pending</span></i> */}
                        </span>
                        {/* `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/${style}/${name}.svg`; */}
                        <p className="flex">
                          <span>

                            <Image
                              src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${`${bot.coin}`.toLowerCase()}.svg`}

                              width="32px" height="32px"
                            />

                           {/* <p></p> */}
                          </span>
                          <span className="ml-3">

                          </span>
                          <span className="flex"> {bot.test && (<BeakerIcon className="h-5 w-5 text-blue-500" />)} {bot.coin}{bot.name != "" && (<>: {bot.name}</>)}</span>
                        </p>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {bot.currentSession == null ? (
                          "loading"
                        ) : (
                          <>
                            {bot.lastOrder && (
                              <>
                                <>
                                  {bot.lastOrder.orderSide == 1 ? (
                                    <>
                                      {bot.currentSession.percent >
                                        bot.currentSession?.targetPercent && (
                                          <span className="text-green-500">
                                            {bot.currentSession?.percent.toFixed(2)}%
                                          </span>
                                        )}
                                      {bot.currentSession?.percent >= 0 &&
                                        bot.currentSession?.percent <=
                                        bot.currentSession?.targetPercent && (
                                          <span className="">
                                            {bot.currentSession?.percent.toFixed(2)}%
                                          </span>
                                        )}
                                      {bot.currentSession?.percent < 0 && (
                                        <span className="text-red-500">
                                          {bot.currentSession?.percent.toFixed(2)}%
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {/* {bot.currentSession?.percent < 0 && (
                                        <>  {-1 * bot.currentSession?.percent.toFixed(2)}% <span className="text-red-500">(above sell)</span></>
                                      )}
                                      {bot.currentSession?.percent >= 0 && (
                                        <>  {bot.currentSession?.percent.toFixed(2)}%</>
                                      )} */}

                                      {bot.currentSession.percent >
                                        bot.currentSession?.targetPercent && (
                                          <span className="text-green-500 flex ">
                                            <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mr-2"></CurrencyDollarIcon>   {bot.currentSession?.percent.toFixed(2)}%
                                          </span>
                                        )}
                                      {bot.currentSession?.percent >= 0 &&
                                        bot.currentSession?.percent <=
                                        bot.currentSession?.targetPercent && (
                                          <span className="text-yellow-500">
                                            {bot.currentSession?.percent.toFixed(2)}%
                                          </span>
                                        )}
                                      {bot.currentSession?.percent < 0 && (
                                        <span className="text-red-500">
                                          {bot.currentSession?.percent.toFixed(2)}% (Above)
                                        </span>
                                      )}

                                    </>
                                  )}
                                </>
                              </>
                            )}
                          </>
                        )}

                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <p>{bot.funds}</p>
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <p>{bot.totalOrders}</p>
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {bot.lastOrder && (<>
                          {bot.lastOrder?.orderSide == 1 ? (
                            <p>Buy: ${bot.lastOrder.price}</p>
                          ) : (
                            <p>
                              Sell: {bot.lastOrder.profit} (
                              {bot.lastOrder.percent.toFixed(2)}%)
                            </p>
                          )}
                        </>)}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <p>{new Date(bot.lastOrder?.marketOrderCreatedAt).toLocaleString()}</p>
                      </td>

                      {/* <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {bot.currentSession == null ? (
                          "loading"
                        ) : (
                          <span>
                            Price: ${bot.currentSession.price} _ Target: $
                            {bot.currentSession.targetPrice}
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <p>
                          {bot.targetSellPercent} ({bot.peakVarianceDropSell} )
                          {bot.targetBuyPercent} ({bot.peakVarianceDropSell})
                        </p>
                      </td> */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {/* (click)="onEditTradeBot(bot)" */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTradeBot(bot)
                            setShowModal(true)
                          }}
                          type="button"
                          className="w-full rounded-md border border-transparent shadow-sm hover:bg-blue-500 bg-gray-300"
                        >  Edit  </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
