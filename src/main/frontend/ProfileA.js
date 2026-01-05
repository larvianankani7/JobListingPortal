import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useSearchParams, useParams } from "react-router-dom";

const STORAGE_KEY = "applicant_profile_full";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const BACKEND_URL = "http://localhost:5000";

export default function ProfileA() {
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  const viewOnly =
    searchParams.get("viewOnly") === "true" ||
    searchParams.get("from") === "recruiter";

  const userId = id || localStorage.getItem("userId");

  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "Alice Doe",
    role: "Full Stack Developer",
    about: "",
    age: "",
    location: "",
    contact: "",
    email: "",
    skills: "",
    experience: "",
    education: { institute: "", degree: "", cgpa: "" },
    projects: "",
    languages: "",
    photo: "",
    resumeFile: null,
  });

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (key, value) =>
    setProfile(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

  const handleEduChange = (key, value) =>
    setProfile(prev => {
      const updated = { ...prev, education: { ...prev.education, [key]: value } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => {
        const updated = { ...prev, photo: reader.result };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- RESUME UPLOAD ---------------- */
  const handleResumeUpload = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setProfile(prev => {
      const updated = {
        ...prev,
        resumeFile: {
          name: file.name,
          dataUrl: reader.result, // store base64 data so we can open it
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    alert("Resume uploaded and saved successfully!");
  };
  reader.readAsDataURL(file);
};

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSaveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsEditing(false);
    alert("Profile saved successfully!");
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        padding: "30px",
        background: "#003847",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: "#005f73",
          color: "white",
          width: "80%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px",
          borderRadius: "16px",
        }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Profile</h2>
          {!viewOnly && (
            <Button
              variant="outline-info"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>

        {/* PROFILE PIC */}
        <div className="text-center mb-4">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #9bd3dd",
              }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#9bd3dd",
                display: "inline-block",
                border: "3px solid #9bd3dd",
              }}
            />
          )}

          {isEditing && !viewOnly && (
            <Form.Control
              className="mt-3"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          )}

          <h4 className="mt-3">{profile.name}</h4>
          <p>{profile.role}</p>
        </div>

        {/* ABOUT */}
        <Section title="About">
          {isEditing && !viewOnly ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={profile.about}
              onChange={e => handleChange("about", e.target.value)}
            />
          ) : (
            <p>{profile.about || "—"}</p>
          )}
        </Section>

        {/* BASIC INFO */}
        <Section title="Basic Information">
          {isEditing && !viewOnly ? (
            <>
              {["name", "role", "age", "location", "contact", "email"].map(
                key => (
                  <Form.Control
                    key={key}
                    className="mb-2"
                    value={profile[key]}
                    placeholder={key}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                )
              )}
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Age:</strong> {profile.age}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <p><strong>Contact:</strong> {profile.contact}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </>
          )}
        </Section>

        {/* SKILLS */}
        <Section title="Skills">
          {isEditing ? (
            <Form.Control
              value={profile.skills}
              onChange={e => handleChange("skills", e.target.value)}
            />
          ) : (
            <p>{profile.skills || "—"}</p>
          )}
        </Section>

        {/* EXPERIENCE */}
        <Section title="Experience">
          {isEditing ? (
            <Form.Control
              value={profile.experience}
              onChange={e => handleChange("experience", e.target.value)}
            />
          ) : (
            <p>{profile.experience || "—"}</p>
          )}
        </Section>

        {/* EDUCATION */}
        <Section title="Education">
          {isEditing ? (
            <>
              <Form.Control
                className="mb-2"
                value={profile.education.institute}
                onChange={e => handleEduChange("institute", e.target.value)}
                placeholder="Institute"
              />
              <Form.Control
                className="mb-2"
                value={profile.education.degree}
                onChange={e => handleEduChange("degree", e.target.value)}
                placeholder="Degree"
              />
              <Form.Control
                value={profile.education.cgpa}
                onChange={e => handleEduChange("cgpa", e.target.value)}
                placeholder="CGPA"
              />
            </>
          ) : (
            <p>
              {profile.education.institute || "—"} <br />
              {profile.education.degree}{" "}
              {profile.education.cgpa && `(${profile.education.cgpa})`}
            </p>
          )}
        </Section>

        {/* PROJECTS */}
        <Section title="Projects">
          {isEditing ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={profile.projects}
              onChange={e => handleChange("projects", e.target.value)}
            />
          ) : (
            <p>{profile.projects || "—"}</p>
          )}
        </Section>

        {/* LANGUAGES */}
        <Section title="Languages">
          {isEditing ? (
            <Form.Control
              value={profile.languages}
              onChange={e => handleChange("languages", e.target.value)}
            />
          ) : (
            <p>{profile.languages || "—"}</p>
          )}
        </Section>

        {/* RESUME */}
        <Section title="Resume">
          {!viewOnly && isEditing && (
            <>
              {/* File input */}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile(prev => {
                      const updated = {
                        ...prev,
                        resumeFile: {
                          name: file.name,
                          dataUrl: reader.result, // store base64 so we can open/download
                        },
                      };
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                      return updated;
                    });
                    alert("Resume uploaded and saved successfully!");
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <Button
                size="sm"
                className="mt-2"
                variant="info"
                onClick={handleResumeUpload}
              >
                Upload
              </Button>
            </>
          )}

          {profile.resumeFile?.name && (
            <div className="mt-2">
              <a
                href={profile.resumeFile.dataUrl}
                download={profile.resumeFile.name}
                style={{ color: "#9bd3dd" }}
              >
                {profile.resumeFile.name}
              </a>
            </div>
          )}
        </Section>

        {!viewOnly && isEditing && (
          <div className="text-center mt-4">
            <Button variant="info" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h5 style={{ borderBottom: "1px solid #9bd3dd", paddingBottom: "6px" }}>
        {title}
      </h5>
      <div className="mt-3">{children}</div>
    </div>
  );
}
