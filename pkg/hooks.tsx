/* eslint-disable react-hooks/rules-of-hooks */
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect, DependencyList } from 'react'
import { useAppContext } from '../components/AppWrapper'
import { useSelector } from "react-redux";

import ory from './sdk'
// Returns a function which will log the user out
export function createLogoutHandler(deps?: DependencyList) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()
  const userState = useSelector((state: any): any => state.userIdentityMode.value)

  useEffect(() => {
    if(userState == null || !userState.hasSession) return;
    if(logoutToken.length > 0) return;
    setLogoutToken('a')
    ory
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, deps)

  return () => {
    if (logoutToken) {
      ory
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => router.push('/login'))
        .then(() => router.reload())
    }
  }
}
