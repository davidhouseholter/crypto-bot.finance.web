import { Transition, Dialog } from "@headlessui/react";
import { CheckCircleIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import { saveTradeWallet } from "../../pkg/services/tradeBotServices";
import APIKeyWalletForm from "../wallets/APIKeyWalletForm";

export class TradeWalletConfigViewModel {
  apiKey!: string;
  secret!: string;
  passphrase!: string;
  constructor() {
    this.apiKey = "";
    this.secret = "";
    this.passphrase = "";
  }
}

export class TradeWalletViewModel {
  constructor() {
    this.name = "";
    this.exchangeType = -1;
    this.externalId = "";
    this.config = new TradeWalletConfigViewModel();
  }
  name!: string;
  exchangeType!: WalletConfigExchangeType;
  externalId?: string;
  config!: TradeWalletConfigViewModel;
}
export enum WalletConfigExchangeType {
  None = -1,
  ApiKey,
  TestBot,
}
export default function AddTradeWalletModal({ setShowModal, wallets }) {
  const open = true;

  const [currentExchange, setCurrentExchange] = useState<any>(null);
  const [currentExchanges, setCurrentExchanges] = useState<any[]>();

  const [tradeWalletData, setTradeWalletData] = useState<TradeWalletViewModel>(
    new TradeWalletViewModel()
  );

  const addWalletType = (exchange) => {
    setCurrentExchange(exchange);
    console.log(exchange)
    setTradeWalletData({...tradeWalletData, exchangeType:exchange.exchangeType})
  };

  const addTradeWallet = async () => {
    const result = await saveTradeWallet(tradeWalletData!);

    setShowModal(false, result.data);
  };

  useEffect(() => {
   setCurrentExchanges( [
    {
      id: 1,
      name: "Coinbase Pro",
      imageUrl: "",
      exchangeType: WalletConfigExchangeType.ApiKey,
      disabled: false
    },
    {
      id: 2,
      name: "Test Wallet",
      imageUrl: "",
      exchangeType: WalletConfigExchangeType.TestBot,
      disabled: wallets.findIndex(i => i.exchangeType == WalletConfigExchangeType.TestBot) > -1
    },
  ]);

  }, [wallets])
  
  const onComplete = (newWallet) => {
    console.log(newWallet)
    setTradeWalletData({...tradeWalletData, 
      name: newWallet.name,
      config: newWallet.config
    });

    setTimeout(() => {
      addTradeWallet();
    }, 100);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShowModal}>
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
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 md:max-w-xl sm:max-w-sm sm:w-full sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Add Pool
                    </Dialog.Title>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      {currentExchange == null && (
                        <div>
                          <div className="flow-root mt-6">
                            <ul
                              role="list"
                              className="-my-5 divide-y divide-gray-200"
                            >
                              {currentExchanges && currentExchanges.filter(i => !i.disabled).map((exchange) => (
                                <li key={exchange.id} className="py-4 cursor-pointer hover:bg-blue-200"   onClick={() => {
                                  addWalletType(exchange);
                                }}>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-8 w-8 rounded-full"
                                        src={exchange.imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {exchange.name}
                                      </p>
                                    </div>
                                    <div>
                                      <a
                                      
                                        className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                      >
                                        Add
                                      </a>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* <div className="mt-6">
     <a
       href="#"
       className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
     >
       View all
     </a>
   </div> */}
                        </div>
                      )}
                      {currentExchange != null && (
                        <>
                          <div className="mt-2">
                            <div className=" w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                              <div className="p-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <CheckCircleIcon
                                      className="h-6 w-6 text-green-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">
                                      {currentExchange.name}
                                    </p>
                                    {/* <p className="mt-1 text-sm text-gray-500">
                            Anyone with a link can now view this file.
                          </p> */}
                                  </div>
                                  <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                      type="button"
                                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      onClick={() => {
                                        setCurrentExchange(null);
                                      }}
                                    >
                                      <span className="sr-only">Close</span>
                                      <XIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {currentExchange.exchangeType ==
                              WalletConfigExchangeType.ApiKey && (<APIKeyWalletForm onComplete={onComplete} />)}
                            {currentExchange.exchangeType ==
                              WalletConfigExchangeType.TestBot && (
                              <>
                                <label htmlFor="name" className="sr-only">
                                  Name
                                </label>
                                <input
                                  id="name"
                                  name="name"
                                  type="text"
                                  value={tradeWalletData.name}
                                  onChange={(e) => {
                                    setTradeWalletData({
                                      ...tradeWalletData,
                                      name: e.target.value,
                                    });
                                  }}
                                  required
                                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                  placeholder="Name"
                                />
                              </>
                            )}
                          </div>
                          {/* <pre>{JSON.stringify(currentExchange, null, 0)}</pre>

                  <pre>{JSON.stringify(tradeWalletData, null, 0)}</pre> */}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  {tradeWalletData.exchangeType == WalletConfigExchangeType.TestBot && (
                    <button
                      className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => addTradeWallet()}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
