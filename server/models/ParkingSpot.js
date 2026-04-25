import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
  location: {
    lat: Number,
    lng: Number,
  },
  plusCode: String,
  status: {
    type: String,
    enum: ["available", "full"],
    default: "available",
  },
  vehicleType: {
    type: String,
    enum: ["2w", "4w"],
  }
}, {
  timestamps: true   
});

export default mongoose.model("ParkingSpot", parkingSchema);