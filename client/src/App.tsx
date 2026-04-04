import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import UploadResources from "./pages/UploadResources";
import DownloadResources from "./pages/DownloadResources";
import Profile from "./pages/Profile";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/resources" element={<Resources />} />

        <Route path="/upload" element={<UploadResources />} />

        <Route path="/download" element={<DownloadResources />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;