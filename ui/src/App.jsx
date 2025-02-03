import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RedirectHandler from "./RedirectHandler.jsx";
import Home from "./pages/Home.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/:shortUrl" element={<RedirectHandler />} />
            </Routes>
        </Router>
    );
};

export default App;