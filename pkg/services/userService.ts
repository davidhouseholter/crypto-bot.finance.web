import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import ory from '../sdk'

// export default  class UserService {
//     static currentSession: any = null;
//     constructor() {
//     }
//     static getUser(): Promise<any> {
//         if (this.currentSession != null) {
//             return this.currentSession;
//         }
       
//     }
// }
const api = process.env.NEXT_PUBLIC_API_ENDPOINT;
export function getUseProfile() {
    return axios.get(`${api}/user`,{withCredentials: true})
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error.data;
      });
}

export function getUserInformation() {
    return new Promise((resolve) => {
        return ory
        .toSession()
        .then(({ data }) => {
            resolve(data)
        })
        .catch((err: AxiosError) => {
            console.log(err)

            switch (err.response?.status) {
                case 403:
                // This is a legacy error code thrown. See code 422 for
                // more details.
                case 422:
                // This status code is returned when we are trying to
                // validate a session which has not yet completed
                // it's second factor
                // return router.push('/login?aal=aal2')
                case 401:
                    // do nothing, the user is not logged in
                    return
            }
    
            // Something else happened!
            return Promise.reject(err)
        })
    })
  }