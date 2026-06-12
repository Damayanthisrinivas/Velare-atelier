import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { PRODUCTS } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parse with size limits for base64 uploads
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: any = null;

function getGeminiClient() {
  if (!aiClient) {
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined or is placeholder. AI Stylist features will run in high-quality local mockup simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// AI Stylist Chat Route - returns structured style advice and matched products
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response generator if API key is not yet set
      const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "Hello! I am Elena Geller, your VÉLARE Personal Stylist. Please configure your GEMINI_API_KEY in the Secrets panel to unlock live AI styling!";
      let matchedIds: string[] = ["prod-1", "prod-2"];

      if (lastMessage.includes("suit") || lastMessage.includes("jacket") || lastMessage.includes("men")) {
        reply = "I absolutely recommend focusing on tailored tailoring this season. The structural elegance of our luxury virgin cashmere coats and fine leather biker jacket are perfect counterbalances.";
        matchedIds = ["prod-1", "prod-3"];
      } else if (lastMessage.includes("dress") || lastMessage.includes("women") || lastMessage.includes("pleat")) {
        reply = "For an effortless evening look, fluid silk-satin and crepe pleating are unmatched. Here are some sophisticated options from our women's collection.";
        matchedIds = ["prod-2", "prod-9", "prod-14"];
      } else if (lastMessage.includes("watch") || lastMessage.includes("accessories") || lastMessage.includes("sun")) {
        reply = "A premium timepiece or Japanese high-index optics from our accessories collection adds that final touch of quiet luxury to an understated black dress or crisp cashmere overcoat.";
        matchedIds = ["prod-4", "prod-5", "prod-7"];
      } else if (lastMessage.includes("shoe") || lastMessage.includes("sneaker") || lastMessage.includes("boot")) {
        reply = "Our hand-burnished leather Chelsea boots and minimalist running sneakers combine ecological high-performance fibers with heritage Spanish shoemaking foundations.";
        matchedIds = ["prod-6", "prod-8"];
      }

      const productsToSend = PRODUCTS.filter(p => matchedIds.includes(p.id));
      return res.json({
        text: reply,
        products: productsToSend
      });
    }

    // Prepare system instructions and formatted product catalog context
    const simplifiedCatalog = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      gender: p.gender,
      material: p.material,
      colors: p.colors.map(c => c.name),
      subcategory: p.subcategory
    }));

    const systemInstruction = 
      "You are Elena Geller, the lead AI Elite Stylist and Visual Director for VÉLARE Atelier, a leading luxury global fashion brand.\n" +
      "VÉLARE specializes in high-end, contemporary luxury pieces: 90% cashmere overcoats, organic mulberry silk dresses, French leather jackets, titanium gold sunglasses, and Swiss mechanical watches.\n" +
      "Your objective is to advise clients on modern fashion trends, colors, styling matching rules, premium lookbooks, and care.\n" +
      "Helpful Rules:\n" +
      "1. Be extraordinarily warm, sophisticated, high-end, and objective (just like a stylist speaking directly to a client at a high-end fitting salon).\n" +
      "2. When suggesting styled sets or answering outfit queries, you MUST recommend 1-3 specific products from our available catalog, referring to them by their exact ID.\n" +
      "3. You MUST respond in a structured JSON schema structure containing two main keys: 'text' (your personal styling explanation string, including style advice) and 'recommendedProductIds' (an array of exact product string IDs, e.g., ['prod-1', 'prod-2']). Do not include markdown code block formatting inside the JSON response itself, simply return pure JSON.\n" +
      `Here is the official VÉLARE product catalog:\n${JSON.stringify(simplifiedCatalog)}\n\n` +
      "Now, analyze the conversation history and output the JSON response.";

    // Format chat history
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Elegant personal response of styling suggestions, fashion guidelines, or fit tips."
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exact product IDs recommended from the catalog."
            }
          },
          required: ["text", "recommendedProductIds"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    const matchedProducts = PRODUCTS.filter(p => parsed.recommendedProductIds?.includes(p.id));

    return res.json({
      text: parsed.text,
      products: matchedProducts
    });

  } catch (err: any) {
    console.error("Gemini API Error in chat:", err);
    return res.status(500).json({ error: "Expert styling service was temporarily interrupted. Please double check your settings." });
  }
});

// AI Visual Search / Stylist Upload Route - matches look with our catalog
app.post("/api/visual-search", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Image data and MIME type are required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Simulate visual match based on image file metadata or a timer fallback
      // Since it's a mock, let's randomly grab 3 beautiful pieces and say we matched the silhouette!
      const mockMatches = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];
      return res.json({
        analysis: "Your uploaded image exhibits a sophisticated, modern minimalist silhouette featuring premium textures and light-neutral/earth tones. VÉLARE Atelier suggests pairing these structured linen and cashmere layers together for a timeless resort look.",
        products: mockMatches
      });
    }

    const simplifiedCatalog = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      gender: p.gender,
      subcategory: p.subcategory
    }));

    const promptText = 
      "Analyze this look or fashion image carefully.\n" +
      "1. Identify the core aesthetic vibe, lines, colors, and garments detected in the image.\n" +
      "2. Perform a smart match with VÉLARE Atelier's product catalog.\n" +
      "3. Recommend 1-3 garments that perfectly align with or complete this uploaded silhouette.\n" +
      "4. You MUST respond in a structured JSON format containing two keys: 'analysis' (a short, beautifully written 2-3 sentence visual breakdown of the uploaded look and how our suggested items elevate it) and 'matchedProductIds' (an array of exact string IDs from our catalog, e.g., ['prod-2', 'prod-7']).\n" +
      `Here is the VÉLARE catalog for matchmaking:\n${JSON.stringify(simplifiedCatalog)}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64
      }
    };

    const textPart = { text: promptText };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A luxury breakdown of colors, tones, and layering suggested to match the upload."
            },
            matchedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of matched product IDs from VÉLARE."
            }
          },
          required: ["analysis", "matchedProductIds"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const matchedProducts = PRODUCTS.filter(p => parsed.matchedProductIds?.includes(p.id));

    return res.json({
      analysis: parsed.analysis || "We analyzed the aesthetic elements and selected these luxury offerings to complement your vision.",
      products: matchedProducts.length > 0 ? matchedProducts : PRODUCTS.slice(0, 3)
    });

  } catch (err) {
    console.error("Gemini Visual Search Error:", err);
    return res.status(500).json({ error: "Visual scanning service was temporarily interrupted. Please ensure image dimensions are reasonable." });
  }
});

// Standard API health check
app.get("/api/health", (req, res) => {
  res.json({ app: "VÉLARE Atelier full-stack server", status: "active" });
});

// -------------------------------------------------------------
// Vite and Static Assets Configuration
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("🚀 Vite middleware mounted in standard Development Mode");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Serving built files from /dist in Production Mode");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ VÉLARE Atelier full-stack infrastructure live on http://localhost:${PORT}`);
  });
}

bootstrap();
