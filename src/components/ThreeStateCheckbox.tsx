import { useState } from 'react';

interface ThreeStateCheckboxProps {
  status: "0" | "1" | "-1";
  onChange: (status: "0" | "1" | "-1") => void;
}

const ThreeStateCheckbox = ({ status, onChange }: ThreeStateCheckboxProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusText = () => {
    switch (status) {
      case '0':
        return 'No Action Taken';
      case '1':
        return 'Approved';
      case '-1':
        return 'Not Approved';
    }
  };

  const handleClick = () => {
    let newStatus: "0" | "1" | "-1";
    
    if (status === '0') {
      newStatus = '1';
    } else if (status === '1') {
      newStatus = '-1';
    } else {
      newStatus = '0';
    }

    onChange(newStatus);
  };

  return (
    <div
      className="status-circle"
      data-status={status}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && <div className="tooltip">{getStatusText()}</div>}
    </div>
  );
};

export default ThreeStateCheckbox;
