import SignLanguageSite from "./SignLanguageSite";
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    document.title = "قولها يإيدك";
    
  }, []);

  return <SignLanguageSite />; // Remove Router temporarily
}