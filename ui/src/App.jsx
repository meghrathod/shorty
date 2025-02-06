import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RedirectHandler from "./RedirectHandler.jsx";
import Home from "./pages/Home.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import NotFoundPage from "./pages/404.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import LoaderPage from "./pages/LoaderPage.jsx";

const App = () => {
    const [pin, setPin] = useState(""); // Store the PIN

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home setPin={setPin} />} />
                <Route path="/analytics" element={<ProtectedRoute element={AnalyticsPage} pin={pin} />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/:shortUrl" element={<RedirectHandler />} />
            </Routes>
        </Router>
    );
};

export default App;