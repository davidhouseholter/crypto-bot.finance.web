import { Dialog, Listbox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTradePairState } from "../../pkg/redux/reducers/tradePairs";
import {
  changeUserTradeBotsState,
} from "../../pkg/redux/reducers/userTradeBots";
import {
  getTradePairs,
  postStartUserTradeBot,
  putStartUserTradeBot,
  startUserTradeBot,
  stopUserTradeBot,
} from "../../pkg/services/tradeBotServices";

export default function AddTradeBotModal({
  setShowModal,
  wallets,
  tradeWalletData,
  editTradeBot
}) {
  const open = true;
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const userTradeBots = useSelector(
    (state: any) => state.userTradeBostMode.value as any[]
  );

  const [coins, setCoins] = useState<any[]>();
  const [selected, setSelected] = useState(tradeWalletData ? tradeWalletData : wallets[0]);
  const [newTradeBot, setNewTradeBot] = useState(editTradeBot ? editTradeBot : {
    id: 0,
    name: "",
    active: true,
    useUSD: true,
    test: true,
    coin: "",
    funds: 0,
    pair: "USD",
    externalId: "",
    tradeWalletId: selected.id,
    targetSellPercent: 2.5,
    peakVarianceDropSell: 0.5,
    targetBuyPercent: 1.5,
    peakVarianceRiseBuy: 0.5,
    intervalId: 1,
  });
console.log(newTradeBot)
  const [selectedPair, setSelectedPair] = useState<any>();

  const coinPairs = useSelector(
    (state: any) => state.changeTradePairMode.value
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const coins = await getTradePairs();
      dispatch(changeTradePairState(coins.data));
      setCoins(coinPairs);
    };
    if (coinPairs != null) {
      setCoins(coinPairs);
    } else {
      fetchData();
    }
  }, [coinPairs, dispatch]);
  const startNewTradeBot = async () => {
    if(newTradeBot.id == 0) {
      const result = await postStartUserTradeBot(newTradeBot);
    
      dispatch(changeUserTradeBotsState([...userTradeBots, result.data]));
      setShowModal(false);
    } else {
      const result = await putStartUserTradeBot(newTradeBot);
    
      dispatch(changeUserTradeBotsState([...userTradeBots.filter(i => i.id != newTradeBot.id), result.data]));
      setShowModal(false);
    }

  };
const stopBot = async () => {

  const result = await stopUserTradeBot(newTradeBot);
  dispatch(changeUserTradeBotsState([...userTradeBots.filter(i => i.id != newTradeBot.id), {...newTradeBot, active:false}]));
  setShowModal(false);
}
const startBot = async () => {
  const result = await startUserTradeBot(newTradeBot);
  dispatch(changeUserTradeBotsState([...userTradeBots.filter(i => i.id != newTradeBot.id), {...newTradeBot, active:true}]));
  setShowModal(false);
}

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={setShowModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full  p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left  shadow-xl transform transition-all md:max-w-xl sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  {newTradeBot.id <= 0 ? "Add" : "Edit"} Trade Bot
                </Dialog.Title>
                {/*body*/}
                { newTradeBot.id <= 0 && (
                <Listbox
                  value={selected}
                  onChange={(value: any) => {
                    setSelected(value);
                    setNewTradeBot({ ...newTradeBot, tradeWalletId: value.id });
                  }}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Wallet
                      </Listbox.Label>
                      <div className="mt-1 relative">
                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <span className="block truncate">
                            {selected.name}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <SelectorIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {wallets.map((person) => (
                              <Listbox.Option
                                key={person.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-indigo-600"
                                      : "text-gray-900",
                                    "cursor-default select-none relative py-2 pl-3 pr-9"
                                  )
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox> 
                )}
                <div className="form-group mt-4">
                  <label
                    htmlFor="tradeBotName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="tradeBotName"
                    value={newTradeBot.name}
                    onChange={(e) => {
                      setNewTradeBot({ ...newTradeBot, name: e.target.value });
                    }}
                    id="tradeBotName"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Trade Bot Name"
                  />
                </div>
                { newTradeBot.id <= 0 && (
                <div className="relative flex items-start mt-4 mb-4">
                  <div className="flex items-center h-5">
                    <input
                      id="tradeBotTest"
                      aria-describedby="tradeBotTest-description"
                      name="tradeBotTest"
                      type="checkbox"
                      checked={ newTradeBot.test}
                      onChange={(e) => {console.log(e.target);setNewTradeBot({...newTradeBot, test: e.target.value == 'on'})}}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="tradeBotTest"
                      className="font-medium text-gray-700"
                    >
                      Test Bot
                    </label>
                    
                  </div>
                </div>)}
             { newTradeBot.id <= 0 && (
                  <div className="form-group" style={{minHeight: '46px'}}>
                  <Listbox
                    value={newTradeBot.coin}
                    onChange={(value: any) => {
                      setSelectedPair(value);
                      setNewTradeBot({ ...newTradeBot, coin: value.currency });
                    }}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">
                          Choose Pairs
                        </Listbox.Label>
                        <div className="mt-1 relative">
                          <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <span className="block truncate">
                              {selectedPair?.currency}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {coins &&
                                coins.map((coin) => (
                                  <Listbox.Option
                                    key={coin.id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-indigo-600"
                                          : "text-gray-900",
                                        "cursor-default select-none relative py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={coin}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate"
                                          )}
                                        >
                                          {coin.currency}
                                        </span>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
             )

             }
                <div className="form-group">
                  <label
                    htmlFor="tradeBotFunds"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Funds
                  </label>
                  <input
                    type="number"
                    name="tradeBotFunds"
                    value={newTradeBot.funds}
                    onChange={(e) => {
                      setNewTradeBot({
                        ...newTradeBot,
                        funds: e.target.value as any,
                      });
                    }}
                    id="tradeBotFunds"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Target Buy Percent"
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="tradeBotTargetBuy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Target Sell Percent
                  </label>
                  <input
                    type="number"
                    name="targetSellPercent"
                    value={newTradeBot.targetSellPercent}
                    onChange={(e) => {
                      setNewTradeBot({
                        ...newTradeBot,
                        targetSellPercent: e.target.value as any,
                      });
                    }}
                    id="targetSellPercent"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Target Sell Percent"
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="tradeBotTargetBuy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Target Buy Percent
                  </label>
                  <input
                    type="number"
                    name="tradeBotTargetBuy"
                    value={newTradeBot.targetBuyPercent}
                    onChange={(e) => {
                      setNewTradeBot({
                        ...newTradeBot,
                        targetBuyPercent: e.target.value as any,
                      });
                    }}
                    id="tradeBotTargetBuy"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Target Buy Percent"
                  />
                </div>
{ newTradeBot.id > 0 && (
                <div className="mt-20">
                 {newTradeBot.active && (
                    <button
                    type="button"
                    className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    onClick={() => stopBot()}
                  >
                    Stop
                  </button>
                 )}
                   {!newTradeBot.active && (
                    <button
                    type="button"
                    className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    onClick={() => startBot()}
                  >
                    Start
                  </button>
                 )}
                </div> )}
             
{/* 
                <div className="mt-20">
                  <pre>{JSON.stringify(newTradeBot, null, 2)}</pre>
                </div> */}

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    onClick={() => startNewTradeBot()}
                  >
                    {newTradeBot.id <= 0 ? "Start" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
