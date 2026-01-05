import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPage.css';

export default function SuccessA() {
  const navigate = useNavigate();

  // 🔹 ADD: auto redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/ApplicationsA"); // change route if needed
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-page animate-drop">
      <h1>Application submitted Successfully!</h1>
    </div>
  );
}
