import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import AlertComponent from "../components/Alert.jsx";
import UrlInputForm from "../components/UrlInputForm.jsx";
import UrlList from "../components/UrlList.jsx";
import PinModal from "../components/PinModal.jsx";
import { handleGenerate, handleDelete, showTemporaryAlert } from "../handlers";
import { useNavigate } from 'react-router-dom';

function Home({ setPin }) {
    const [url, setUrl] = useState("");
    const [urls, setUrls] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
    const [deleteModal, setDeleteModal] = useState(false);
    const [analyticsModal, setAnalyticsModal] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState("");
    const [pin, setLocalPin] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUrls = JSON.parse(localStorage.getItem("urls"));
        if (storedUrls) {
            setUrls(storedUrls);
        }
    }, []);

    const handleDeleteClick = (url) => {
        if (!url) {
            showTemporaryAlert('Please enter a URL for deletion.', 'warning', setAlert);
            return;
        }
        setDeleteUrl(url);
        setDeleteModal(true);
    };

    const handleAnalyticsClick = (url) => {
        if (!url) {
            showTemporaryAlert('Please enter a URL for analytics.', 'warning', setAlert);
            return;
        }
        setDeleteUrl(url);
        setAnalyticsModal(true);
    };

    const handleCloseModal = () => {
        setDeleteModal(false);
        setAnalyticsModal(false);
        setLocalPin("");
    };

    const handleConfirmDelete = () => {
        handleDelete(deleteUrl, pin, urls, setUrls, setAlert);
        handleCloseModal();
    };

    const handleConfirmAnalytics = () => {
        setPin(pin); // Set the PIN in the App component
        navigate(`/analytics?short_url=${deleteUrl}&pin=${pin}`);
        handleCloseModal();
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <AlertComponent
                alert={alert}
                onClose={() => setAlert({ show: false, message: "", variant: "" })}
            />

            <h1 className="mb-4 text-center fw-bold">Shorty ✄</h1>

            <UrlInputForm
                url={url}
                setUrl={setUrl}
                handleGenerate={() =>
                    handleGenerate(url, setUrl, urls, setUrls, setAlert)
                }
                handleDeleteClick={handleDeleteClick}
                handleAnalyticsClick={handleAnalyticsClick}
            />

            <UrlList
                urls={urls}
                handleDelete={(shortURL, pin) =>
                    handleDelete(shortURL, pin, urls, setUrls, setAlert)
                }
            />

            <PinModal
                show={deleteModal}
                handleClose={handleCloseModal}
                url={deleteUrl}
                pin={pin}
                setPin={setLocalPin}
                handleConfirmDelete={handleConfirmDelete}
            />

            <PinModal
                show={analyticsModal}
                handleClose={handleCloseModal}
                url={deleteUrl}
                pin={pin}
                setPin={setLocalPin}
                handleConfirmDelete={handleConfirmAnalytics}
            />
        </Container>
    );
}

export default Home;