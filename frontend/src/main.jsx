import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddRemedy from "./components/AddRemedy.jsx";
import Navbar from "./components/Navbar";
import Result from "./components/Result.jsx";
import NotFound from "./components/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <div className="container-lg">
        <Routes>
          <Route path="/" element={<Result />} />
          <Route path="/delete" element={<Result />} />
          <Route path="/add" element={<AddRemedy />} />
          <Route path="/update" element={<AddRemedy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);
