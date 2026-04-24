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
//test chey mama
app.get("/", (req, res) => {
  res.send("🚗 ParkCode API Running");
});
// 👇 EXISTING route
app.get("/api/parking", async (req, res) => {
  try {
    const { lat, lng } = req.query;//user tells his loc to fetch nearby spots 

    const expiryTime = 30 * 60 * 1000;//after 30mins the spot get expired

    let spots = await ParkingSpot.find({// fetches data from MongoDB
      updatedAt: { $gte: new Date(Date.now() - expiryTime) }
    });

    // If location is provided → filter nearby
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      spots = spots.filter(spot => {
        const distance = Math.sqrt(//here we use basic formula d=sqrt(x2-x1)^2+(y2-y1)^2
          Math.pow(spot.location.lat - userLat, 2) +
          Math.pow(spot.location.lng - userLng, 2)
        );
        // filters spots within a small radius (~1km approx)
        return distance < 0.01; // adjust this radius
      });
    }

    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/api/parking/:id", async (req, res) => {
  try {
    const updatedSpot = await ParkingSpot.findByIdAndUpdate(//used to update few details in existing data
      req.params.id,//we update the data using its id
      req.body,
      { new: true }
    );
    res.json(updatedSpot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👇 ADD YOUR POST API HERE (IMPORTANT)
app.post("/api/parking", async (req, res) => {//to create the data like loc,pluscode,status,vehicletype etc
  try {
    const spot = new ParkingSpot(req.body);//ParkingSpot is a Mongoose model (like a class for MongoDB collection)
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






/*
GET	|Read data|	View parking
POST	|Create data|	Add parking
PUT	|Update data|	Mark full*/

/*req → request (data coming in)
res → response (data you send back)
req.body
Data sent by user (POST / PUT)
req.query
?lat=17.385&lng=78.4867
 Query parameters (used for filtering)
*/