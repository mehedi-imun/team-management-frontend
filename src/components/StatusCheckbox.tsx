import React, { useState } from 'react';

interface StatusCheckboxProps {
  status: number;
  onStatusChange: (status: number) => Promise<void>;
  loading?: boolean;
}

export const StatusCheckbox: React.FC<StatusCheckboxProps> = ({
  status,
  onStatusChange,
  loading = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const statusMap: Record<"0" | "1" | "-1", { icon: string; label: string; color: string }> = {
    "0": { icon: '⭕', label: 'No Action Taken', color: '#999' },
    "1": { icon: '✅', label: 'Approved', color: '#28a745' },
    "-1": { icon: '❌', label: 'Not Approved', color: '#dc3545' },
  };

  const current = statusMap[String(status) as "0" | "1" | "-1"] || statusMap["0"];

  const handleClick = async () => {
    if (loading) return;
    const nextStatus = status === 0 ? 1 : status === 1 ? -1 : 0;
    await onStatusChange(nextStatus);
  };

  return (
    <div className="tooltip">
      <button
        className="status-icon"
        onClick={handleClick}
        disabled={loading}
        style={{ color: current.color }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {current.icon}
      </button>
      {showTooltip && (
        <span className="tooltip-text">{current.label}</span>
      )}
    </div>
  );
};