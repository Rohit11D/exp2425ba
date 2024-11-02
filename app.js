const express = require("express");
const app = express();
// const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.js");
const userSchema = require("./models/User.js");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
dotenv.config();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
app.use(
  cors({
    origin: "https://r54jf6-3000.csb.app/", // Adjust this to match your frontend URL
    credentials: true,
  })
);

connectDB();

// Serve frontend (for production)
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'frontend/build')));

//     app.get('*', (req, res) =>
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//     );
// } else {
//     app.get('/', (req, res) => {
//         res.send('API is running...');
//     });
// }

//  Creating end point for registering the user
app.post("/register", async (req, res) => {
  console.log("Rohit");
  const { name, email, password, role } = req.body;

  // Check for missing fields
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({
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

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
