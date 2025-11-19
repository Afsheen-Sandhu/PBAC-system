import { useDispatch } from "react-redux";
import { logout } from "../store/slices/counter/auth-slice";
import { AppDispatch } from "../store/store";

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    dispatch(logout());
  };

  return handleLogout;
};


