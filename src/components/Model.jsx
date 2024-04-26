import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="fixed inset-0 bg-black opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="z-50 bg-white rounded-lg p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
