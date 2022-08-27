import { createContext, useContext, useEffect, useState } from "react";
import getUserInformation from "../pkg/services";
import { useDispatch, useSelector } from "react-redux";
import { getUseProfile } from "../pkg/services/userService";
import { changeUserIdentityState } from "../pkg/redux/reducers/userIdentityState";
import { changeUserProfileState } from "../pkg/redux/reducers/userProfileState";
import { useAuth } from "../pkg/providers/Auth";

const AppContext = createContext<any>({
  hasSession: false,
  currentUser: null,
  lastCheck: null,
});

type AppWrapperProps = React.PropsWithChildren<{}>;
let check: any = null;

export function AppWrapper({ children }: AppWrapperProps): JSX.Element {
  const dispatch = useDispatch();
  const userStoreIdentity = useSelector(
    (state: any) => state.userIdentityMode.value
  );
  const [userIdentity, setUserIdentity] = useState({
    hasSession: false,
    currentUser: null,
    lastCheck: null,
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const {user, setUser} = useAuth();
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
  // const connected = connection.state;
  // useEffect(() => {
  //   // console.log(connected)
  //   if (canUseDOM && userIdentity.hasSession) {
  //     if (
  //       connected !== HubConnectionState.Connected &&
  //       connected !== HubConnectionState.Reconnecting &&
  //       connected !== HubConnectionState.Connecting
  //     ) {
  //       connection
  //         .start()
  //         .then(() => console.log("Connection started"))
  //         .catch((err) => console.error(err.toString()));
  //     }
  //   }
  // }, [canUseDOM, connected, userIdentity]);
  useEffect(() => {
    if (check == null) {
      check = false;
      getUserInformation().then((user: any) => {
        let sharedState = {
          hasSession: user == null ? false : true,
          currentUser: user,
          lastCheck: true,
        };
        setUserIdentity(sharedState as any);
        dispatch(changeUserIdentityState(sharedState));
      });

      getUseProfile().then((profile: any) => {
        setUserProfile(profile);
        setUser(profile);
        dispatch(changeUserProfileState(profile));
      });
    }
    if (userStoreIdentity?.hasSession && !userProfile) {
      getUseProfile().then((profile: any) => {
        setUserProfile(profile);
        setUser(profile);
        dispatch(changeUserProfileState(profile));
      });
    }
  }, [dispatch, setUserIdentity, setUserProfile, userProfile, userIdentity, userStoreIdentity]);

  return (
    <AppContext.Provider value={userIdentity}>{children}</AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}
