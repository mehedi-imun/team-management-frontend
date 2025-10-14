import React from "react";

interface StatusCheckboxProps {
  status: 0 | 1 | 2;
  onStatusChange: (status: 0 | 1 | 2) => void;
}

export const StatusCheckbox: React.FC<StatusCheckboxProps> = ({ status, onStatusChange }) => {
  const getDisplay = () => {
    switch (status) {
      case 0:
        return "⚪"; // no action
      case 1:
        return "✔️"; // approved
      case 2:
        return "❌"; // not approved
    }
  };

  const handleClick = () => {
    const nextStatus: 0 | 1 | 2 = status === 0 ? 1 : status === 1 ? 2 : 0;
    onStatusChange(nextStatus);
  };

  const getTooltip = () => {
    switch (status) {
      case 0:
        return "No Action Taken";
      case 1:
        return "Approved";
      case 2:
        return "Not Approved";
    }
  };

  return (
    <span
      className="status-icon tooltip"
      onClick={handleClick}
      title={getTooltip()}
    >
      {getDisplay()}
    </span>
  );
};
