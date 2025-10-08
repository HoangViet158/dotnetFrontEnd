import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SaleManager from "../layouts/SaleManager";
import Admin from "../layouts/Admin";
import ManagerUser from "../components/admin/ManagerUser/ManagerUser";
import ManagerPromotion from "../components/admin/ManagerPromotion/ManagerPromotion";
import ManagerReport from "../components/admin/ManagerReport/ManagerReport";
import ManagerSupplier from "../components/admin/ManagerSupplier/ManagerSupplier";
import ManagerRole from "../components/admin/ManagerRole/ManagerRole";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SaleManager />}></Route>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
