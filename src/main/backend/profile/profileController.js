import Profile from "../models/profileModel.js";
import { gridfsBucket } from "../gridfs/gridfs.js";
import mongoose from "mongoose";

/* -------------------- Upload Resume -------------------- */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) profile = await Profile.create({ userId: req.user.id });

    profile.resume = {
      filename: req.file.filename,
      path: req.file.path, // save path instead of GridFS id
      mimetype: req.file.mimetype,
    };

    await profile.save();
    res.json({ success: true, resumeFile: profile.resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


/* -------------------- Get Profile -------------------- */
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.params.userId });

    if (!profile) {
      // Auto-create empty profile
      profile = await Profile.create({ userId: req.params.userId });
    }

    res.json({
      name: profile.name || "",
      email: profile.email || "",
      role: profile.role || "",
      about: profile.about || "",
      age: profile.age || "",
      location: profile.location || "",
      contact: profile.contact || "",
      skills: profile.skills || "",
      experience: profile.experience || "",
      education: profile.education || { institute: "", degree: "", cgpa: "" },
      projects: profile.projects || "",
      languages: profile.languages || "",
      photo: profile.photo || "",
      resumeFile: profile.resumeFile || null,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


/* -------------------- Stream File (VIEW ONLY) -------------------- */
export const streamFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const file = await gridfsBucket.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", file[0].metadata.type || "application/pdf");
    res.set("Content-Disposition", "inline; filename=\"" + file[0].filename + "\"");

    gridfsBucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error("File stream error:", err);
    res.status(404).json({ message: "File not found" });
  }
};
