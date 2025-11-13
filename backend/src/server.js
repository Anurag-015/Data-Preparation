import express from "express";
import cors from "cors";
import { connectDb } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://data-preparation-mu.vercel.app/email" }));

let collections;

(async () => {
  try {
    collections = await connectDb();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Atlas connection failed:", err);
    process.exit(1);
  }
})();

app.post("/api/get_next_session", async (req, res) => {
  if (!collections) return res.status(503).json({ error: "initializing" });
  const email = (req.body?.email || "").trim();
  if (!email) return res.status(400).json({ error: "email required" });
  try {
    const { records } = collections;
    const last = await records.find({ email }).sort({ session_number: -1 }).limit(1).toArray();
    const m = last[0];
    const s = m ? m.session_number : 0;
    const next_session = Number(s) + 1;
    let user_id = m && m.user_id ? Number(m.user_id) : null;
    if (!user_id) {
      const top = await records.find({}).sort({ user_id: -1 }).limit(1).toArray();
      const base = top[0] && top[0].user_id ? Number(top[0].user_id) : 541;
      user_id = base + 1;
    }
    await records.updateMany({ email, user_id: { $exists: false } }, { $set: { user_id } });
    res.json({ user_id, session_number: next_session });
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/submit", async (req, res) => {
  if (!collections) return res.status(503).json({ error: "initializing" });
  const email = (req.body?.email || "").trim();
  if (!email) return res.status(400).json({ error: "email required" });
  try {
    const { records } = collections;
    const last = await records.find({ email }).sort({ session_number: -1 }).limit(1).toArray();
    const m = last[0];
    const s = m ? m.session_number : 0;
    const next_session = Number(s) + 1;
    let user_id = m && m.user_id ? Number(m.user_id) : null;
    if (!user_id) {
      const top = await records.find({}).sort({ user_id: -1 }).limit(1).toArray();
      const base = top[0] && top[0].user_id ? Number(top[0].user_id) : 541;
      user_id = base + 1;
    }
    await records.updateMany({ email, user_id: { $exists: false } }, { $set: { user_id } });
    const payload = {
      email,
      user_id,
      session_number: next_session,
      hold_mean: req.body.hold_mean,
      flight_mean: req.body.flight_mean,
      typing_speed: req.body.typing_speed,
      error_rate: req.body.error_rate,
      pause_count: req.body.pause_count,
      drift_over_time: req.body.drift_over_time,
      rhythm_entropy: req.body.rhythm_entropy,
      fatigue_level: req.body.fatigue_level
    };
    await records.insertOne(payload);
    res.json({ status: "ok", user_id, session_number: next_session });
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

app.get("/", (req, res) => {
  res.send("ok");
});

const port = Number(process.env.PORT || 5000);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});