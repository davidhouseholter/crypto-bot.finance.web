import { CheckIcon, ChevronRightIcon, MailIcon, QuestionMarkCircleIcon, UserCircleIcon, ViewGridAddIcon } from "@heroicons/react/outline";
import { BeakerIcon, FolderIcon } from "@heroicons/react/solid";
import { IncomingMessage } from "http";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  BellIcon,
  CashIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { saveTradeWallet } from "../pkg/services/tradeBotServices";
import { TradeWalletViewModel, WalletConfigExchangeType } from "../components/tradebots/add-trade-wallet";
import { useRouter } from "next/router";
import { changeUserProfileState } from "../pkg/redux/reducers/userProfileState";
import Image from "next/image";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.userProfileMode.value);
  const router = useRouter();
  const stats = [
    { label: `Pool${user?.wallets.length > 1 ? 's' : ''}`, value: user?.wallets.length ?? 0 },
    { label: `Bot${user?.bots?.length > 1 ? 's' : ''}`, value: user?.bots?.length ?? 0 },
    { label: 'Sells', value: 0 },
  ]
  const actions: { icon: any, name: string, description: string, href: string, iconForeground: string, iconBackground: string, click: any }[] = [

  ]

  if (user?.wallets.length == 0) {
    actions.push({
      icon: BadgeCheckIcon,
      name: 'First Trade Bot',
      href: '#',
      iconForeground: 'text-rose-700',
      iconBackground: 'bg-rose-50',
      description: `Create you first trade bot.`,
      click: async () => {
      }
    })
    actions.push({
      icon: AcademicCapIcon,
      name: 'Test Bot',
      href: '#',
      iconForeground: 'ttext-indigo-700',
      iconBackground: 'bg-indigo-50',
      description: `Create you first trade bot.`,
      click: async () => {
        let tradeWalletData = new TradeWalletViewModel;
        tradeWalletData.exchangeType = WalletConfigExchangeType.TestBot;
        tradeWalletData.name = "Test Bot Pool"
        const result = await saveTradeWallet(tradeWalletData!);
        let wallets = [...user.wallets];
        wallets.push(result.data)
        dispatch(changeUserProfileState({ ...user, wallets: wallets }));

        setTimeout(() => {
          router.push('/trade-bots?addtest=true')
        }, 100);

      }
    })
  }

  const announcements = [
    {
      id: 1,
      title: 'View Crypto Trade Bots Best Recommned Coins',
      href: '#',
      preview:
        'We have done the hard work, curnched all the numbers and completed all the testing. View the coins we suggest are best for you to trade',
    },
    {
      id: 2,
      title: 'How to Create a Test Bot',
      href: '#',
      preview:
        'Walk throught a step by step tutorial on how to create a test bot.',
    }
  ]

  // const recentHires = [
  //   {
  //     name: 'Leonard Krasner',
  //     handle: 'leonardkrasner',
  //     imageUrl:
  //       'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //     href: '#',
  //   },
  //   {
  //     name: 'Floyd Miles',
  //     handle: 'floydmiles',
  //     imageUrl:
  //       'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //     href: '#',
  //   },
  //   {
  //     name: 'Emily Selman',
  //     handle: 'emilyselman',
  //     imageUrl:
  //       'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //     href: '#',
  //   },
  //   {
  //     name: 'Kristin Watson',
  //     handle: 'kristinwatson',
  //     imageUrl:
  //       'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //     href: '#',
  //   },
  // ]



  return (
    user && (
      <>
        <main className="mt-12 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Profile</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="rounded-lg bg-white overflow-hidden shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      Profile Overview
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="flex-shrink-0">

                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">
                              Welcome back,
                            </p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                              {user.firstName}   {user.lastName}
                            </p>

                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <Link href={'profile'}>
                            <a

                              className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View profile
                            </a></Link>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                      {stats.map((stat) => (
                        <div

                          key={stat.label}
                          className="px-6 py-5 text-sm font-medium text-center"
                        >
                          <span className="text-gray-900">{stat.value}</span>{" "}
                          <span className="text-gray-600">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section aria-labelledby="quick-links-title">
                  <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                    <h2 className="sr-only" id="quick-links-title">
                      Quick links
                    </h2>
                    {actions.map((action, actionIdx) => (
                      <div
                        onClick={action.click}
                        key={action.name}
                        className={classNames(
                          actionIdx === 0
                            ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                            : "",
                          actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                          actionIdx === actions.length - 2
                            ? "sm:rounded-bl-lg"
                            : "",
                          actionIdx === actions.length - 1
                            ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                            : "",
                          "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500"
                        )}
                      >
                        <div>
                          <span
                            className={classNames(
                              action.iconBackground,
                              action.iconForeground,
                              "rounded-lg inline-flex p-3 ring-4 ring-white"
                            )}
                          >
                            <action.icon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <div className="mt-8">
                          <h3 className="text-lg font-medium">
                            <a
                              href={action.href}
                              className="focus:outline-none"
                            >
                              {/* Extend touch target to entire panel */}
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              {action.name}
                            </a>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <span
                          className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <section aria-labelledby="notes-title">
                  <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-5 sm:px-6">
                        <div className="sm:flex sm:items-center sm:justify-between ">
                          <div className="sm:flex sm:space-x-5">
                            <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                              Active Bots
                            </h2>

                          </div>
                          <div className="mt-5 flex justify-center sm:mt-0">
                            <Link href={'trade-bots'}>
                              <a className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                View All ({user?.bots?.length})
                              </a></Link>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-6 sm:px-6">
                        <ul role="list" className="space-y-8">
                          {user.bots?.map((bot) => (
                            <Link href={`/trade-bots/${bot.id}`} key={bot.id} >
                              <li className="p-4 cursor-pointer hover:bg-blue-100 hover:shadow-lg items-center  hover:text-gray-700 hover:border-gray-200">
                                <div className="flex space-x-3 justify-between ">
                                  <div className="flex-shrink-0">
                                    <Image
                                      src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${`${bot.coin}`.toLowerCase()}.svg`}

                                      width="32px" height="32px"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm">
                                      <h3 className="text-medium font-medium text-gray-900"> {bot.name}</h3>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                      <p>{bot.body}</p>
                                    </div>
                                    <div className="mt-2 text-sm space-x-2">
                                      {/* <pre>{JSON.stringify(bot, null, 2)}</pre> */}
                                    </div>
                                  </div>
                                  <div>
                                    <ChevronRightIcon
                                      className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <ViewGridAddIcon />
                        </div>
                        <div className="min-w-0 flex-1">

                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section aria-labelledby="notes-title">
                  <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-5 sm:px-6">
                        <div className="sm:flex sm:items-center sm:justify-between ">
                          <div className="sm:flex sm:space-x-5">
                            <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                              Pools
                            </h2>

                          </div>
                          <div className="mt-5 flex justify-center sm:mt-0">

                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-6 sm:px-6">
                        <ul role="list" className="space-y-8">
                          {user.wallets?.map((wallet) => (
                            <li className="p-4" key={wallet.id}>
                              <div className="flex space-x-3 justify-between ">
                                <div>
                                  <div className="text-sm">
                                    <h3 className="text-medium font-medium text-gray-900"> {wallet.name}</h3>
                                  </div>

                                </div>
                                <div>
                                  {/* <ChevronRightIcon
                                    className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                                    aria-hidden="true"
                                  /> */}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <ViewGridAddIcon />
                        </div>
                        <div className="min-w-0 flex-1">

                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Announcements */}
                <section aria-labelledby="announcements-title">
                  <div className="rounded-lg bg-white overflow-hidden shadow">
                    <div className="p-6">
                      <h2
                        className="text-base font-medium text-gray-900"
                        id="announcements-title"
                      >
                        Announcements
                      </h2>
                      <div className="flow-root mt-6">
                        <ul
                          role="list"
                          className="-my-5 divide-y divide-gray-200"
                        >
                          {announcements.map((announcement) => (
                            <li key={announcement.id} className="py-5">
                              <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                <h3 className="text-sm font-semibold text-gray-800">
                                  <a
                                    href={announcement.href}
                                    className="hover:underline focus:outline-none"
                                  >
                                    {/* Extend touch target to entire panel */}
                                    <span
                                      className="absolute inset-0"
                                      aria-hidden="true"
                                    />
                                    {announcement.title}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {announcement.preview}
                                </p>
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
                  </div>
                </section>

                {/* Recent Hires */}
                {/* <section aria-labelledby="recent-hires-title">
                  <div className="rounded-lg bg-white overflow-hidden shadow">
                    <div className="p-6">
                      <h2
                        className="text-base font-medium text-gray-900"
                        id="recent-hires-title"
                      >
                        Recent Hires
                      </h2>
                      <div className="flow-root mt-6">
                        <ul
                          role="list"
                          className="-my-5 divide-y divide-gray-200"
                        >
                          {recentHires.map((person) => (
                            <li key={person.handle} className="py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={person.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {person.name}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {"@" + person.handle}
                                  </p>
                                </div>
                                <div>
                                  <a
                                    href={person.href}
                                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                  >
                                    View
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View all
                        </a>
                      </div>
                    </div>
                  </div>
                </section> */}
              </div>
            </div>
          </div>
        </main>
        <footer>

        </footer>
      </>
    )
  );
}

export async function getStaticProps() {
  return { props: {} };
}
