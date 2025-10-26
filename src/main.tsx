import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./routes/App.tsx";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { Bounce, ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={viVN}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </ConfigProvider>
  </StrictMode>
);
