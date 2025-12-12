// server.mjs
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Multer：用記憶體儲存上傳檔案（不直接存硬碟）
const upload = multer({ storage: multer.memoryStorage() });

// 從環境變數拿 API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("請先在環境變數設定 GEMINI_API_KEY");
}

// 初始化 Google Gen AI SDK（使用 Gemini Developer API）
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  // vertexai: false // 預設就是 false，可不寫；代表走 Developer API 而非 Vertex AI :contentReference[oaicite:3]{index=3}
});

// 簡單 health check：GET / 就會回應
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Gemini audio backend is running." });
});

/**
 * POST /api/analyze-audio
 * - 接收一個 form-data 欄位名為 "audio" 的檔案
 * - 將 audio 轉成 base64，丟給 Gemini 2.5 Flash-Lite 做文字輸出
 */
app.post(
  "/api/analyze-audio",
  upload.single("audio"), // MiddleWare，接收一個 Body 中欄位名為 Audio 的檔案，自動轉化成 req.file
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "請用 form-data 上傳欄位名為 audio 的音檔" });
      }

      // 取得上傳的檔案
      const audioBuffer = req.file.buffer;
      const base64Audio = audioBuffer.toString("base64");

      // 假設前端用 MediaRecorder 預設會是 audio/webm，
      // 或是你可以用 req.file.mimetype 直接帶入
      const mimeType = req.file.mimetype || "audio/webm";

      // 準備給 Gemini 的 contents
      // 這個寫法參考官方「Audio understanding」文件中的 JS 範例，
      // 使用 inlineData 傳入 base64 audio :contentReference[oaicite:4]{index=4}
      const contents = [
        {
          text: "請摘要音檔中的逐字稿，並以句子為核心，請使用一下格式輸出：" +
                "\n [00:00 - 00:02] 「使用者說的第一句話」" +
                "\n [00:03 - 00:06] 「使用者說第二句話」"
        },
        {
          inlineData: {
            mimeType, // 例如 "audio/webm" 或 "audio/mp3"
            data: base64Audio,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite", // 這裡指定 Flash-Lite 模型 :contentReference[oaicite:5]{index=5}
        contents,
      });

      // Gen AI SDK 會提供 response.text 把所有文字組合好
      const text = response.text || "(沒有文字回應)";

      res.json({
        success: true,
        model: "gemini-2.5-flash-lite",
        result: text,
      });
    } catch (err) {
      console.error("Gemini 呼叫失敗：", err);
      res.status(500).json({
        success: false,
        error: "呼叫 Gemini API 失敗",
        detail: err?.message ?? String(err),
      });
    }
  }
);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
