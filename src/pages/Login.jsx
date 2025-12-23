import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    if (!value) return `Please enter ${name}`;
    if (name === "email") {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return "Please enter a valid email";
    }
    if (name === "password" && value.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    setServerError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setErrors({
      ...errors,
      [e.target.name]: validate(e.target.name, e.target.value)
    });
  };

 const handleSubmit = async () => {
  const newErrors = {
    email: validate("email", form.email),
    password: validate("password", form.password)
  };
  setErrors(newErrors);
  if (Object.values(newErrors).some(Boolean)) return;

  try {
    setLoading(true);

    const res = await API.post("/auth/login", form);

   
    localStorage.setItem("token", res.data.token);

   
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: res.data.id,
        name: res.data.name,
        email: res.data.email
      })
    );

    navigate("/profile");
  } catch (err) {
    setServerError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-4">
        <div className="card card-glass p-4">
          <h3 className="text-center mb-3">Login</h3>

          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <label>Email <span className="text-danger">*</span></label>
          <input
            className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="text-danger">{errors.email}</small>

          <label className="mt-2">
            Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className={`form-control mb-1 ${errors.password ? "is-invalid" : ""}`}
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="text-danger">{errors.password}</small>

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-3">
            New here?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
