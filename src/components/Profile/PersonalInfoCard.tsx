import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store";
import { Loader2, Pencil, Check, X, KeyRound } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import { updateUserProfile } from "@/components/store/UserSlice";

const getInitial = (name: string) =>
  name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";

const PersonalInfoCard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [editField, setEditField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState({
    name: user.username || "",
    email: user.username || "",
    phoneNumber: user.phoneNumber || "",
  });
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const updateLoading = useSelector(
    (state: RootState) => state.user.updateLoading
  );
  const updateError = useSelector((state: RootState) => state.user.updateError);

  const handleEdit = (field: string) => setEditField(field);
  const handleCancel = () => {
    setEditField(null);
    setFieldValues({
      name: user.username || "",
      email: user.username || "",
      phoneNumber: user.phoneNumber || "",
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSave = async (field: string) => {
    setLoadingField(field);
    if (field === "name" && userId) {
      // Update username in backend and Redux
      await dispatch(
        updateUserProfile({
          userId,
          updates: { username: fieldValues.name },
        }) as any
      );
    }
    setLoadingField(null);
    setEditField(null);
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fieldValues.email, role: user.role }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpSuccess("OTP sent to new email.");
      } else {
        setOtpError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setOtpError("Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    setOtpSuccess("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fieldValues.email,
          otp,
          role: user.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Actually update the email in the backend and Redux store
        if (userId) {
          await dispatch(
            updateUserProfile({
              userId,
              updates: { username: fieldValues.email },
            }) as any
          );
        }
        setOtpSuccess("Email verified and updated!");
        setOtpSent(false);
        setOtp("");
        setEditField(null);
      } else {
        setOtpError(data.message || "OTP verification failed.");
      }
    } catch (err) {
      setOtpError("OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  // When user.username changes (e.g., after update), update local state
  React.useEffect(() => {
    setFieldValues((prev) => ({
      ...prev,
      name: user.username || "",
    }));
  }, [user.username]);

  return (
    <div className="bg-[#23262f] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8 shadow-lg">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        {user.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-red-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-600 text-white text-3xl font-bold border-2 border-red-500">
            {getInitial(user.username)}
          </div>
        )}
      </div>
      {/* Info Fields */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <div className="text-xs text-gray-400 mb-1">Email</div>
          {editField === "email" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  name="email"
                  value={fieldValues.email}
                  onChange={handleChange}
                  className="input bg-gray-800 text-white px-2 py-1 rounded"
                  autoFocus
                />
                <button
                  onClick={handleSendOtp}
                  className="text-blue-500 border border-blue-500 rounded px-2 py-1 text-xs"
                  disabled={otpLoading}
                >
                  {otpLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
                <button onClick={handleCancel} className="text-gray-400">
                  <X />
                </button>
              </div>
              {otpSent && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input bg-gray-800 text-white px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="text-green-500 border border-green-500 rounded px-2 py-1 text-xs"
                    disabled={otpLoading || !otp}
                  >
                    {otpLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              )}
              {otpError && (
                <div className="text-red-400 text-xs mt-1">{otpError}</div>
              )}
              {otpSuccess && (
                <div className="text-green-400 text-xs mt-1">{otpSuccess}</div>
              )}
              {updateError && (
                <div className="text-red-400 text-xs mt-1">{updateError}</div>
              )}
              {updateLoading && (
                <div className="flex items-center gap-2 text-xs text-blue-400 mt-1">
                  <Loader2 className="animate-spin" /> Updating email...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white">
                {user.username}
              </span>
              <button
                onClick={() => handleEdit("email")}
                className="text-gray-400 hover:text-red-400"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>
        {/* Phone Number */}
        {user.phoneNumber && (
          <div>
            <div className="text-xs text-gray-400 mb-1">Phone Number</div>
            {editField === "phoneNumber" ? (
              <div className="flex items-center gap-2">
                <input
                  name="phoneNumber"
                  value={fieldValues.phoneNumber}
                  onChange={handleChange}
                  className="input bg-gray-800 text-white px-2 py-1 rounded"
                  autoFocus
                />
                <button
                  onClick={() => handleSave("phoneNumber")}
                  className="text-green-500"
                  disabled={loadingField === "phoneNumber"}
                >
                  {loadingField === "phoneNumber" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Check />
                  )}
                </button>
                <button onClick={handleCancel} className="text-gray-400">
                  <X />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">
                  {user.phoneNumber}
                </span>
                <button
                  onClick={() => handleEdit("phoneNumber")}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Change Password */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-red-600 transition-colors"
        >
          <KeyRound size={18} /> Change Password
        </button>
        {showPasswordModal && (
          <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
      </div>
    </div>
  );
};

export default PersonalInfoCard;
