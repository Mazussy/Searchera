import { useState } from "react";

const RejectModal = ({ open, title = "Reject", itemName = "item", onConfirm, onClose }) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 text-lg">✕</div>
          <div>
            <h3 className="font-poppins-semibold text-[#1a1a1a]">{title}</h3>
            <p className="text-xs text-gray-500 font-poppins">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm font-poppins text-gray-700 mb-4">
          You're about to reject <span className="font-poppins-semibold text-[#1a1a1a]">{itemName}</span>. Please provide a reason (optional):
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Optional reason"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-poppins placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent/40 resize-none"
        />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-poppins-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-poppins-medium text-white hover:bg-red-600 transition-colors">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
