const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <div className="loader-text">Loading...</div>
      <div className="progress-bar">
        <div className="progress-bar-fill"></div>
      </div>
    </div>
  );
};

export default Loader;
