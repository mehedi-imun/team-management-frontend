interface ThreeStateCheckboxProps {
  status: "0" | "1" | "-1";
  onChange: (status: "0" | "1" | "-1") => void;
}

const ThreeStateCheckbox = ({ status, onChange }: ThreeStateCheckboxProps) => {
  const handleClick = () => {
    const nextStatus: "0" | "1" | "-1" =
      status === "0" ? "1" : status === "1" ? "-1" : "0";
    onChange(nextStatus);
  };

  const getColor = () =>
    status === "1" ? "green" : status === "-1" ? "red" : "transparent";
  const getSymbol = () => (status === "1" ? "✔" : status === "-1" ? "✖" : "");

  const getTooltip = () =>
    status === "0"
      ? "No Action Taken"
      : status === "1"
      ? "Approved"
      : "Not Approved";

  return (
    <div
      onClick={handleClick}
      title={getTooltip()}
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "2px solid #666",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: getColor(),
        color: "#fff",
        userSelect: "none",
      }}
    >
      {getSymbol()}
    </div>
  );
};

export default ThreeStateCheckbox;
