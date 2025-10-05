import React from "react";

const ConfirmLeaveModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Leave quiz?</h3>
        <p className="text-gray-600 mb-4">Your current progress might be lost. Are you sure you want to leave this active quiz?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Stay</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Leave</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeaveModal;
