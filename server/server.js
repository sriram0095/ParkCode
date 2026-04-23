import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ParkingSpot from "./models/ParkingSpot.js"; // 👈 import model

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://sriram:sriram441@cluster1.mm2tz1h.mongodb.net/parkcode?retryWrites=true&w=majority&appName=Cluster1")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home route (optional)
app.get("/", (req, res) => {
  res.send("🚗 ParkCode API Running");
});
// 👇 EXISTING route
app.get("/api/parking", async (req, res) => {
  try {
    const spots = await ParkingSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👇 ADD YOUR POST API HERE (IMPORTANT)
app.post("/api/parking", async (req, res) => {
  try {
    const spot = new ParkingSpot(req.body);
    await spot.save();
    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👇 server should be last
app.listen(5000, () => {
  console.log("Server running on port 5000");
});