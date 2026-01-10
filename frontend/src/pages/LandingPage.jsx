import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTANT: Make sure this file exists in your components folder

function LandingPage() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("login");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  // Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Monitor scroll for the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      // Button appears after scrolling 500px down
      setShowScrollBtn(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showForm = (type) => {
    setFormType(type);
    // Clear all inputs when switching forms
    setSignupFullName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName: signupFullName, 
          email: signupEmail, 
          password: signupPassword 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        showForm("login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch {
      alert("Error connecting to server during signup");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      
      const data = await res.json();
      if (res.ok) {
        // 1. Store user ID for later use (verification/profile)
        localStorage.setItem("userId", data.user.id);
        
        alert("Login successful!");

        // 2. Navigate to the dashboard route
        navigate("/dashboard"); 
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Error connecting to server during login");
    }
  };

  return (
    <>
      {/* 🚀 Hovering Facility: Back to Top Button */}
      {showScrollBtn && (
        <button className="hover-top-btn" onClick={scrollToTop}>
          ↑ Back to Login
        </button>
      )}

      <div className="main">
        <div className="navbar">
          <div className="icon"><h2 className="logo">e-Yatayat</h2></div>
          <div className="menu">
            <ul>
              <li><a href="#about">ABOUT</a></li>
              <li><a href="#service">SERVICE</a></li>
              <li><a href="#feedback">FEEDBACK</a></li>
              <li><a href="#contact">CONTACT US</a></li>
            </ul>
          </div>
          <div className="search">
            <input className="srch" type="search" placeholder="Search services..." />
            <button className="btn">Find</button>
          </div>
        </div>

        <div className="content">
          <h1>Web Helper & <br /> Finder</h1>
          <p className="par">
            We are here for making digital society<br />
            Get connected and make the most out of your experience!
          </p>
          <div>
            <button className="cn" onClick={() => showForm("signup")}>Be Family</button>
          </div>

          <div className="form-container">
            {formType === "login" ? (
              <form className="form" onSubmit={handleLoginSubmit}>
                <h2>Login Here</h2>
                <input type="email" placeholder="Enter Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <button className="btnn" type="submit">Login</button>
                <p className="link">
                  Don't have an account?<br />
                  <span className="switch-link" onClick={() => showForm("signup")}>Sign up here</span>
                </p>
              </form>
            ) : (
              <form className="form" onSubmit={handleSignupSubmit}>
                <h2>Sign Up Here</h2>
                <input type="text" placeholder="Full Name" required value={signupFullName} onChange={(e) => setSignupFullName(e.target.value)} />
                <input type="email" placeholder="Email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                <input type="password" placeholder="Password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" required value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                <button className="btnn" type="submit">Sign Up</button>
                <p className="link">
                  Already have an account?<br />
                  <span className="switch-link" onClick={() => showForm("login")}>Login here</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Sections with IDs for Navbar anchors */}
      <div id="feedback" className="feedback-section">
        <h2 className="feedback-title">What Our Users Say</h2>
        <div className="feedback-container">
          <div className="feedback-card">
            <div className="user-info">
              <img src="/src/assets/images/img1.png" alt="User" /><span className="username">Aayush Bista</span>
            </div>
            <p>🌟 “Nice work” 📱</p>
          </div>
          <div className="feedback-card">
            <div className="user-info">
              <img src="/src/assets/images/img2.png" alt="User" /><span className="username">Prerana Thapa</span>
            </div>
            <p>💬 “niceeeeeee isssssssssws” 🤗📚</p>
          </div>
          <div className="feedback-card">
            <div className="user-info">
              <img src="/src/assets/images/img3.png" alt="User" /><span className="username">Anish K.C.</span>
            </div>
            <p>🚀 “ok handling” 👍</p>
          </div>
        </div>
      </div>

      <div id="contact" className="contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-container">
          <div className="contact-card"><h3>📍 Address</h3><p>Dhulikhel, Nepal</p></div>
          <div className="contact-card"><h3>📞 Phone</h3><p>+977-9812345678</p></div>
          <div className="contact-card"><h3>📧 Email</h3><p>support@e-yatayat.com</p></div>
        </div>
      </div>

      
    </>
  );
}

export default LandingPage;