import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SaleManager from "../layouts/SaleManager";
import Admin from "../layouts/Admin";
import ManagerUser from "../components/admin/ManagerUser/ManagerUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SaleManager />}></Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="/admin/managerUser" element={<ManagerUser />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
