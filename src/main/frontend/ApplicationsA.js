import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

export default function ApplicationsA() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem("applicant_applications") || "[]");
    const applicantId = localStorage.getItem("signupId");
    const myApps = apps.filter(app => app.applicantId === applicantId);

    setApplications(myApps);
  }, []);

  return (
    <div
      className="page-container min-vh-100 p-3" style={{ background: "linear-gradient(135deg, #001f3f, #004f6e)", color: "white"
      }}
    >
      <Container>
        <h2 className="title mb-4 text-center">Applications</h2>
        <div className="d-flex flex-wrap gap-3">
          {applications.length === 0 && (
            <p className="text-center text-light">You have not applied to any jobs yet.</p>
          )}

          {applications.map((app) => (
            <Card
              key={app.id}
              style={{
                background: "#012c40",
                color: "white",
                padding: "1rem",
                width: "18rem",
              }}
            >
              <Card.Body className="card p-3 bg-dark shadow-lg">
                <Card.Title className="mb-2 text-info">{app.jobTitle}</Card.Title>
                <Card.Text>
                  <strong>Date Applied:</strong>{" "}
                  {new Date(app.dateTime).toLocaleString()}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong> {app.recruiterStatus || "Pending"}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

