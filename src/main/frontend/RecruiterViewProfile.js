import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { getResumeFromDB } from "./ResumeDB";

export default function RecruiterViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const apps =
      JSON.parse(localStorage.getItem("applicant_applications")) || [];

    const found = apps.find((a) => String(a.id) === String(id));
    setApplication(found);
  }, [id]);

  if (!application) {
    return (
      <div style={{ minHeight: "100vh", background: "#001f3f", color: "white", padding: "2rem" }}>
        <Container>
          <h3 className="text-warning text-center">Applicant not found</h3>
          <Button variant="info" onClick={() => navigate(-1)}>Back</Button>
        </Container>
      </div>
    );
  }

  const openResume = async () => {
    const file = await getResumeFromDB(application.resumeId);
    if (!file) {
      alert("Resume file not found");
      return;
    }
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#001f3f", padding: "2rem", color: "white" }}>
      <Container style={{ maxWidth: "900px" }}>
        <Card style={{ background: "#012c40", padding: "30px", borderRadius: "20px" }}>
          <h2 className="text-center mb-4" style={{ color: "cyan" }}>
            Applicant Profile
          </h2>

          <h4 style={{ color: "cyan" }}>Personal Information</h4>
          <Row>
            <Col>First Name: {application.firstName || "-"}</Col>
            <Col>Last Name: {application.lastName || "-"}</Col>
          </Row>
          <Row className="mb-3">
            <Col>Email: {application.email || "-"}</Col>
            <Col>Phone: {application.phone || "-"}</Col>
          </Row>

          <h4 style={{ color: "cyan" }}>Job Details</h4>
          <p>Position: {application.jobTitle}</p>
          <p>Expected Salary: {application.expectedSalary || "-"}</p>

          <h4 style={{ color: "cyan" }}>Experience</h4>
          <p>Years: {application.experience || "-"}</p>
          <p>Skills: {application.skills || "-"}</p>

          <h4 style={{ color: "cyan" }}>Additional</h4>
          <p>LinkedIn: {application.linkedin || "-"}</p>
          <p>Portfolio: {application.portfolio || "-"}</p>
          <p>Cover Letter: {application.coverLetter || "-"}</p>

          <h4 style={{ color: "cyan" }}>Availability</h4>
          <p>Date of Birth: {application.startDate || "-"}</p>
          <p>Relocate: {application.relocate || "-"}</p>

          <h4 style={{ color: "cyan" }}>Resume</h4>
          {application.resumeId ? (
            <Button variant="info" onClick={openResume}>
              📄 {application.resumeName}
            </Button>
          ) : (
            <p className="text-warning">Resume not uploaded</p>
          )}

          <div className="text-center mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
