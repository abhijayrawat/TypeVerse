# 🚀 TypeVerse

**TypeVerse** is a modern, responsive typing test web application built with **React**, **Vite**, **Express**, and **MongoDB**. It challenges users with dynamically generated word lists, tracks performance in real-time, and offers flexible typing modes—for a personalized typing experience.

---

## ✨ Features

* ⏱ **Timed Tests**: Choose between **15s**, **30s**, or **60s** test durations.
* ⌨️ **Typing Modes**:

  * *Auto-Skip Spaces*: Type letters continuously, spaces are inserted automatically.
  * *Explicit Spaces*: Manually type spaces, similar to traditional tests.
* 📊 **Live Stats**: Real-time WPM, accuracy, and countdown timer while typing.
* 📂 **Persistent Results**:

  * Logged-in users’ results saved to MongoDB.
  * Guest results stored locally in the browser.
* 🎯 **Cumulative Accuracy**: Errors stay highlighted; accuracy doesn't reset between words.
* 🔁 **Dynamic Word Pool**: Words are randomized on each test run from a configurable list.
* 📱 **Responsive UI**: Built with **Tailwind CSS** for a clean, mobile-friendly layout.
* ♿ **Accessible Controls**: Includes keyboard focus states, ARIA-compliant buttons, and clear feedback.

---

## ⚙️ Getting Started

### 📦 Prerequisites

* **Node.js** ≥ 14.x
* **npm** or **Yarn**
* **MongoDB URI** (for database connection)

---

### 🛠 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/typeverse.git
   cd typeverse
   ```

2. **Install dependencies**:

   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. **Create environment variables**:

   * `server/.env`

     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     FRONTEND_URL=http://localhost:5173
     ```

   * `client/.env`

     ```env
     VITE_API_URL=http://localhost:5000
     ```

---

### 💻 Development

1. Start MongoDB (locally or using a remote URI).

2. Run the **backend**:

   ```bash
   cd server
   npm run dev
   ```

3. Run the **frontend**:

   ```bash
   cd client
   npm run dev
   ```

4. Open the app at [http://localhost:5173](http://localhost:5173)

---

## 🧪 Usage

1. Choose a test duration (15s, 30s, or 60s).
2. Toggle “Skip Spaces” to enable continuous typing or manual space input.
3. Start typing and track your performance live.
4. View your results after the timer ends.
5. Log in to save your results—or try again as a guest!

---

## 📁 Project Structure

```
typeverse/
├── client/         # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   └── ...
├── server/         # Backend (Express + MongoDB)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── README.md
```

---

## 📜 Available Scripts

### Frontend (`client`)

* `npm run dev` — Start Vite dev server
* `npm run build` — Build production assets
* `npm run preview` — Preview production build

### Backend (`server`)

* `npm run dev` — Run with Nodemon
* `npm start` — Start production server

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes

   ```bash
   git commit -m "feat: add new feature"
   ```
4. Push to your branch

   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
