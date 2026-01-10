import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePreview from '../components/dashboard/ProfilePreview'; 
import RenewalButtons from '../components/dashboard/RenewalButtons';

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data);
        } else {
          console.error("User not found");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId, navigate]);

  // CSS for button alignment and overflow prevention
  const styles = {
    buttonsWrapper: {
      display: 'flex',
      flexWrap: 'wrap', // Allows buttons to move to the next line on small screens
      justifyContent: 'center',
      gap: '15px', // Adds even spacing between buttons
      width: '100%',
      padding: '10px 0'
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2 className="text-primary fw-bold m-0">e-Yatayat</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">🏠 Dashboard</Link>
          <Link to="/documents" className="nav-link">📄 My Documents</Link>
          <Link to="/vehicles" className="nav-link">🚗 Vehicle Info</Link>
          <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
          <Link to="/settings" className="nav-link">⚙️ Settings</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-search">
            <input type="text" placeholder="Search for documents..." className="form-control" />
          </div>
          <div className="header-user">
            <span className="me-3 fw-medium">{userData?.fullName || "Loading..."}</span>
            <div className="avatar-circle">
              {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold m-0">Welcome, {userData?.fullName?.split(' ')[0] || "User"}!</h1>
              <p className="text-muted m-0 small">Here is what's happening with your vehicles today.</p>
            </div>
            <span className="badge bg-light text-dark border p-2">
              📅 {new Date().toLocaleDateString()}
            </span>
          </div>

          {loading ? (
            <div className="text-center p-5">
               <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4 align-items-start"> 
              
              <div className="col-lg-4">
                <section className="card border-0 shadow-sm p-4 mb-4">
                  <h3 className="h5 fw-bold text-primary mb-4 text-center">User Profile</h3>
                  <ProfilePreview user={userData} /> 
                </section>
              </div>

              <div className="col-lg-8"> 
                <h3 className="h6 text-uppercase fw-bold text-muted mb-2">Quick Renewal Services</h3>
                <p className="small text-muted">Access to renewal forms is granted upon successful verification.</p>
                
                <section className="renewal-action-card card border-0 shadow-sm p-4 text-center mb-4">
                   <div className="renewal-buttons-wrapper">
              <RenewalButtons 
                isVerified={userData?.isVerified} 
                hasLicense={!!userData?.linkedLicense}
                hasVehicle={userData?.linkedVehicles?.length > 0}
              />
            </div>
                </section>

                <section className="card border-0 shadow-sm p-4 mb-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 fw-bold text-dark m-0">Status Summary</h3>
                  
                  </div>
                  
                  {userData?.isVerified ? (
                    <p className="text-muted mb-0 small">
                      Your account is <span className="text-success fw-bold">Verified</span>. 
                      You can now use all digital services.
                    </p>
                  ) : userData?.verificationStatus === "Pending" ? (
                    <p className="text-muted mb-0 small">
                      Your documents are currently <span className="text-info fw-bold">Under Review</span>. 
                      Please wait for admin approval.
                    </p>
                  ) : (
                    <p className="text-muted mb-0 small">
                      Your account is currently <span className="text-warning fw-bold">Unverified</span>. 
                      Please <Link to="/verification-form">submit your documents</Link> to continue.
                    </p>
                  )}
                </section>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;