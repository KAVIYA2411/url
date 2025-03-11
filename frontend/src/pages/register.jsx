import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import m_Image from "../assets/m_image.svg";
import cuv_Image from "../assets/cuv.png";

const API_BASE_URL = typeof process !== "undefined" && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "https://backend-url-shorten-2.onrender.com";

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, user, {
        headers: { "Content-Type": "application/json" },
      });

      if (response && response.data) {
        sessionStorage.setItem("user", JSON.stringify({ username: user.name, email: user.email }));
        alert("Registration Successful!");

        formRef.current.reset();
        setUser({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="top-right-buttons">
        <button className="signup" onClick={() => navigate("/")}>Sign Up</button>
        <button className="signin" onClick={() => navigate("/login")}>Login</button>
      </div>

      <div className="image-container">
        <img className="m_image" src={m_Image} alt="scenic" />
        <img className="cuv_image" src={cuv_Image} alt="cuv" />
      </div>

      {/* Autofill Trick */}
      <form ref={formRef} onSubmit={handleSubmit} className="register-form" autoComplete="off">
        <input type="text" name="hidden-user" style={{ display: "none" }} autoComplete="off" />
        <input type="password" name="hidden-pass" style={{ display: "none" }} autoComplete="off" />

        <div className="form-content">
          <h2>Join us Today!</h2>

          {/* Name Field */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            required
            autoComplete="off"
            onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={user.email}
            onChange={handleChange}
            required
            autoComplete="off"
            onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
          />

          {/* Mobile Field */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile no."
            value={user.mobile}
            onChange={handleChange}
            required
            autoComplete="off"
            onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
          />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            autoComplete="off"
            onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
          />

          {/* Confirm Password Field */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="off"
            onFocus={(e) => e.target.setAttribute("autocomplete", "off")}
          />

          <button type="submit">Register</button>
          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="login-clickable">
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
