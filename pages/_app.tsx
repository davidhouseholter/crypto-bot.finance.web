import { useState, useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/Footer/footer";
import { Provider } from "react-redux";
import { AppWrapper } from "../components/AppWrapper";
import { store } from "../pkg/redux/store";
import { connection } from "../pkg/redux/store";
import { HubConnectionState } from "@microsoft/signalr";


function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(function () {
      setLoading(false);
    }, 250);

    return () => {
      setLoading(true);
    };
  }, [pageProps]);
  const canUseDOM = !!(
    (typeof window !== 'undefined' &&
    window.document && window.document.createElement)
  );
  const connected = connection.state;
  useEffect(() => {
    // console.log(connected)
    if (canUseDOM) {
      if (connected !== HubConnectionState.Connected && connected !== HubConnectionState.Reconnecting  && connected !== HubConnectionState.Connecting) {
        connection
          .start()
          .then(() => console.log("Connection started"))
          .catch((err) => console.error(err.toString()));
      }
    }
  }, [canUseDOM, connected]);
  return (
    <>
      <div className="h-full bg-gray-50">
        <Provider store={store}>
          <AppWrapper>
            <Header />

            <section
              className={
                loading === true ? "dark:animate-none animate-Loading " : ""
              }
            >
              <Component {...pageProps} />
            </section>

            <Footer />
          </AppWrapper>
        </Provider>
      </div>
    </>
  );
}
export default MyApp;
