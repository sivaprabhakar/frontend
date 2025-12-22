import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    dob: "",
    contact: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const storedProfile = JSON.parse(localStorage.getItem("profile"));

    setProfile({
      name: user?.email?.split("@")[0] || "",
      email: user?.email || "",
      age: storedProfile?.age || "",
      dob: storedProfile?.dob || "",
      contact: storedProfile?.contact || ""
    });

    // Fetch profile from backend
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setProfile((prev) => ({
          ...prev,
          age: res.data?.age || "",
          dob: res.data?.dob || "",
          contact: res.data?.contact || ""
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setError("");
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.post("/profile", {
        age: profile.age,
        dob: profile.dob,
        contact: profile.contact
      });

      localStorage.setItem("profile", JSON.stringify(profile));
      setMessage("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-5">
        <div className="card card-glass p-4">
          <h3 className="text-center mb-3">My Profile</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {/* Name */}
          <input
            className="form-control mb-2"
            name="name"
            value={profile.name}
            placeholder="Name"
            disabled
          />

          {/* Email */}
          <input
            className="form-control mb-2"
            name="email"
            value={profile.email}
            placeholder="Email"
            disabled
          />

          {/* Age */}
          <input
            className="form-control mb-2"
            name="age"
            value={profile.age || ""}
            placeholder="Age"
            onChange={handleChange}
          />

          {/* DOB */}
          <input
            className="form-control mb-2"
            name="dob"
            value={profile.dob || ""}
            placeholder="Date of Birth (YYYY-MM-DD)"
            onChange={handleChange}
          />

          {/* Contact */}
          <input
            className="form-control mb-3"
            name="contact"
            value={profile.contact || ""}
            placeholder="Contact Number"
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
