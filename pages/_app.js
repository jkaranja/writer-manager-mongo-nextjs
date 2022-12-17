import Layout from "../components/layouts/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import { Provider } from "react-redux";
import store from "../redux/app/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SSRProvider } from "react-bootstrap";

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer theme="dark" />
      </Provider>
    </SSRProvider>
  );
}

export default MyApp;
