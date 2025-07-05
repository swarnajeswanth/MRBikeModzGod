"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Authentication/useAuth";
import { toast } from "react-hot-toast";
import { Mail, Lock, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";

const RetailerLoginPage = () => {
  const { login, loginWithOTP, sendOTP } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async () => {
    if (!formData.email || otpLoading) return;

    dispatch(startLoading());
    setOtpLoading(true);
    try {
      const success = await sendOTP(formData.email, "retailer");
      if (success) {
        dispatch(stopLoading());
        setOtpSent(true);
        toast.success("Verification code sent to your email!");
      } else {
        dispatch(stopLoading());
        toast.error("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      dispatch(stopLoading());
      toast.error("Failed to send verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    dispatch(startLoading());
    try {
      const result = await login(formData.email, formData.password, "retailer");

      if (result && result.success) {
        dispatch(stopLoading());
        toast.success("Login successful!");
        router.push("/dashboard");
      } else if (result && typeof result === "object" && result.requireOTP) {
        dispatch(stopLoading());
        setShowOTPForm(true);
        await handleSendOTP();
      } else {
        dispatch(stopLoading());
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      dispatch(stopLoading());
      toast.error("Login failed. Please try again.");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Please enter the verification code.");
      return;
    }

    dispatch(startLoading());
    try {
      const result = await loginWithOTP(
        formData.email,
        formData.password,
        formData.otp
      );
      if (result && result.success) {
        dispatch(stopLoading());
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        dispatch(stopLoading());
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      dispatch(stopLoading());
      toast.error("Login failed. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    setShowOTPForm(false);
    setOtpSent(false);
    setFormData({ ...formData, otp: "" });
  };

  return (
    <>
      <LoadingSpinner />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600/20 to-transparent text-white px-4 z-90 perspective-1000">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-red-600/20 transform-style-preserve-3d transition-transform duration-300">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/auth")}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-3xl font-bold">
              {showOTPForm ? "Verify OTP" : "Retailer Login"}
            </h2>
          </div>

          {!showOTPForm ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Login as Retailer
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-5">
              <div className="text-center mb-4">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <p className="text-gray-300">
                  A verification code has been sent to{" "}
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Verify & Login
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                >
                  {otpLoading ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Only authorized retailers can access this login.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetailerLoginPage;
