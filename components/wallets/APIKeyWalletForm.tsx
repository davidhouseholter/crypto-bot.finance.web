import React, { Component, useState } from 'react'
import { TradeWalletViewModel } from '../tradebots/add-trade-wallet';

export default function APIKeyWalletForm({onComplete}) {
    
    const [wallet, setWallet] = useState(new TradeWalletViewModel);
    const addTradeWallet = () => {
     onComplete(wallet)   
    }
    return (
        <div>
            <div className="form-group mt-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={wallet.name}
                    onChange={(e) => {
                        setWallet({ ...wallet, name: e.target.value });
                    }}
                    id="name"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Name"
                />
            </div>
            <div className="form-group mt-4">
                <label
                    htmlFor="apiKey"
                    className="block text-sm font-medium text-gray-700"
                >
                    API Key
                </label>
                <input
                    type="text"
                    name="apiKey"
                    value={wallet.config.apiKey}
                    onChange={(e) => {
                        setWallet({ ...wallet, config: {...wallet.config, apiKey: e.target.value} });
                    }}
                    id="apiKey"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="API Key"
                />
            </div>
            <div className="form-group mt-4">
                <label
                    htmlFor="secret"
                    className="block text-sm font-medium text-gray-700"
                >
                    Secret
                </label>
                <input
                    type="text"
                    name="secret"
                    value={wallet.config.secret}
                    onChange={(e) => {
                        setWallet({ ...wallet, config: {...wallet.config, secret: e.target.value} });
                    }}
                    id="secret"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Secret"
                />
            </div> <div className="form-group mt-4">
                <label
                    htmlFor="passphrase"
                    className="block text-sm font-medium text-gray-700"
                >
                    Passphrase
                </label>
                <input
                    type="text"
                    name="passphrase"
                    value={wallet.config.passphrase}
                    onChange={(e) => {
                        setWallet({ ...wallet, config: {...wallet.config, passphrase: e.target.value} });
                    }}
                    id="passphrase"
                    className="appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Passphrase"
                />
            </div>
            <div className="mt-5 sm:mt-6">
            <button
                      className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => addTradeWallet()}
                    >
                      Save Changes
                    </button>
                </div>
        </div>
    )
}

