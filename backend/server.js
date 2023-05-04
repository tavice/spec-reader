const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;
require("dotenv").config();
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;
const pdf = require("pdf-parse");
const fs = require("fs");
const multer = require("multer");

// Initialize OpenAI
const ORGANIZATION = process.env.ORGANIZATION;
const API_KEY = process.env.API_KEY;
const configuration = new Configuration({
  organization: ORGANIZATION,
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize Express
app.use(bodyParser.json());
app.use(cors());

// Define routes
app.use(function (req, res, next) {
  console.log("Setting Access-Control-Allow-Origin header");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

// Set up multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});



// Route for analyzing PDF
app.post("/pdf", async (req, res) => {
  
   
  

  const { text } = req.body;

  // Analyze text with OpenAI
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt:
      "analyze the text from the PDF: " +
      text +
      " this will be used to analyze the text and give a response back to the user in a chatbot in the frontend",
    max_tokens: 200,
    temperature: 0,
    top_p: 1.0,
    frequency_penalty: 0.8,
    presence_penalty: 0.0,
  });

  // Send response back to frontend
  console.log(response.data);
  if (response.data) {
    if (response.data.choices) {
      res.json({
        message: response.data.choices[0].text,
      });
    }
  }

  
});

// Route for chatbot
app.post("/", async (req, res) => {
  const { text } = req.body;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "The following is a conversation with a chatbot. The bot is helpful, creative, clever, and very friendly. User: " +
      text +
      "Bot: The text is: " +
      text +
      " this will be used to analyze the text and give a response back to the user in a chatbot in the frontend",
    max_tokens: 200,
    temperature: 0,
    top_p: 1.0,
    frequency_penalty: 0.8,
    presence_penalty: 0.0,
  });

  // Send response back to frontend
  console.log(response.data);
  if (response.data) {
    if (response.data.choices) {
      res.json({
        message: response.data.choices[0].text,
      });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log("app listening on port", port);
});
