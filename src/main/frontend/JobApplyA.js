import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button, Row, Col, Fade, Card } from "react-bootstrap";
import { saveResumeToDB } from "./ResumeDB";

export default function JobApplyA() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  const [open] = useState(true);
  const [position, setPosition] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    expectedSalary: "",
    experience: "",
    skills: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    startDate: "",
    relocate: "Yes",
    resumeId: null,
    resumeName: ""
  });

  useEffect(() => {
    if (job?.title) setPosition(job.title);
  }, [job]);

  if (!job) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resumeId = Date.now(); // unique ID per application

    await saveResumeToDB(resumeId, file);

    setFormData((prev) => ({
      ...prev,
      resumeId,
      resumeName: file.name
    }));
  };

  const handleSubmit = () => {
    const newApplication = {
      id: Date.now(),
      applicantId: localStorage.getItem("signupId"),
      jobTitle: position,
      dateTime: new Date().toISOString(),
      recruiterStatus: "Pending",
      ...formData
    };

    const existing =
      JSON.parse(localStorage.getItem("applicant_applications")) || [];

    localStorage.setItem(
      "applicant_applications",
      JSON.stringify([...existing, newApplication])
    );

    navigate("/SuccessA");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#001f2e", padding: "40px" }}>
      <Container style={{ maxWidth: "800px" }}>
        <Fade in={open}>
          <Card
            style={{
              background: "#012c40",
              color: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 0 20px rgba(0,255,255,0.2)",
            }}
          >
            <h2 className="mb-4 text-center" style={{ color: "cyan" }}>
              Job Application Form
            </h2>

            <Form>
              <h4 style={{ color: "cyan" }}>Personal Information</h4>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="firstName" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="lastName" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" onChange={handleChange} />
              </Form.Group>

              <h4 style={{ color: "cyan" }}>Resume Upload</h4>
              <Form.Group className="mb-3">
                <Form.Control type="file" onChange={handleResumeUpload} />
              </Form.Group>

              <h4 style={{ color: "cyan" }}>Job Details</h4>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expected Salary</Form.Label>
                <Form.Control name="expectedSalary" onChange={handleChange} />
              </Form.Group>

              <h4 style={{ color: "cyan" }}>Experience</h4>
              <Form.Group className="mb-3">
                <Form.Label>Years</Form.Label>
                <Form.Control name="experience" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="skills"
                  onChange={handleChange}
                />
              </Form.Group>

              <h4 style={{ color: "cyan" }}>Additional</h4>
              <Form.Group className="mb-3">
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control name="linkedin" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Portfolio</Form.Label>
                <Form.Control name="portfolio" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cover Letter</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="coverLetter"
                  onChange={handleChange}
                />
              </Form.Group>

              <h4 style={{ color: "cyan" }}>Availability</h4>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" name="startDate" onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Relocate?</Form.Label>
                <Form.Select name="relocate" onChange={handleChange}>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Maybe</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="info"
                style={{ width: "100%", fontWeight: "bold" }}
                onClick={handleSubmit}
              >
                Submit Application
              </Button>
            </Form>
          </Card>
        </Fade>
      </Container>
    </div>
  );
}
