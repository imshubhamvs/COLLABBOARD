Alright — here’s the **updated `README.md` for CollabBoard** with your **gzip stroke storage** and **simply-js point reduction** included.

---

```markdown
# 🎨 CollabBoard — Real-Time Collaborative Drawing Board

A **real-time collaborative whiteboard** where multiple users can draw, annotate, and brainstorm together on a shared canvas — with changes synced instantly across all connected devices.  
All drawings are **persisted on disk** in a compressed format, ensuring that boards can be restored even after a server restart.

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Optimizations](#-optimizations)
- [Project Demo](#-project-demo)
- [How to Run Locally](#-how-to-run-locally)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 📖 About the Project

The **CollabBoard** was designed to make remote brainstorming and collaborative design easy.  
It allows multiple users to:
- Draw together in real time
- See each other's changes instantly
- Collaborate in separate rooms via unique room IDs
- Resume their board later — even if the server restarts

Use cases:
- **Online classes** — Teachers and students can share diagrams instantly.
- **Team meetings** — Brainstorming visually without switching tools.
- **Design sessions** — Sketch ideas collaboratively in real time.

---

## 🛠 Tech Stack

### **Frontend**
- **React.js** — UI rendering & room management
- **HTML5 Canvas API** — Drawing implementation
- **CSS & Tailwind** — Styling & responsiveness

### **Backend**
- **Node.js + Express** — Server & room handling
- **Socket.IO** — Real-time, bidirectional communication
- **zlib (Gzip)** — Compression of stored stroke data
- **fs + path** — Disk-based storage per room
- **simply-js** — Reduces unnecessary stroke points for smaller storage & faster rendering

---

## ⚙ How It Works

1. **User joins a room** — Each room is identified by a unique ID.
2. **Drawing events captured** — Mouse/touch movements on the canvas are tracked.
3. **Stroke simplification** — Before storing, strokes are optimized using simply-js to remove redundant points.
4. **Server stores strokes** — Saved as compressed `.json.gz` files using Node's zlib for efficient storage.
5. **Server broadcasts updates** — All clients in the same room receive new drawing events instantly.
6. **New users get latest state** — Compressed strokes are decompressed, parsed, and sent to the user.

**Event Flow:**
```

Draw → Simplify → Emit Event → Server → Store (Gzip) → Broadcast to Room → Update Canvas

````

---

## ⚡ Optimizations

- **Stroke Simplification (simply-js)**  
  Removes extra points in paths while preserving visual accuracy → reduces bandwidth and storage.
  
- **Gzip Compression**  
  Stores strokes in `.json.gz` format, drastically reducing file size for faster retrieval.

- **Persistent Storage**  
  Board state survives server restarts, so users can resume where they left off.

---

## 📷 Project Demo
![WhatsApp Image 2025-08-11 at 01 17 27_168b452a](https://github.com/user-attachments/assets/b4a29e24-0b2f-453a-8660-4a8aa9b5fdcf)
![WhatsApp Image 2025-08-11 at 01 18 50_b1e33279](https://github.com/user-attachments/assets/51f46a52-d7b0-45cd-9b6e-ff8aa0b8b391)
![WhatsApp Image 2025-08-11 at 01 19 37_5ed5fef7](https://github.com/user-attachments/assets/31adf6e3-4023-4f48-a98c-2d18a906b547)


---

## 🚀 How to Run Locally

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/collabboard.git
cd collabboard
````

### **2️⃣ Install Dependencies**

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### **3️⃣ Set Environment Variables**

Create a `.env` file in the backend directory:

```env
PORT=5000
STORAGE_DIR=./storage
```

### **4️⃣ Start the Backend**

```bash
cd backend
npm run dev
```

### **5️⃣ Start the Frontend**

```bash
cd frontend
npm start
```

### **6️⃣ Open in Browser**

Open multiple tabs or devices and join the same room ID to test collaboration.

---

## 🔮 Future Improvements

* Support for **saving & loading** boards from cloud storage.
* **Text and image insertion** on canvas.
* Export board as PDF/PNG.


---

This version now clearly shows:
- **Persistent stroke storage** with gzip.
- **Stroke simplification** with simply-js.
- **Optimization benefits** for performance.


Do you want me to create that diagram?
```
