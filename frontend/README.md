# RailGuard AI – Railway Track Monitoring System

RailGuard AI is a modern, minimal, desktop-first web dashboard designed for an advanced Railway Animal Detection Alert System. It provides real-time monitoring of railway tracks using PIR sensors and camera feeds, alerting human operators in the control room whenever an animal or obstruction is detected on the tracks.

## 🚀 Key Features

*   **Real-time Dashboard Overview:** A centralized view showing system health, active incidents, detection accuracy, and the latest verified alert images.
*   **Live Alerts Feed:** Continuously updating list of detection events. Features visual pulses for high-priority alerts, expandable rows for deep-dives (timestamps, action taken, location), and confidence score visualizations.
*   **Camera Feed Monitor:** A comprehensive grid view of all connected track cameras. Shows live status (Clear / Animal Detected) and supports clicking into a detailed full-screen modal.
*   **Detailed History Logs:** Searchable and sortable tabular data of all historical events. It tracks metrics like detection results, exact sensor IDs, AI confidence levels, and operator actions taken.
*   **Sensor Telemetry:** Active monitoring of all hardware components (PIR sensors and cameras), displaying live battery levels, connection statuses, and ping latencies.
*   **System Settings:** A configuration interface allowing operators to adjust confidence thresholds, data retention policies, enable auto-capture, and manage notifications.
*   **Modern UI/UX:** Built with a "Stitch-inspired" design system focusing on clean spacing, rounded corners, soft shadows, pulsating micro-animations for alerts, and a clear visual hierarchy (Red for alerts, Green for clear track).

## 🛠 Tech Stack

*   **Frontend Framework:** React (Functional Components, Hooks)
*   **Build Tool:** Vite (for fast, optimized local development and builds)
*   **Styling:** Tailwind CSS (utility-first CSS with custom animations configured in `tailwind.config.js`)
*   **Architecture:** Component-based, modular, with a clean separation of pages and reusable UI elements (StatCards, AlertCards, Modals).

## 🛤 System Flow (User Journey)

1.  **Continuous Monitoring (Idle State):**
    *   The system passively monitors PIR sensors and connected cameras deployed across the railway network.
    *   The dashboard displays a green "System Active" and "All sensors online" status.
    *   The live ticker at the bottom updates with heartbeat pings from active sensors.

2.  **Detection Event Triggered:**
    *   An animal enters the track area, triggering a PIR sensor or camera motion detection.
    *   The edge device processes the image, assigns a confidence score (e.g., 95% certainty of an animal), and sends the payload to the backend.

3.  **Operator Alerted:**
    *   The *Live Alert Card* on the main dashboard instantly populates with the red "Animal Detected" warning.
    *   A pulsating red animation highlights the alert.
    *   The notification bell at the top right signals a new unread event.

4.  **Verification & Action:**
    *   The operator clicks into the **Camera Feed** or **Live Alerts** page to see the exact snapshot.
    *   They click the image to open the full-screen **Modal Viewer** to verify if it is a real threat or a false positive.
    *   Based on the visual confirmation, the operator logs an action (e.g., "Signal Triggered" or "Emergency Stop").

5.  **Post-Incident Logging:**
    *   The event is permanently stored and visible in the **History Logs**.
    *   Administrators can review these logs later by searching specific locations or sorting by confidence to refine the AI model's accuracy.
    *   If false positives are high, an admin can go to **Settings** and increase the "Confidence Threshold" slider.

## 📁 Project Structure

```text
frontend/
├── index.html               # Main HTML entry point
├── tailwind.config.js       # Tailwind configuration + Custom Animations
├── src/
│   ├── main.jsx             # React DOM renderer
│   ├── App.jsx              # Main application router and shell layout
│   ├── index.css            # Global CSS and custom keyframes
│   ├── data/
│   │   └── mockData.js      # Simulated backend data (alerts, sensors, health)
│   ├── components/
│   │   ├── Navbar.jsx       # Top navigation, status, and notifications
│   │   ├── Sidebar.jsx      # Left-hand menu and routing links
│   │   ├── AlertCard.jsx    # UI block for showing individual alerts
│   │   ├── CameraCard.jsx   # UI block for individual camera feeds
│   │   ├── StatCard.jsx     # Reusable statistical summary blocks
│   │   ├── SensorStatus.jsx # Real-time list of sensor states & batteries
│   │   └── Modal.jsx        # Pop-up for inspecting full-size images
│   └── pages/
│       ├── Dashboard.jsx    # The default landing summary page
│       ├── LiveAlerts.jsx   # Filterable alert list view
│       ├── CameraFeed.jsx   # Grid of all camera connections
│       ├── HistoryLogs.jsx  # Complex data table of past events
│       └── Settings.jsx     # Configuration sliders and toggles
```

## 💻 How to Run Locally

1.  Make sure you have Node.js installed.
2.  Navigate to the project directory: `cd /Users/pushpentiwari/railway/frontend`
3.  Install dependencies: `npm install`
4.  Start the development server: `npm run dev`
5.  Open your browser to the local URL provided by Vite (usually `http://localhost:5173` or `http://localhost:5177`).
