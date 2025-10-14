import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PosLayout from "./PostLayout";

const SaleManager = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <PosLayout />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SaleManager;
