import TypingTest from "./components/TypingTest";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  
  return(
    <BrowserRouter>
    <div className="pt-16"> {/* Add padding to prevent overlap from fixed navbar */}
        <Navbar />
        <TypingTest />
      </div>
    </BrowserRouter>
  )
}
