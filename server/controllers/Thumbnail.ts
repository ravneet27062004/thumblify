import { Request, Response } from "express";
import Thumbnail from "../models/thumbnail";
import { v2 as cloudinary } from "cloudinary";

// styles
const styles = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive face, dramatic lighting, high contrast",
  "Tech/Futuristic":
    "futuristic thumbnail, cyberpunk, neon colors, glitch effects, digital elements",
  Minimalist:
    "minimalist thumbnail, clean design, simple composition, elegant typography",
  Photorealistic:
    "photorealistic, cinematic lighting, ultra detailed, realistic faces",
  Illustrated:
    "illustrated thumbnail, cartoon style, colorful artwork",
};

const colorSchemeDescriptions = {
  vibrant: "bright and bold colors",
  sunset: "orange pink purple tones",
  forest: "green earthy tones",
  neon: "glowing neon colors",
  purple: "shades of purple",
  monochrome: "single color shades",
  ocean: "blue aqua tones",
  pastel: "soft pastel colors",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    // ✅ session check
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      title,
      style,
      aspect_ratio,
      color_scheme,
      prompt: user_prompt,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const thumbnail = new Thumbnail({
      userId,
      title,
      prompt_used: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      isGenerating: true,
    });

    // 🎯 CREATE PROMPT (clean + optimized)

const generatedPrompt = `
YouTube thumbnail background for: ${title}

Scene: ${user_prompt || "money success, growth, viral impact"}

Include:
- expressive human face with strong emotion
- flying money, coins, or relevant objects
- upward graph or success elements

Style: ${style ? styles[style as keyof typeof styles] : ""}
Color: ${color_scheme ? colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions] : ""}

dramatic lighting, high contrast,
cinematic, ultra detailed, 4k,

NO TEXT, NO LETTERS, NO WORDS
`;

    // ✅ clean prompt (important)
    const cleanPrompt = generatedPrompt.replace(/\n/g, " ").trim();

    console.log("Generated Prompt:", cleanPrompt);

    // 🎨 FREE IMAGE GENERATION (Pollinations)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      cleanPrompt
    )}?width=1024&height=576`;

    // ☁️ upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      resource_type: "image",
    });

    // 💾 save in DB
    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;

    await thumbnail.save();

    res.json({
      message: "Thumbnail generated successfully",
      thumbnail,
    });
  } catch (error: any) {
    console.error("Error generating thumbnail:", error);
    res.status(500).json({ error: "Failed to generate thumbnail" });
  }
};

// ❌ DELETE CONTROLLER
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Thumbnail.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete thumbnail" });
  }
};