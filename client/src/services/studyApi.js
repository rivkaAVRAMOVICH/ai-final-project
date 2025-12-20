import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/study", // לא 'server', אלא localhost
});

export const analyzeText = async (text) => {
  try {
    const res = await api.post("/analyze", { text });
    console.log("API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error calling analyzeText:", err);
  }
};

export const submitAnswers = async (payload) => {
  const res = await api.post("/submit", payload);
  return res.data;
};
