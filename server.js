import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();

app.use(helmet());

const corsOptions = {
  origin: "http://example.com",
  methods: "GET",
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter);

const API_KEY = "12345-ABCDE";

const checkApiKey = (req, res, next) => {
  console.log("Received headers:", req.headers);
  const apiKey = req.headers["x-api-key"];
  console.log("Received API Key:", apiKey);
  if (!apiKey || apiKey !== API_KEY) {
    return res
      .status(403)
      .json({ message: "Accès refusé : clé API invalide ou manquante." });
  }
  next();
};

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello world" });
});

app.get("/api/private-data", checkApiKey, (req, res) => {
  res.json({ message: "Voici les données privées." });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
