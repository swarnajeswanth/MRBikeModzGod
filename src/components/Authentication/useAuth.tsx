import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "@/components/store/UserSlice";
import { apiRequest } from "@/components/lib/apiUtils";
import { RootState } from "@/components/store";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

type UserRole = "customer" | "retailer";

interface LoginResponse {
  user: {
    id: string;
    username: string;
    image: string;
    role: UserRole;
    dateOfBirth: string;
    phoneNumber: string;
  };
  token: string;
}

export function useAuth() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const allowGuestBrowsing = useSelector(
    selectIsCustomerExperienceEnabled("allowGuestBrowsing")
  );
  const requireLoginForPurchase = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForPurchase")
  );

  const login = async (username: string, password: string, role?: UserRole) => {
    try {
      const response = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password, role }),
      });

      if (response.success && response.data) {
        // Update Redux state with user data
        dispatch(
          loginAction({
            id: response.data.user.id,
            username: response.data.user.username,
            image: response.data.user.image,
            role: response.data.user.role,
            dateOfBirth: response.data.user.dateOfBirth,
            phoneNumber: response.data.user.phoneNumber,
          })
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const signup = async (userData: {
    username: string;
    password: string;
    role: UserRole;
  }) => {
    try {
      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      return response.success;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    }
  };

  return {
    login,
    signup,
    isAuthenticated: isLoggedIn,
    allowGuestBrowsing,
    requireLoginForPurchase,
  };
}
