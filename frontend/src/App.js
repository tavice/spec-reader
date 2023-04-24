import "./App.css";
import React, { useState } from "react";

//Import Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";

//Import Pages
import Home from "./pages/Home";
import FileImport from "./pages/FileImport";
import PmGpt from "./pages/PmGpt";

//Import Axios
import axios from "axios";

function App() {
  const [keywords, setKeywords] = useState([]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/keywords" element={<FileImport keywords={keywords} />} />
        <Route path="/pmgpt" element={<PmGpt />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
