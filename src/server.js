const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { getDataFromJsonFiles } = require("./getDataFromJsonFiles"); // Import your existing function

// Define allowed origins
const allowedOrigins = ["http://localhost:3000/", "https://web-3-projects.vercel.app/"];

// Configure CORS options globally
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Apply CORS middleware with global options
app.use(cors(corsOptions));

const app = express();
const PORT = process.env.PORT || 3001;

// Assuming the database directory is located in the same directory as this script
const directoryPath = "database";

// Import the function to read data from JSON files
async function getData() {
  try {
    return await getDataFromJsonFiles(directoryPath);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

app.get("/", async (req, res) => {
  try {
    const database = await getData();
    console.log("database", database);

    // get the search params as a URLSearchParams object
    const searchParams = new URL(req.url, `http://${req.headers.host}`)
      .searchParams;

    // get the values of the name parameter
    const name = searchParams.get("name");

    if (name) {
      const validNames = database.map((d) => d.id);
      if (!validNames.includes(name)) {
        return res.json({ error: "Invalid name parameter" });
      }
      // Filter data based on query parameters
      const filteredData = database.filter((item) => item.id === name);
      return res.json(filteredData);
    }

    // If no query parameters are provided, return all data
    return res.json(database);
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
