const express = require("express");
const app = express();
// const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.js");
const userSchema = require("./models/User.js");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Disaster = require("./models/Disaster.js");
const Resource = require("./models/Resource");
const analyticsController = require("./controllers/analytics.js");
const Volunteer = require("./models/Volunteer");
dotenv.config();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
  })
);

connectDB();

// Serve frontend (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

//  Creating end point for registering the user
app.post("/register", async (req, res) => {
  console.log("Rohit");
  const { name, email, password, role } = req.body;

  // Check for missing fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required: name, email, password, and role",
    });
  }
  let check = await userSchema.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "Email Already Exist" });
  }

  const user = new userSchema({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Login user route
app.post("/login", async (req, res) => {
  let user = await userSchema.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token, user });
    } else {
      res.json({ success: false, errors: "wrong password" });
    }
  } else {
    res.json({ success: false, errors: "Email does not Exist" });
  }
});

app.get("/disastersData", async (req, res) => {
  try {
    const disasters = await Disaster.find();
    res.json(disasters);
  } catch (error) {
    res.status(500).json({ error: "Error fetching disasters" });
  }
});
// Add disaster endpoint
app.post("/addDisaster", async (req, res) => {
  const { type, location, severity, magnitude, waterLevel, timestamp } =
    req.body;

  // Validate required fields
  if (
    !type ||
    !location ||
    !location.coordinates ||
    location.coordinates.length !== 2
  ) {
    return res.status(400).json({
      message: "Type and valid location with coordinates are required.",
    });
  }

  // Create and save disaster
  const disaster = new Disaster({
    type,
    location,
    severity,
    magnitude,
    waterLevel,
    timestamp,
  });

  try {
    await disaster.save();
    res.status(201).json({
      success: true,
      message: "Disaster added successfully",
      disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while adding the disaster",
    });
  }
});

app.get("/analytics", analyticsController.getAnalyticsData);

// Route to get all resources
app.get("/resources", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Error fetching resources" });
  }
});

// Route to add a new resource
app.post("/addResources", async (req, res) => {
  const { name, type, lat, lng, available, capacity } = req.body;

  if (!name || !type || !lat || !lng || !available || !capacity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const resource = new Resource({
      name,
      type,
      lat,
      lng,
      available,
      capacity,
    });
    await resource.save();
    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while adding the resource",
    });
  }
});

// Route to update resource availability
app.put("/resources/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { count } = req.body;

  try {
    const resource = await Resource.findById(id);
    if (!resource || resource.available < count) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient resources" });
    }
    resource.available -= count;
    await resource.save();
    res.json({
      success: true,
      message: "Resource availability updated",
      resource,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error updating resource availability" });
  }
});


// POST route to add a new volunteer
app.post("/registerAsVolunteer", async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required" });
    }

    // Create a new volunteer
    const newVolunteer = new Volunteer({ name, email, phone, skills });
    await newVolunteer.save();

    res.status(201).json({ message: "Thank you for joining us!", volunteer: newVolunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});
// Volunteer Login Route
app.post("/loginAsVolunteer", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if volunteer exists
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    // Send success response
    res.status(200).json({ message: "Login successful", volunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});

// GET route to fetch all volunteers (optional, for admin purposes)
app.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
