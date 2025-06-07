import express from 'express';
import authMiddleware from "../middlewares/authMiddleware.js";
import { analyzeDataForChartType, generateTags, generateTitle, getInappropriateComments } from '../controllers/langchain-controller.js';

const langchainRouter = express.Router();

langchainRouter.post("/generate-tags", authMiddleware, async (req, res) => {
  try {
    const { articleText } = req.body;
    if (!articleText) {
      return res.status(400).json({ error: "Missing 'article text' in request body" });
    }
    const tags = await generateTags(articleText);
    res.json({ tags });
  } catch (err) {
    console.error("Error generating tags:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

langchainRouter.post("/generate-title", authMiddleware, async (req, res) => {
  try {
    const { articleText } = req.body;
    if (!articleText) {
      return res.status(400).json({ error: "Missing 'article text' in request body" });
    }
    const title = await generateTitle(articleText);
    res.json({ title });
  } catch (err) {
    console.error("Error generating tags:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

langchainRouter.post("/inappropriate-comments", authMiddleware, async (req, res) => {
  try {
    const { commentList } = req.body;
    if (!commentList) {
      return res.status(400).json({ error: "Missing 'comment List' in request body" });
    }
    const comments = await getInappropriateComments(commentList);
    res.json({ comments: comments });
  } catch (err) {
    console.error("Error identifying inappropriate comments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

langchainRouter.post("/analyze-data/chart/:chartType/interaction/:interaction", authMiddleware, async (req, res) => {
  try {
    const data = req.body.data;
    if (!data) {
      return res.status(400).json({ error: "Missing data for analysis!" });
    }

    let { interaction } = req.params;
    if(!["likes", "saves", "shares", "comments", "all"].includes(interaction)){
      return res.status(500).json({ error: "Missing interaction for analysis!"})
    }

    const { chartType } = req.params;
    if(!["scatter-plot", "bar", "radar", "pie", "tree-map"].includes(chartType)){
      return res.status(500).json({ error: "Invalid chart type provided!"})
    }

    if(interaction === "all" && chartType !== "radar"){
        return res.status(500).json({ error: "For now only the radar can analyze all interaction types!"})
    }

    if(interaction === "all")
      interaction = "likes, saves, shares, comments";
    
    const result = await analyzeDataForChartType(chartType, data, interaction);
    res.json({ analysis: result });

  } catch (err) {
    console.error("Error analysing data for " +  req.params.chartType + ": ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default langchainRouter;