import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import UploadResources from "./pages/UploadResources";
import DownloadResources from "./pages/DownloadResources";
import Profile from "./pages/Profile";

function App() {

  return (

    <GoogleOAuthProvider clientId="529740625989-tnqtt45ts42l6j0j8qnk2dsclnbf6mdv.apps.googleusercontent.com">

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

    </GoogleOAuthProvider>

  );
}

export default App;