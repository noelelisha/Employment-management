import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLock, FiMail, FiLayers, FiCheckCircle } from "react-icons/fi";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("employee@company.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else if (loggedInUser.role === "hr") {
        navigate("/hr");
      } else if (loggedInUser.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword("password123");
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5 px-3">
      <div className="text-center mb-4">
        <div
          className="d-inline-flex p-3 rounded-4 bg-primary text-white shadow-sm mb-3 align-items-center justify-content-center"
          style={{ width: 64, height: 64 }}
        >
          <FiLayers size={32} />
        </div>
        <h2 className="fw-bold text-dark mb-1">Smart Employee Management</h2>
        <p className="text-muted small">
          Workplace Learning & 30-Day New Recruit Confidence Journey
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4" style={{ maxWidth: 440, width: "100%" }}>
        <div className="card-body p-4 p-sm-5">
          <h4 className="fw-bold mb-3 text-dark">Sign In</h4>
          <p className="text-secondary small mb-4">
            Enter your workplace credentials or select a demo role below.
          </p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <FiMail />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <FiLock />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              {loading ? "Signing in..." : "Sign In to Platform"}
            </button>
          </form>

          <hr className="my-4" />

          <div>
            <div className="small fw-bold text-secondary text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>
              Quick Demo Login:
            </div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className={`btn btn-sm text-start py-2 px-3 border ${
                  email === "employee@company.com" ? "btn-primary text-white" : "btn-light"
                }`}
                onClick={() => handleQuickLogin("employee@company.com")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Employee / New Recruit</strong>
                    <div className="small opacity-75">Emma Watson (Software Developer)</div>
                  </div>
                  {email === "employee@company.com" && <FiCheckCircle />}
                </div>
              </button>

              <button
                type="button"
                className={`btn btn-sm text-start py-2 px-3 border ${
                  email === "manager@company.com" ? "btn-primary text-white" : "btn-light"
                }`}
                onClick={() => handleQuickLogin("manager@company.com")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Manager</strong>
                    <div className="small opacity-75">Marcus Vance (Engineering Lead)</div>
                  </div>
                  {email === "manager@company.com" && <FiCheckCircle />}
                </div>
              </button>

              <button
                type="button"
                className={`btn btn-sm text-start py-2 px-3 border ${
                  email === "hr@company.com" ? "btn-primary text-white" : "btn-light"
                }`}
                onClick={() => handleQuickLogin("hr@company.com")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>HR Specialist</strong>
                    <div className="small opacity-75">Helen Ross (People & Culture)</div>
                  </div>
                  {email === "hr@company.com" && <FiCheckCircle />}
                </div>
              </button>

              <button
                type="button"
                className={`btn btn-sm text-start py-2 px-3 border ${
                  email === "admin@company.com" ? "btn-primary text-white" : "btn-light"
                }`}
                onClick={() => handleQuickLogin("admin@company.com")}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Admin</strong>
                    <div className="small opacity-75">Arthur Pendelton (Operations)</div>
                  </div>
                  {email === "admin@company.com" && <FiCheckCircle />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-muted small">
        Default password for all demo accounts: <code>password123</code>
      </div>
    </div>
  );
}
