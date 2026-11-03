import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

export default function UnauthorizedPage() {
  return (
    <div className="text-center py-5">
      <div className="text-danger mb-3">
        <FiAlertTriangle size={56} />
      </div>
      <h2 className="fw-bold">Access Restricted</h2>
      <p className="text-muted mb-4">
        You do not have administrative or departmental permission to view this section.
      </p>
      <Link to="/" className="btn btn-primary">
        <FiHome className="me-2" /> Return to Dashboard
      </Link>
    </div>
  );
}
