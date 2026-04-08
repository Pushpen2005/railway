import { Router } from "express";
import {createAlert, getAlert,getActiveAlerts, updateAlertAction,getAlertHistory} from "../Controllers/alert.controller.js";
import { checkApiKey } from "../middleware/check.middleware.js";
const alertRouter = Router();

alertRouter.post("/api/alerts",checkApiKey, createAlert);
alertRouter.get("/api/alerts", checkApiKey, getAlert);
alertRouter.get("/api/alerts/active", checkApiKey, getActiveAlerts);
alertRouter.post("/api/alerts/:id/action", checkApiKey, updateAlertAction);
alertRouter.get("/api/alerts/history", checkApiKey, getAlertHistory);
export default alertRouter;