import { useDispatch } from "react-redux";
import { logout } from "../store/slices/counter/auth-slice";
import { AppDispatch } from "../store/store";

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      dispatch(logout());
    }
  };

  return handleLogout;
};
