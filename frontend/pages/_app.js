import "../index.css";
import { AuthProvider } from "../context/AuthContext";
import { store, persistor } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import queryClient from "./../lib/clientProvider/clientProvider";
import { QueryClientProvider, Hydrate } from "react-query";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Hydrate state={pageProps.dehydratedState}>
              {getLayout(<Component {...pageProps} />)}
            </Hydrate>
          </PersistGate>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
