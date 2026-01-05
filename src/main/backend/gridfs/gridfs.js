import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs;
let gridfsBucket;

export const connectGridFS = () => {
  const conn = mongoose.connection;

  conn.once("open", () => {
    try {
      // Initialize GridFS bucket
      gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });

      // Initialize GridFS stream (optional, for reading)
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("uploads");

      console.log("✅ GridFS initialized");
    } catch (err) {
      console.error("❌ Failed to initialize GridFS:", err);
    }
  });

  // Extra safety: handle connection errors
  conn.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
};

export { gfs, gridfsBucket };
