import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
export default function JobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 🔹 NEW: filter states
  const [keyword, setKeyword] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("job_listings") || "[]");
    setJobs(savedJobs);

    const savedNotifications = JSON.parse(
      localStorage.getItem("applicant_notifications") || "[]"
    );
    setNotifications(savedNotifications);
  }, []);

  const handleApply = (job) => {
    navigate("/JobApplyA", { state: { job } });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔹 NEW: filtered jobs logic
  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword =
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase());

    const matchesType = jobType ? job.type === jobType : true;
    const matchesLocation = location
      ? job.location.toLowerCase().includes(location.toLowerCase())
      : true;

    return matchesKeyword && matchesType && matchesLocation;
  });

  return (
    <div
      className="min-vh-100 p-3"
      style={{ background: "#003847", color: "white", width: "100vh" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Available Job Listings</h2>
          <span className="badge bg-info text-dark">
            Notifications: {unreadCount}
          </span>
        </div>

        {/* 🔹 NEW: SEARCH & FILTER BAR */}
        <div
          className="p-3 rounded-4 mb-4"
          style={{ background: "#005f73" }}
        >
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="col-12 col-md-6"
            >
              <div
                className="p-4 rounded-4 shadow-lg h-100"
                style={{ background: "#005f73" }}
              >
                <h4 className="mb-2 text-info">{job.title}</h4>
                <p className="mb-2">
                  <strong>Description:</strong> {job.description}
                </p>
                <p className="mb-2">
                  <strong>Qualifications:</strong> {job.qualifications}
                </p>
                <p className="mb-2">
                  <strong>Responsibilities:</strong> {job.responsibilities}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="mb-2">
                  <strong>Salary Range:</strong> {job.salary}
                </p>

                <button
                  className="btn btn-info w-100 fw-bold mt-3 rounded-3"
                  onClick={() => handleApply(job)}
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <p className="text-center mt-4 text-light">
              No jobs match your search.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
