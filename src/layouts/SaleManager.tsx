import { Outlet } from "react-router-dom";

const SaleManager = () => {
  return (
    <div>
      <div></div>
      <div>
        <Outlet />
      </div>
      <div></div>
    </div>
  );
};

export default SaleManager;
