import { useState, useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/layouts/header/header";
import Footer from "../components/layouts/Footer/footer";
import { Provider, useSelector } from "react-redux";
import { AppWrapper } from "../components/AppWrapper";
import { store } from "../pkg/redux/store";
import { ToastContainer } from "react-toastify";
import { ProvideAuth } from "../pkg/providers/Auth";


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


  return (
    <>
      <div className="h-full bg-gray-50">
        <Provider store={store}>
          <ProvideAuth>
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
          </ProvideAuth>
        </Provider>
      </div>
      <ToastContainer />

    </>
  );
}
export default MyApp;
