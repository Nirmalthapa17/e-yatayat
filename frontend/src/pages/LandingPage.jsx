import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("login");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup States
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const showForm = (type) => {
    setFormType(type);
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
        alert("Signup complete! Please login.");
        setFormType("login");
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
        alert("Login successful!");
        localStorage.setItem("userId", data.user.id);
        navigate("/dashboard"); // Redirect to your digital wallet
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Error connecting to server during login");
    }
  };

  return (
    <>
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
            <input className="srch" type="search" placeholder="Type To text" />
            <button className="btn">Find</button>
          </div>
        </div>

        <div className="content">
          <h1>Web Helper & <br /> Finder</h1>
          <p className="par">We are here for making digital society<br />Get connected and make the most out of your experience!</p>
          <div>
            <button className="cn" onClick={() => showForm("signup")}>Be Family</button>
          </div>

          <div className="form-container">
            {formType === "login" ? (
              <form className="form" onSubmit={handleLoginSubmit}>
                <h2>Login Here</h2>
                <input type="email" placeholder="Enter Email Here" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password Here" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                <button className="btnn" type="submit">Login</button>
                <p className="link">Don't have an account?<br /><a href="#signup" onClick={() => showForm("signup")}>Sign up</a> here</p>
              </form>
            ) : (
              <form className="form" onSubmit={handleSignupSubmit}>
                <h2>Sign Up Here</h2>
                <input type="text" placeholder="Enter Full Name" required value={signupFullName} onChange={(e) => setSignupFullName(e.target.value)} />
                <input type="email" placeholder="Enter Email Here" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" required value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                <button className="btnn" type="submit">Sign Up</button>
                <p className="link">Already have an account?<br /><a href="#login" onClick={() => showForm("login")}>Login</a> here</p>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Feedback and Contact sections remain as they were */}
    </>
  );
}

export default LandingPage;