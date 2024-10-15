import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { db, connectToDb } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const { messaging } = admin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));

// Serve the React app
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// Auth middleware
app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next();
});

// Fetch article by name
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

// Auth check middleware
app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});

// Upvote article
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
    }
    const updatedArticle = await db.collection("articles").findOne({ name });
    res.json(updatedArticle);
  } else {
    res.send("That article doesn't exist");
  }
});

// Add comment to article
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy: email, text } },
    }
  );
  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send("That article doesn't exist");
  }
});

// Fetch homepage content
app.get("/api/homepage", async (req, res) => {
  try {
    const homepageContent = await db.collection("homepage").findOne({});
    if (homepageContent) {
      res.json(homepageContent);
    } else {
      res.status(404).json({ message: "Homepage content not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update homepage content
app.post("/api/homepage", async (req, res) => {
  const { header, paragraphs, imageUrl } = req.body;

  try {
    let homepageContent = await db.collection("homepage").findOne({});
    if (homepageContent) {
      // Update the existing homepage content
      await db.collection("homepage").updateOne(
        {},
        { $set: { header, paragraphs, imageUrl } }
      );
    } else {
      // Insert new homepage content
      homepageContent = { header, paragraphs, imageUrl };
      await db.collection("homepage").insertOne(homepageContent);
    }
    res.json(homepageContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch about page content
app.get("/api/about", async (req, res) => {
  try {
    const aboutpageContent = await db.collection("aboutpage").findOne({});
    if (aboutpageContent) {
      res.json(aboutpageContent);
    } else {
      res.status(404).json({ message: "About page content not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to the database and start the server
const PORT = process.env.PORT || 8000;

connectToDb(() => {
  console.log("Successfully connected to database!");
  app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
  });
});
