import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./connectDB.js";
import authRoutes from "./authRoutes.js";
import multer from "multer";
import fs from "fs";
import Applications from "./Applications.js";
import jwt from "jsonwebtoken";
import RecruiterRoutes from "./RecruiterRoutes.js";
import ApplicantRoutes from "./ApplicantRoutes.js";
import { connectGridFS } from "./gridfs/gridfs.js";
import profileRoutes from "./profile/profileRoutes.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config(); 
}
// Storage for resume files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
const app = express();
const PORT = process.env.PORT || 5000;

// Allow ANY local frontend (3000, 3001, 5173, 3020, etc.)
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = [
      "http://localhost:3000",
      "https://job-listing-portal-web-git-main-larvias-projects-c2bc6b5d.vercel.app"
    ];
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));
app.options("/", cors());

app.use(express.json());

app.use("/api/recruiter", RecruiterRoutes);
app.use("/api/applicant", ApplicantRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/auth', authRoutes);

// Connect DB
connectDB();
connectGridFS();

app.post("/apply-job", upload.single("resume"), async (req, res) => {
  try {
    const { jobTitle, coverLetter, recruiterId } = req.body;

    // Get applicant from token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const application = await Applications.create({
      jobTitle,
      applicantId: decoded.id,
      recruiterId,
      applicantName: decoded.email, // or fetch name if needed
      resume: req.file?.filename,
      coverLetter
    });

    res.json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


app.get('/', (req, res) => {
  res.send("Job Portal API running ✔");
});
app.post("/save-profile", (req, res) => {
  const data = JSON.stringify(req.body, null, 2);
  fs.writeFileSync("profile.json", data);
  res.json({ success: true });
});
app.post("/upload-resume", upload.single("resume"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});
app.get("/get-profile", (req, res) => {
  if (!fs.existsSync("profile.json")) {
    return res.json(null);
  }
  const data = JSON.parse(fs.readFileSync("profile.json"));
  res.json(data);
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
