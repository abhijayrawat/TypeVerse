# TypeVerse

TypeVerse is a modern, responsive typing test application built with React, Vite, Express, and MongoDB. It challenges users with randomized word lists, tracks performance time, and offers flexible typing modes—for a customized practice experience.

## Features

- **Timed Tests**: Choose between 15 s, 30 s, or 60 s durations.  
- **Auto-Skip Spaces Mode**: Type letters continuously; spaces are inserted automatically.  
- **Explicit-Spaces Mode**: Type spaces manually, matching traditional typing tests.  
- **Real-Time Stats**: Live WPM, accuracy, and countdown timer during each test.  
- **Persistent Results**: Logged-in users’ results saved to the backend; guests’ results stored locally.  
- **Cumulative Accuracy**: Mistakes remain highlighted; accuracy never resets when moving between words.  
- **Dynamic Word Generation**: Randomized word lists on each test run, sourced from a configurable pool.  
- **Responsive UI**: Tailwind CSS styling for a clean, mobile-friendly interface.  
- **Accessible Controls**: Keyboard focus rings, clear color-coded feedback, and ARIA-friendly buttons.

## Getting Started

### Prerequisites

- Node.js ≥ 14.x  
- npm or Yarn  
- MongoDB URI (for production)

### Installation

1. **Clone the repository**  

2. **Install dependencies**  


3. **Create environment files**  
- **server/.env**  
  ```
  PORT=5000
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  FRONTEND_URL=http://localhost:5173
  ```  
- **client/.env**  
  ```
  VITE_API_URL=http://localhost:5000
  ```

### Development

1. Start your database if using local MongoDB.  
2. Run the backend:  
3. Run the frontend:  
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Select a test duration (15 s, 30 s, 60 s).  
2. Toggle “Skip Spaces” to type continuously or type spaces manually.  
3. Start typing! Watch live WPM and accuracy updates.  
4. When time’s up, view your final stats and have results saved.  
5. Restart or adjust settings for a new challenge.

## Project Structure


## Available Scripts

### Frontend (`client`)

- `npm run dev` — start development server  
- `npm run build` — production build  
- `npm run preview` — preview production build

### Backend (`server`)

- `npm run dev` — start with nodemon (development)  
- `npm start` — start production server  

## Contributing

1. Fork the repository.  
2. Create your feature branch:  
3. Commit your changes:  
4. Push to your branch:  
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
