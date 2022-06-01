import { createContext, useContext, useEffect, useState } from "react";
import getUserInformation from "../pkg/services";
import { useDispatch } from "react-redux";
import { getUseProfile } from "../pkg/services/userService";
import { changeUserIdentityState } from "../pkg/redux/reducers/userIdentityState";
import { changeUserProfileState } from "../pkg/redux/reducers/userProfileState";

const AppContext = createContext<any>({
  hasSession: false,
  currentUser: null,
  lastCheck: null,
});

type AppWrapperProps = React.PropsWithChildren<{}>;
let check: any = null;

export function AppWrapper({ children }: AppWrapperProps): JSX.Element {
  const dispatch = useDispatch();
 
  const [userIdentity, setUserIdentity] = useState({
    hasSession: false,
    currentUser: null,
    lastCheck: null,
    profileCheck: false
  });
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (check == null) {
      check = false;
      getUserInformation().then((user: any) => {
        let sharedState = {
          hasSession: user == null ? false : true,
          currentUser: user,
          lastCheck: true,
          profileCheck: false
        };
        setUserIdentity(sharedState as any);
        dispatch(changeUserIdentityState(sharedState));
      });

     
    }
    if(userIdentity?.hasSession && userProfile == null && !userIdentity.profileCheck) {
      setUserIdentity({...userIdentity, profileCheck:true});
      dispatch(changeUserIdentityState(userIdentity));
      getUseProfile().then((profile: any) => {
        setUserProfile(profile);
        dispatch(changeUserProfileState(profile));
      });
    }
  }, [dispatch, setUserIdentity, setUserProfile]);

  return (
    <AppContext.Provider value={userIdentity}>{children}</AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}
