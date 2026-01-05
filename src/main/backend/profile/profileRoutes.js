import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume, getProfile, streamFile } from "./profileController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/resume", protect, upload.single("resume"), uploadResume);
router.get("/:userId", protect, getProfile);
router.get("/file/:fileId", protect, streamFile); // if streaming needed

export default router;
