import { useDispatch } from "react-redux";
import { logout } from "../store/slices/auth-slice";
import { AppDispatch } from "../store/store";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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
      router.push("/login");
    }
  };

  return handleLogout;
};
