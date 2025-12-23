import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
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
      [e.target.name]: validateField(e.target.name, e.target.value)
    });
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      password: validateField("password", form.password)
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setLoading(true);
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-4">
        <div className="card card-glass p-4">
          <h3 className="text-center mb-4">Create Account</h3>

          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <label>Name *</label>
          <input
            className={`form-control mb-1 ${errors.name ? "is-invalid" : ""}`}
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="text-danger">{errors.name}</small>

          <label>Email *</label>
          <input
            className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <small className="text-danger">{errors.email}</small>

          <label>Password *</label>
          <input
            type="password"
            className={`form-control mb-2 ${errors.password ? "is-invalid" : ""}`}
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
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
