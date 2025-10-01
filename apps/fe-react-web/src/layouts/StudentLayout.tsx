import HeaderMain from "@/components/header-main";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMain />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
