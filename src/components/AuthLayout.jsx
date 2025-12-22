const AuthLayout = ({ title, children }) => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)"
      }}
    >
      <div className="card shadow-lg border-0" style={{ width: "380px" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
