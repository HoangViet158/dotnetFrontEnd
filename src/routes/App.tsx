import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SaleManager from "../layouts/SaleManager";
import Admin from "../layouts/Admin";
import ManagerUser from "../components/admin/ManagerUser/ManagerUser";
import ManagerCustomer from "../components/admin/ManagerCustomer/ManagerCustomer";
import ManagerProduct from "../components/admin/ManageProduct/ManageProduct";
import ManagerInventory from "../components/admin/ManagerInventory/ManagerInventory";
import ManagerPromotion from "../components/admin/ManagerPromotion/ManagerPromotion";
import ManagerReport from "../components/admin/ManagerReport/ManagerReport";
import ManagerSupplier from "../components/admin/ManagerSupplier/ManagerSupplier";
import ManagerRole from "../components/admin/ManagerRole/ManagerRole";
import Login from "../components/Auth/Login";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SaleManager />}></Route>
        <Route path="/login" element={<Login />}></Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="/admin/managerUser" element={<ManagerUser />}></Route>
          <Route
            path="/admin/managerPromotion"
            element={<ManagerPromotion />}
          ></Route>
          <Route
            path="/admin/managerReport"
            element={<ManagerReport />}
          ></Route>
          <Route
            path="/admin/managerSupplier"
            element={<ManagerSupplier />}
          ></Route>
          <Route path="/admin/managerRole" element={<ManagerRole />}></Route>
          <Route
            path="/admin/managerCustomer"
            element={<ManagerCustomer />}
          ></Route>
          <Route
            path="/admin/managerProduct"
            element={<ManagerProduct />}
          ></Route>
          <Route
            path="/admin/managerInventory"
            element={<ManagerInventory />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
