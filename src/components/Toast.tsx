import React from "react";
import "./Toast.css";

const Toast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className={`toast ${message ? "show" : ""}`}>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
