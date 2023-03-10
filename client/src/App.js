import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Mainpage } from "./Pages/Mainpage";
import { Reportpage } from "./Pages/Reportpage";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} exact />
        <Route path="/report" element={<Reportpage />} exact />
      </Routes>
    </Router>
  );
}

export default App;
