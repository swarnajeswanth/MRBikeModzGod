import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  logout,
  setLoginLoading,
  setSignupLoading,
} from "../store/UserSlice";
import { toast } from "react-hot-toast";

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
  requireOTP?: boolean;
  userId?: string;
}

interface SignupData {
  username: string;
  password: string;
  role: UserRole;
  otp?: string;
  requireOTP?: boolean;
}

export function useAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string, role?: UserRole) => {
    dispatch(setLoginLoading(true));
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        dispatch(
          setUser({
            id: userData.id,
            username: userData.username,
            image: userData.image,
            role: userData.role,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.phoneNumber,
          })
        );

        // Store token in localStorage
        localStorage.setItem("token", data.data.token);
        toast.success("Login successful!");
        return {
          success: true,
          requireOTP: data.data.requireOTP,
          userId: data.data.userId,
        };
      } else {
        toast.error(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return { success: false, message: "Login failed" };
    } finally {
      dispatch(setLoginLoading(false));
    }
  };

  const loginWithOTP = async (
    username: string,
    password: string,
    otp: string
  ) => {
    dispatch(setLoginLoading(true));
    try {
      const response = await fetch("/api/auth/login-with-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, otp }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        dispatch(
          setUser({
            id: userData.id,
            username: userData.username,
            image: userData.image,
            role: userData.role,
            dateOfBirth: userData.dateOfBirth,
            phoneNumber: userData.phoneNumber,
          })
        );

        // Store token in localStorage
        localStorage.setItem("token", data.data.token);
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login with OTP error:", error);
      toast.error("Login failed");
      return { success: false, message: "Login failed" };
    } finally {
      dispatch(setLoginLoading(false));
    }
  };

  const sendOTP = async (email: string, role: UserRole) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle development mode
        if (data.developmentMode) {
          console.log("🔧 DEVELOPMENT MODE - OTP Code:", data.otp);
          if (data.otp) {
            toast.success(`Development OTP: ${data.otp}`);
          }
        }

        if (!data.success) {
          toast.error(data.message || "Failed to send OTP");
        }
      }
      return data;
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP");
      return { success: false, message: "Failed to send OTP" };
    }
  };

  const verifyOTP = async (email: string, otp: string, role: UserRole) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, role }),
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to verify OTP");
      }
      return data;
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Failed to verify OTP");
      return { success: false, message: "Failed to verify OTP" };
    }
  };

  const signup = async (userData: SignupData) => {
    dispatch(setSignupLoading(true));
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Signup successful!");
        return { success: true };
      } else {
        toast.error(data.message || "Signup failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return { success: false, message: "Signup failed" };
    } finally {
      dispatch(setSignupLoading(false));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  return {
    login,
    loginWithOTP,
    sendOTP,
    verifyOTP,
    signup,
    logout: logoutUser,
    loading,
  };
}
