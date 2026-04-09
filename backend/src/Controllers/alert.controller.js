import alertModel from "../models/alert.model.js";

//create alert
export async function createAlert(req, res) {
    try{
        const { animal, confidence, sensorId, location, imageUrl, status, actionTaken, timestamp } = req.body;
        if (!animal || !confidence || !sensorId || !location || !imageUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const alert = new alertModel({
            animal,
            confidence,
            sensorId,
            location,
            imageUrl,
            status:'active',
            actionTaken:null,
            time:Date.now()
        });
        await alert.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('alert:created', alert);
        }

        res.status(201).json({ message: "Alert created successfully", alert });
    } catch (error) {
        res.status(400).json({ message: "Invalid request body" });
        console.error("Error creating alert:", error);
    }
}
//get all alerts
export async function getAlert(req, res) {
    try {
        const alerts = await alertModel.find().sort({ time: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("Error fetching alerts:", error);
    }
}
//get active alerts
export async function getActiveAlerts(req, res) {
    try {
        const activeAlerts = await alertModel.find({ status: 'active' }).sort({ time: -1 });
        res.status(200).json(activeAlerts);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error("Error fetching active alerts:", error);
    }
}
//update alert action
export async function updateAlertAction(req, res) {
    try {
        const alertId = req.params.id;
        const { actionTaken } = req.body;
        if (!actionTaken) {
            return res.status(400).json({ message: "Missing actionTaken field" });
        }
        const alert = await alertModel.findById(alertId);
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        alert.actionTaken = actionTaken;
        alert.status = 'resolved';
        await alert.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('alert:resolved', alert);
        }

        res.status(200).json({ message: "Alert updated successfully", alert });
    } catch (error) {
        res.status(400).json({ message: "Invalid request body" });
        console.error("Error updating alert:", error);
    }
}   
//history
export async function getAlertHistory(req, res) {
try{
    const alertHistory = await alertModel.find({
        status: 'resolved'
    }).sort({ time: -1 });
    res.status(200).json(alertHistory);
}
catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error fetching alert history:", error);
}   
}