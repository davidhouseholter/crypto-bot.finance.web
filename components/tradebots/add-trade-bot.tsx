import { Dialog, Listbox, Transition } from "@headlessui/react";
import {
  SelectorIcon,
  CheckIcon,
  DotsVerticalIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { Fragment, useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTradePairState } from "../../pkg/redux/reducers/tradePairs";
import Notiflix, { Confirm } from "notiflix";
import { useRouter } from "next/router";

import {
  deleteUserTradeBot,
  getTradePairs,
  postStartUserTradeBot,
  putStartUserTradeBot,
  startUserTradeBot,
  stopUserTradeBot,
} from "../../pkg/services/tradeBotServices";
import { Popover } from "@headlessui/react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Image from "next/image";
import { useAuth } from "../../pkg/providers/Auth";
import Toggle from "../general/Toggle";
import { Tooltip } from "../general/ToolTip";

export default function AddTradeBotModal({
  setShowModal,
  wallets,
  tradeWalletData,
  editTradeBot,
}) {
  const open = true;
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [showAdvanced, showAdvancedSet] = useState(false);
  const [showAllCoins, showAllCoinsSet] = useState(false);
  const [test, testSet] = useState(true);

  const { tradeBots, setTradeBots, coins, setCoins } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(
    tradeWalletData ? tradeWalletData : wallets[0]
  );
  const [newTradeBot, setNewTradeBot] = useState(
    editTradeBot
      ? editTradeBot : {
        id: 0,
        name: "",
        active: true,
        useUSD: true,
        test: test,
        coin: "",
        funds: 1000,
        pair: "USD",
        externalId: "",
        tradeWalletId: selected.id,
        targetSellPercent: 2.5,
        peakVarianceDropSell: 0.5,
        targetBuyPercent: 1.5,
        peakVarianceRiseBuy: 0.5,
        intervalId: 1,
      }
  );
  const [selectedPair, setSelectedPair] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const coins = await getTradePairs();
      dispatch(changeTradePairState(coins.data));
      setCoins(coins.data);
    };
    if (coins && coins.length == 0) {
      fetchData();
    }
  }, [coins]);
  const startNewTradeBot = async () => {
    newTradeBot.test = test;

    if (loading) {
      return;
    }
    if (newTradeBot.coin == "") {
      Notiflix.Report.failure("Error", "Trade Pair Not Valid", "Continue");
      return;
    }
    if (newTradeBot.funds <= 0) {
      Notiflix.Report.failure("Error", "Funds Not Valid", "Continue");
      return;
    }

    setLoading(true);
    if (newTradeBot.id == 0) {
      const result = await postStartUserTradeBot(newTradeBot);
      console.log(result.data)

      if (!tradeBots) setTradeBots([result.data]);
      setTradeBots([...tradeBots, result.data]);
      setLoading(false);

      setShowModal(false);
    } else {
      const result = await putStartUserTradeBot(newTradeBot);
      if (tradeBots) {

        setTradeBots([
          ...tradeBots.filter((i) => i.id != newTradeBot.id),
          result.data,
        ])
      }
      setLoading(false);

      setShowModal(false);
    }
    Notiflix.Loading.remove();
  };
  const stopBot = async (close: Function) => {
    Confirm.show(
      'Stop Bot',
      'Do you want to stop the bot? It will still appear in the bot list.',
      'Yes',
      'No',
      async () => {
        try {
          const result = await stopUserTradeBot(newTradeBot);
          if (tradeBots) {
            setTradeBots([
              ...tradeBots.filter((i) => i.id != newTradeBot.id),
              { ...newTradeBot, active: false },
            ])
          }

          setShowModal(false, { ...newTradeBot, active: false });
        } catch (e) {
          Notify.failure('Request Failed');

        }
      },
      () => {

      },
      {
      },
    );


  };
  const startBot = async (close: Function) => {
    Confirm.show(
      'Start Bot',
      'Do you want to start the bot?',
      'Yes',
      'No',
      async () => {
        try {
          const result = await startUserTradeBot(newTradeBot);
          if (tradeBots) {
            setTradeBots([
              ...tradeBots.filter((i) => i.id != newTradeBot.id),
              { ...newTradeBot, active: true },
            ])
          }
          setShowModal(false, { ...newTradeBot, active: true });
        } catch (e) {
          Notify.failure('Request Failed');

        }
      },
      () => {

      },
      {
      },
    );


  };

  const deleteBot = async () => {
    Confirm.show(
      'Delete Bot?',
      'Do you want to delete the bot? It will no longer appear in the app.',
      'Yes',
      'No',
      async () => {
        try {
          const result = await deleteUserTradeBot(newTradeBot);
          setTradeBots([
            ...tradeBots.filter((i) => i.id != newTradeBot.id)
          ])
          setShowModal(false);
          router.push('/trade-bots')
        } catch {
          Notify.failure('Request Failed');

        }
      },
      () => {

      },
      {
      },
    );
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
              <Dialog.Panel className="relative bg-white rounded-lg text-left  shadow-xl transform transition-all md:max-w-xl sm:my-8 sm:max-w-sm sm:w-full">

                {/*body*/}
                <div className=" px-4 pt-5 pb-4 ">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    <div className="w-full inline-flex justify-between ">
                      <div>{newTradeBot.id <= 0 ? "Add" : "Edit"} Trade Bot </div>
                      {newTradeBot.id > 0 && (
                        <div className="ml-3 inline-flex sm:ml-0">
                          <Popover className="relative">
                            <Popover.Button>
                              <span className="sr-only">Open options menu</span>
                              <DotsVerticalIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </Popover.Button>

                            <Popover.Panel className="absolute z-10">
                              {({ close }) => (
                                <>
                                  {newTradeBot.active && (
                                    <button
                                      type="button"
                                      className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                                      onClick={() => stopBot(close)}
                                    >
                                      Stop
                                    </button>
                                  )}
                                  {!newTradeBot.active && (
                                    <button
                                      type="button"
                                      disabled={loading}
                                      className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                                      onClick={() => startBot(close)}
                                    >
                                      Start
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    disabled={loading}
                                    className="inline-flex mb-4 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                                    onClick={() => deleteBot()}
                                  >
                                    delete
                                  </button>
                                </>
                              )}

                            </Popover.Panel>
                          </Popover>
                        </div>

                      )}
                    </div>
                  </Dialog.Title>
                  {newTradeBot.id <= 0 && (
                    <Listbox
                      value={selected}
                      onChange={(value: any) => {
                        if (value != "new") {
                          setSelected(value);
                          setNewTradeBot({
                            ...newTradeBot,
                            tradeWalletId: value.id,
                          });
                        } else {
                          setShowModal(false, true);
                        }
                      }}
                    >
                      {({ open }) => (
                        <>
                          <Listbox.Label className="block text-sm font-medium text-gray-700 mt-5">
                            Exchange
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
                                <Listbox.Option
                                  key={"new"}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-indigo-600"
                                        : "text-gray-900",
                                      "cursor-default select-none relative py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={"new"}
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
                                        Add New Exchange
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
                  <div className="flex">
                    <div className="form-group mt-5">
                    <Tooltip message="How much $ do you want the bot to trade with.">
                    <label
                        htmlFor="tradeBotFunds"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Funds
                      </label>
                      </Tooltip>
                   
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


                    <div className="form-group mt-5 ml-5">

                      <Tooltip message="How much percent the bot will watch for from the last buy price to sell for profit gains.">
                        <label
                          htmlFor="targetSellPercent"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Target Sell %
                        </label>
                      </Tooltip>
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
                    <div className="form-group mt-5 ml-5">

                      <Tooltip message="How much percent the bot will watch for from the last sell price to buy back into the position.">
                        <label
                          htmlFor="tradeBotTargetBuy"
                          className="flex text-sm font-medium text-gray-700"
                        >
                          Target Re-Buy %
                        </label>
                      </Tooltip>

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

                  </div>
                  {newTradeBot.id <= 0 && (
                    <div className="relative flex mt-4 mb-4">
                       {/* <div className="flex items-center h-5">
                       <label
                          htmlFor="tradeBotTest"
                          className="font-medium text-gray-700"
                        >
                          <input
                            id="tradeBotTest"
                            aria-describedby="tradeBotTest-description"
                            name="tradeBotTest"
                            type="checkbox"
                            checked={newTradeBot.test}
                            onChange={(e) => {
                              setNewTradeBot({
                                ...newTradeBot,
                                test: e.target.value == "on",
                              });
                            }}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          Test Bot
                        </label> 
                      </div>*/}
                     
                      <div className="ml-3 text-sm">
                        <Toggle value={showAllCoins} setValue={showAllCoinsSet} label="All Coins"></Toggle>

                      </div>

                      <div className="ml-3 text-sm">
                        <Toggle value={showAdvanced} setValue={showAdvancedSet} label="Advanced Configuration"></Toggle>

                      </div>
                      <div className="ml-3 text-sm">
                      <Toggle value={test}   setValue={testSet} label="Test Bot"></Toggle>
              
                      </div>
                      <div>
                      </div>
                    </div>
                  )}
                  {newTradeBot.id <= 0 && (

                    <>
                      {!showAllCoins && (<>
                        <div className="mt-8 bg-gray-100 rounded-tl-3xl pl-8">
                          <ul
                            role="list"
                            className="-my-5 divide-y divide-gray-200 max-h-[200px] overflow-y-scroll"
                          >
                            {coins && coins.filter(i => i.suggested == 'true').map((coin) => (
                              <li key={coin.id} className="py-4 cursor-pointer hover:bg-blue-200"

                                onClick={(value: any) => {
                                  console.log(coin)
                                  setSelectedPair(coin);
                                  setNewTradeBot({
                                    ...newTradeBot,
                                    coin: coin.currency,
                                  });
                                }}
                              >
                                <div className="flex items-center space-x-4">

                                  <div className="flex-shrink-0">
                                    <Image
                                      src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${`${coin.currency}`.toLowerCase()}.svg`}

                                      width="32px" height="32px"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">

                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      <span className="flex">
                                        {coin.currency}
                                        {coin.id == selectedPair?.id ? (
                                          <span
                                            className={classNames(
                                              coin.currency == newTradeBot?.currency
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "inset-y-0 right-0 flex items-center"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </span>
                                    </span>


                                  </div>

                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>)}
                      {showAllCoins && (<>

                        <div className="form-group">
                          <Listbox
                            value={newTradeBot.coin}
                            onChange={(value: any) => {
                              setSelectedPair(value);
                              setNewTradeBot({
                                ...newTradeBot,
                                coin: value.currency,
                              });
                            }}
                          >
                            {({ open }) => (
                              <>
                                <Listbox.Label className="block text-sm font-medium text-gray-700">
                                  Choose Pair
                                </Listbox.Label>
                                <div className="mt-1 relative">
                                  <Listbox.Button
                                    style={{ minHeight: "46px" }}
                                    className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
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

                                                <Image
                                                  src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${`${coin.currency}`.toLowerCase()}.svg`}

                                                  width="32px" height="32px"
                                                />
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
                        </div></>)}
                    </>
                  )}
                </div>

              
              {showAdvanced && (<>
                 <div className="p-5">
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
                 </div>
                </>)}
              

                {newTradeBot.id > 0 && <div className="mt-20"></div>}

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {/* <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Deactivate</button>
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button> */}

                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm "
                    onClick={() =>
                      Confirm.show(
                        'Stop Bot',
                        'Do you want to start the bot?',
                        'Yes',
                        'No',
                        async () => {
                          try {
                            startNewTradeBot()
                          } catch (e) { }
                        }, () => { }, {})}>
                    {newTradeBot.id <= 0 ? "Start" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sms"
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
