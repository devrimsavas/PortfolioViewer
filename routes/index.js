var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");

var connectDB = require("../config/connectdatabase");
const { ObjectId } = require("mongodb");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/projects", function (req, res, next) {
  res.render("projects", { title: "My Projects" });
});

router.get("/games", (req, res) => {
  res.render("games", { title: "games" });
});

router.get("/playgame", (req, res) => {
  res.render("playgame", { title: "games" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "contact" });
});

// POST route to handle form submission
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Check if all fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Prepare message data
  const newMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;

  // Define file path to save the message
  const filePath = path.join(__dirname, "messages.txt");

  try {
    // Append the message to the file and wait for it to complete
    await new Promise((resolve, reject) => {
      fs.appendFile(filePath, newMessage, (err) => {
        if (err) {
          console.error("Error saving the message:", err);
          return reject(err);
        }
        resolve();
      });
    });

    // Connect to the database
    const db = await connectDB();
    // Insert to collection
    await db.collection("guestmessages").insertOne({ newMessage });

    // If everything succeeded, send the response
    res.status(200).json({
      message: "New message is sent and logged successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

//get user info

router.post("/user-info", async (req, res) => {
  const userInfo = req.body;
  const userId = req.cookies.userId || "unknown";

  //collect IP, agent, language and referer from backend
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip === "::1") {
    ip = "127.0.0.1"; // Handle local IPv6 loopback
  }
  const userAgent = req.headers["user-agent"];
  const language = req.headers["accept-language"];
  const referer = req.headers["referer"] || "Direct";

  const userBackEndInfo = {
    userId: userId,
    userIp: ip,
    userAgent: userAgent,
    language: language,
    referer: referer,
  };

  // Combine frontend and backend info into one object
  const combinedUserInfo = { ...userInfo, ...userBackEndInfo };

  // Log the combined user information
  console.log("Combined user info:", combinedUserInfo);

  // Example: Save this data to a database (you can add your database logic here)
  // db.collection('user_visits').insertOne(combinedUserInfo);

  try {
    const db = await connectDB();

    //insert
    await db.collection("portfolioguests").insertOne({ combinedUserInfo });
    res.status(200).json({
      message: "user info received and logged",
      data: combinedUserInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
});

//resume

// Route to render the HTML page and pass the PDF path
router.get("/resume", (req, res) => {
  const pdfPath = "/data/devrimcv.pdf"; // Path within the public directory
  res.render("resume", { pdfPath: pdfPath, title: "My Resume" }); // Pass PDF path to EJS template
});

module.exports = router;
