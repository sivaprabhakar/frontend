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

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }

    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setProfile((prev) => ({ ...prev, ...res.data }));
      } catch {
        setError("Failed to load profile");
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
      await API.put("/profile", {
        age: profile.age,
        dob: profile.dob,
        contact: profile.contact
      });
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

          <input className="form-control mb-2" value={profile.name} disabled />
          <input className="form-control mb-2" value={profile.email} disabled />

          <input
            className="form-control mb-2"
            name="age"
            value={profile.age}
            placeholder="Age"
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="dob"
            value={profile.dob}
            placeholder="YYYY-MM-DD"
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            name="contact"
            value={profile.contact}
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
