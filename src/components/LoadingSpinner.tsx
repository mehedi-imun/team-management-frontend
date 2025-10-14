interface LoadingSpinnerProps {
  show: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="loading-spinner show">
      <div className="spinner"></div>
    </div>
  );
};