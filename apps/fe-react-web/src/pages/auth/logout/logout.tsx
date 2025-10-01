import { ROUTES } from "@/constants/route.constant";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/User/user-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout());
    }
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  }, [dispatch, isAuthenticated, navigate]);

  return null;
};

export default Logout;
