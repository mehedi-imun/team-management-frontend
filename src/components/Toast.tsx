interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

const Toast = ({ message, type = 'success' }: ToastProps) => {
  return <div className={`toast ${type}`}>{message}</div>;
};

export default Toast;
