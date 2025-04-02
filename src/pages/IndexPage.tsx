
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

export default IndexPage;
