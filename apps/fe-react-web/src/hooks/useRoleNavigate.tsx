import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { NavigateOptions, useNavigate } from "react-router-dom";

export const useRoleNavigate = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);

  const rolePrefix = role ? `/${role.toLowerCase()}` : "";

  const roleNavigate = (path: string, options?: NavigateOptions) => {
    if (rolePrefix && path.startsWith(rolePrefix)) {
      navigate(path, options);
    } else {
      navigate(`${rolePrefix}${path}`, options);
    }
  };

  return roleNavigate;
};
