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

  try {
    const articleMeta = await db.collection("articleaction").findOne({ name });
    const articleContent = await db.collection("article").findOne({ name });

    if (articleMeta && articleContent) {
      const upvoteIds = articleMeta.upvoteIds || [];
      articleMeta.canUpvote = uid && !upvoteIds.includes(uid);

      const fullArticle = {
        ...articleMeta,
        ...articleContent,
      };
      res.json(fullArticle);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  try {
    // Retrieve article meta data
    const articleMeta = await db.collection("articleaction").findOne({ name });
    //console.log("articleMeta:", articleMeta);

    if (articleMeta) {
      const upvoteIds = articleMeta.upvoteIds || [];
      const canUpvote = uid && !upvoteIds.includes(uid);

      // Update upvotes if allowed
      if (canUpvote) {
        await db.collection("articleaction").updateOne(
          { name },
          {
            $inc: { upvotes: 1 },
            $push: { upvoteIds: uid },
          }
        );
      }

      // Retrieve updated article meta data
      const updatedArticleMeta = await db.collection("articleaction").findOne({ name });
      //console.log("updatedArticleMeta:", updatedArticleMeta);

      // Retrieve article content
      const articleContent = await db.collection("article").findOne({ name });
      //console.log("articleContent:", articleContent);

      if (articleContent) {
        const fullArticle = {
          ...updatedArticleMeta,
          ...articleContent,
        };

        fullArticle.canUpvote = uid && !updatedArticleMeta.upvoteIds.includes(uid);
        //console.log("fullArticle:", fullArticle);

        res.json(fullArticle);
      } else {
        res.sendStatus(404).send("Article content not found");
      }
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to article
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;
  const { uid } = req.user;

  try {
    await db.collection("articleaction").updateOne(
      { name },
      {
        $push: { comments: { postedBy: email, text } },
      }
    );

    const updatedArticleMeta = await db.collection("articleaction").findOne({ name });
    //console.log("updatedArticleMeta:", updatedArticleMeta);

    const articleContent = await db.collection("article").findOne({ name });
    //console.log("articleContent:", articleContent);

    if (articleContent) {
      const fullArticle = {
        ...updatedArticleMeta,
        ...articleContent,
      };

      fullArticle.canUpvote = uid && !updatedArticleMeta.upvoteIds.includes(uid);
      //console.log("fullArticle:", fullArticle);
      
      res.json(fullArticle);
  } else {
    res.status(404).send("Article content not found");
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Create or update about page content
app.post("/api/about", async (req, res) => {
  const { header, paragraphs} = req.body;

  try {
    let aboutpageContent = await db.collection("aboutpage").findOne({});
    if(aboutpageContent) {
      // Update the existing about page content
      await db.collection("aboutpage").updateOne(
        {},
        { $set: { header, paragraphs } }
      );
    } else {
      // Insert new about page content
      aboutpageContent = { header, paragraphs };
      await db.collection("aboutpage").insertOne(aboutpageContent);
    }
    res.json(aboutpageContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch articles
// app.get("/api/articles", async (req, res) => {
//   try {
//     const articles = await db.collection("article").find({}).toArray();
//     if (articles.length > 0) {
//       res.json(articles);
//     } else {
//       res.status(404).json({ message: "No articles found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Fetch articles and article action data
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await db.collection("article").aggregate([
      {
        $lookup: {
          from: "articleaction",
          localField: "name",
          foreignField: "name",
          as: "actions",
        },
      },
      {
        $addFields: {
          upvotes: { $arrayElemAt: ["$actions.upvotes", 0] },
          comments: { $arrayElemAt: ["$actions.comments", 0] },
        },
      },
      {
        $project: {
          actions: 0,
        },
      },
    ]).toArray();

    if (articles.length > 0) {
      res.json(articles);
    } else {
      res.status(404).json({ message: "No articles found" });
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
