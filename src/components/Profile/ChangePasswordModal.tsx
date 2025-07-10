import React, { useState } from "react";
import { Loader2, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!current || !next || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#23262f] text-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 text-2xl hover:text-white"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <input
              type="password"
              className="input w-full bg-gray-800 text-white px-3 py-2 rounded"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="input w-full bg-gray-800 text-white px-3 py-2 rounded"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              className="input w-full bg-gray-800 text-white px-3 py-2 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && <div className="text-red-400 text-xs">{error}</div>}
          {success && (
            <div className="text-green-400 text-xs">
              Password changed successfully!
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
