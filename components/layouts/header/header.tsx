/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  MenuIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import { createLogoutHandler } from "../../../pkg";
import { useSelector } from "react-redux";
import Image from 'next/image';
import logoImage from '../../../public/logo-header.png';

let navigation = [
  { name: "Home", href: "/", slug: "", current: false },

  { name: "Contact", href: "/contact", slug: "", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const router = useRouter();
  const userIdentity = useSelector(
    (state: any) => state.userIdentityMode.value
  );
  useEffect(() => {
    if (userIdentity) {
      navigation = [
        { name: "Home", href: "/", slug: "", current: false },
        {
          name: "Trade Bots",
          href: "/trade-bots",
          slug: "trade-bots",
          current: false,
        },
        { name: "Contact", href: "/contact", slug: "", current: false },
        { name: "About", href: "/about", slug: "", current: false },
      ];
    }

  }, [userIdentity])
  let onLogout = createLogoutHandler();

  let nav = navigation
    .map((i) => {
      i.current = false;
      return i;
    })
    .find((f) => f.href == router.pathname || f.slug == router.pathname);

  if (nav != null) {
    nav.current = true;
  }
  return (
    <Disclosure as="nav" className="bg-slate-100" id="nav">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 ">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
               <Link href="/" >
               <Image style={{width: '200px'}} height="64px" className="w-200 cursor-pointer	" src={logoImage} alt="" priority />

               </Link>
            
                  {/* 
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  /> */}
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <a
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-900 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              {userIdentity?.hasSession ? (
                <div className="flex items-center">
                  {/* <div className="flex-shrink-0">
                  <button
                   onClick={onLogout}
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  >
                    <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    <span>Log Out</span>
                  </button>
                </div> */}
                  <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    {/* <button
                    type="button"
                    className="bg-gray-800 p-1 rounded-full<BellIcon className="h-6 w-6" aria-hidden="true" /> hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                    {/* Profile dropdown */}
                    {userIdentity?.hasSession ? (
                      // <>Account</>
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className=" flex text-sm rounded-full focus:outline-none ">
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {/*
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item> */}
                            <Menu.Item>
                              {({ active }) => (
                                <Link href="/profile">
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your Profile
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  onClick={onLogout}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Sign out
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/login">
                      <button
                        type="button"
                        className="flex text-sm rounded-full"
                      >
                        <UserCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-p00 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

// import React, {useEffect, useState} from "react";
// import NavIcon from "../../icons/navicon";
// import Logo from "./logo";
// import Navigation from "./navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { useAppContext } from "../../AppWrapper";

// const Header = () => {

//     // let clicked = "clicked";
//     // const [classes, setClasses] = useState<string>("clicked")
//     const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState<boolean>(false);
//     const appContext = useAppContext()
//     console.log(appContext);
//     const dispatch = useDispatch();

//   return (
//     <>
//       <section className="header bg-gray-10 border-b dark:bg-gray-900 dark:border-opacity-10">
//         <div className="container mx-auto ">
//         <div className="flex flex-wrap items-center justify-between py-4 mx-auto gap-4">

//           <div className="flex-none z-10	">
//             <Logo />
//           </div>

//           <div className="flex-none  gap-4 lg:hidden" onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}>
//             <NavIcon />
//           </div>

//           <div className={`lg:flex flex-col lg:flex-row lg:items-center lg:justify-center text-sm w-full lg:w-auto z-0	${mobileMenuIsOpen ? `block animate-slideIn` : `hidden`}`}>
//               <div className={`${mobileMenuIsOpen ? `p-2 	` : ` float-right`}`}>
//               <Navigation  />
//               </div>

//           </div>
//         </div>
//         </div>

//       </section>
//     </>
//   );
// };

// export default Header;
