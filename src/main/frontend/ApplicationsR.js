import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function JobApplicationDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setApplications(
      JSON.parse(localStorage.getItem("applicant_applications") || "[]")
    );
  }, []);

  const handleRespond = (app, status) => {
    const updated = applications.map((a) =>
      a.jobTitle === app.jobTitle && a.dateTime === app.dateTime
        ? { ...a, recruiterStatus: status }
        : a
    );
    setApplications(updated);
    localStorage.setItem("applicant_applications", JSON.stringify(updated));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#001f3f",
        padding: "2rem",
        color: "white",
      }}
    >
      <Container>
        <h2 className="mb-4">Recruiter Dashboard</h2>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Job</th>
              <th>Profile</th>
              <th>Date</th>
              <th>Status</th>
              <th>Respond</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No applications yet
                </td>
              </tr>
            )}

            {applications.map((app, idx) => (
              <tr key={idx}>
                <td>{app.jobTitle}</td>

                {/*  Replaced View Applicant → View Profile */}
                <td>
                  <Link
                     to={`/RecruiterViewProfile/${app.id}`}
                    style={{ color: "cyan", textDecoration: "none" }}
                  >
                    View Profile
                  </Link>
                </td>

                <td>{new Date(app.dateTime).toLocaleString()}</td>

                <td>{app.recruiterStatus || "Pending"}</td>

                <td>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleRespond(app, "Selected")}
                  >
                    Select
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRespond(app, "Rejected")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
