var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");

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
router.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  // Check if all fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Prepare message data
  const newMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;

  // Define file path to save the message
  const filePath = path.join(__dirname, "messages.txt");

  // Append the message to the file
  fs.appendFile(filePath, newMessage, (err) => {
    if (err) {
      console.error("Error saving the message:", err);
      return res.status(500).json({ error: "Failed to save the message." });
    }
    res.status(200).json({ success: "Message received successfully!" });
  });
});

module.exports = router;
