import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3005",
  headers: {
    "x-api-key": import.meta.env.VITE_DEVICE_API_KEY,
  },
});

API.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_DEVICE_API_KEY;
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

export function normalizeAlert(alert) {
  return {
    id: alert._id || alert.id,
    animal: alert.animal || "Unknown",
    detected: alert.status === "active",
    status: alert.status || "active",
    timestamp: alert.time || alert.timestamp,
    image: alert.imageUrl || "https://via.placeholder.com/240x160?text=No+Image",
    confidence: Number(alert.confidence) || 0,
    sensor: alert.sensorId || "N/A",
    location: alert.location || "Unknown",
    action: alert.actionTaken || (alert.status === "active" ? "Pending Resolution" : "Resolved"),
  };
}

export const createAlert = (alert) => API.post("/api/alerts", alert);
export const getAlerts = () => API.get("/api/alerts");
export const getActiveAlerts = () => API.get("/api/alerts/active");
export const getAlertHistory = () => API.get("/api/alerts/history");
export const updateAlertAction = (id, actionTaken) => API.post(`/api/alerts/${id}/action`, { actionTaken });