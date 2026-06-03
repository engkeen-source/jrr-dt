import "dotenv/config";
import express from "express";
import cors from "cors";
import assessmentRouter from "./routes/assessment";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiKey: !!process.env.GEMINI_API_KEY,
    resendKey: !!process.env.RESEND_API_KEY,
  });
});

app.use("/api/assessment", assessmentRouter);

app.listen(PORT, () => {
  console.log(`\n🚀 SME AI Assessment backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   POST /api/assessment — generate report`);
  console.log(`   GET  /api/assessment/:id/download — download PDF\n`);
});
