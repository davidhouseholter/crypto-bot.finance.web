import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
  UiNode,
} from "@ory/client";
import { isUiNodeInputAttributes } from "@ory/integrations/ui";
//   import { CardTitle } from '@ory/themes'
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// Import render helpers
//   import { Flow, ActionCard, CenterLink, MarginCard } from '../pkg'
import { handleFlowError } from "../pkg/errors";
import { changeUserIdentityState } from "../pkg/redux/reducers/userIdentityState";
// Import the SDK
import ory from "../pkg/sdk";
import { getUseProfile } from "../pkg/services/userService";
import { Values } from "./login";
import artImage from "../public/og_logo.png";
import Image from "next/image";
// Renders the registration page
export function Registration() {
  const dispatch = useDispatch();
      
  const filterNodes = (): Array<UiNode> => {
    
    if (!flow) {
      return []
    }
    return flow.ui.nodes.filter(({ group }) => {
      return true //group === 'default'
    })
  }
  const router = useRouter();

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>();

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query;

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data);
        })
        .catch(handleFlowError(router, "registration", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "registration", setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = () => {
    const bodyValue: any = {};
    filterNodes().forEach((node: UiNode) => {
      // This only makes sense for text nodes
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === 'button' ||
          node.attributes.type === 'submit'
        ) {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return
        }
        const parts = node.attributes.name.split('.');
        if (parts.length > 1) {
            if(parts[0] == 'traits') {
                if(!bodyValue['traits']) {
                    bodyValue['traits'] ={};
                }
                if(parts.length > 2) {
                    if(!bodyValue['traits'][parts[1]]) {
                        bodyValue['traits'][parts[1]]  ={};
                    }
                    bodyValue['traits'][parts[1]][parts[2]] = node.attributes.value;
                } else {
                    if(!bodyValue['traits'][parts[1]]) {
                        bodyValue['traits'][parts[1]]  ={};
                    }
                    bodyValue['traits'][parts[1]] = node.attributes.value;
                }
            }
            return;
        }

        bodyValue[node.attributes.name as keyof Values] = node.attributes.value
      }
    })

    bodyValue.method = "password"
    router
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    .push(`/sign-up?flow=${flow?.id}`, undefined, { shallow: true })
    .then(() =>
      ory
        .submitSelfServiceRegistrationFlow(String(flow?.id), bodyValue)
        .then(({ data }) => {
          // If we ended up here, it means we are successfully signed up!
          //
          // You can do cool stuff here, like having access to the identity which just signed up:
          let sharedState = {
            hasSession: true,
            currentUser: data.identity,
            lastCheck: true,
          };
          dispatch(changeUserIdentityState(sharedState));
          // For now however we just want to redirect home!
          return router.push(flow?.return_to || "/").then(() => {});
        })
        .catch(handleFlowError(router, "registration", setFlow))
        .catch((err: AxiosError<any>) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            setFlow(err.response?.data);
            return;
          }

          return Promise.reject(err);
        })
    );

  }

  
   
  return (
    flow && (
      <>
        <Head>
          <title>Create Account - Crypto Trade Bot</title>
          <meta
            name="description"
            content="Sign Up for a Crypto Trade Bot account"
          />
        </Head>
        <>
          {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
          <div className="min-h-full flex">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div>
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    Sign Up Today
                  </h2>
                  {flow.ui.messages?.map((msg, id) => (

                      <p key={id}>{msg.text}</p>
                  ))}
                </div>

                <div className="mt-8">
                  {/* <div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Sign in with
                    </p>

                    <div className="mt-1 grid grid-cols-3 gap-3">
                      <div>
                        <a
                          href="#"
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Sign in with Facebook</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>

                      <div>
                        <a
                          href="#"
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Sign in with Twitter</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      </div>

                      <div>
                        <a
                          href="#"
                          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Sign in with GitHub</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div> */}

                  <div className="mt-6">
                    <form className="space-y-6">
                      {flow.ui.nodes.filter(node => (node.attributes as any).type != 'hidden'  && (node.attributes as any).type != 'submit').map((node, id) => (
                        <div key={id}>
                          <div>
                            <label
                              htmlFor={(node.attributes as any).name}
                              className="block text-sm font-medium text-gray-700"
                            >
                             {node.meta.label?.text}
                            </label>
                            <div className="mt-1">
                              <input
                                 id={(node.type as any).name}
                                name={(node.attributes as any).name}
                                type={(node.attributes as any).type}
                                value={(node.attributes as any).value}
                                onChange={(e) => {
                                    (node.attributes as any).value = e.target.value
                                  }}
                                // autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                               {node.messages?.map((msg, id) => (

                                <p key={id}>{msg.text}</p>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div>
                        <button
                          type="button"
                          onClick={onSubmit}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative w-0 flex-1">
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={artImage}
                alt=""
              />
            </div>
          </div>
        </>
        {/* <pre>{JSON.stringify(flow, null, 2)}</pre> */}
      </>
    )
  );
};

export default Registration;
