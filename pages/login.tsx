import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
  UiNode,
} from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { createLogoutHandler } from "../pkg";

import { handleGetFlowError, handleFlowError } from "../pkg/errors";

import ory from "../pkg/sdk";
import { useAppContext } from "../components/AppWrapper";
import getUserInformation from "../pkg/services";
import Header from "../components/layouts/header/header";
import { useSelector, useDispatch } from "react-redux";
import { LockClosedIcon } from "@heroicons/react/outline";
import { isUiNodeInputAttributes } from "@ory/integrations/ui";
import { changeUserIdentityState } from "../pkg/redux/reducers/userIdentityState";

export type Values = Partial<
  | SubmitSelfServiceLoginFlowBody
  | SubmitSelfServiceRegistrationFlowBody
  | SubmitSelfServiceRecoveryFlowBody
  | SubmitSelfServiceSettingsFlowBody
  | SubmitSelfServiceVerificationFlowBody
>

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>();

  const [password, setPassword] = useState<string>();

  const [flow, setFlow] = useState<SelfServiceLoginFlow>();
  const dispatch = useDispatch();

  
  const filterNodes = (): Array<UiNode> => {
    
    if (!flow) {
      return []
    }
    return flow.ui.nodes.filter(({ group }) => {
      return group === 'default'
    })
  }

  // Get ?flow=... from the URL
  const router = useRouter();
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
  } = router.query;

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  // const onLogout = createLogoutHandler([aal, refresh]);

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data);
          console.log(flow);
        })
        .catch(handleGetFlowError(router, "login", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "login", setFlow));
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, dispatch]);
  const onSubmit = async (values: any) => {

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
        bodyValue[node.attributes.name as keyof Values] = node.attributes.value
      }
    })
    bodyValue["password"] = password
    bodyValue["password_identifier"] = email
    bodyValue["method"] = "password"


    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceLoginFlow(String(flow?.id), undefined, bodyValue)
          // We logged in successfully! Let's bring the user home.
          .then((res) => {
            getUserInformation().then((user: any) => {
              console.log("data", user);
              let sharedState = {
                hasSession: user == null ? false : true,
                currentUser: user,
                lastCheck: true,
              };
              // console.log("sharedState", sharedState)
              dispatch(changeUserIdentityState(sharedState));
              if (flow?.return_to) {
                window.location.href = flow?.return_to;

                return;
              }
              router.push("/");
            });
          })
          .then(() => {})
          .catch(handleFlowError(router, "login", setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data as any);
              return;
            }

            return Promise.reject(err);
          })
      );
  };

  return (
    <>
      <Head>
        <title>Sign in - David Householter Earth</title>
        <meta name="description" content="" />
      </Head>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {(() => {
                if (flow?.refresh) {
                  return "Confirm Action";
                } else if (flow?.requested_aal === "aal2") {
                  return "Two-Factor Authentication";
                }
                return "Sign In";
              })()}
            </h2>
          </div>
          <form className="mt-8 space-y-6" >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div> */}
            </div>

            <div>
              <button
                type="button"
                onClick={onSubmit}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-2 text-sm text-gray-600">
                Or{' '}
               <Link href={'sign-up'}>
               <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  sign up
                </a></Link>
              </p>
        </div>
      </div>
    </>
  );
};

export default Login;
