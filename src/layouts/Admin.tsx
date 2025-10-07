import { Outlet } from "react-router-dom";

const Admin = () => {
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

export default Admin;
