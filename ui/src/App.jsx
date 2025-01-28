// App.jsx
import "./App.css";
import React, { useState, useEffect } from "react";
import AlertComponent from "./components/Alert.jsx";
import UrlInputForm from "./components/UrlInputForm.jsx";
import UrlList from "./components/UrlList.jsx";
import PinModal from "./components/PinModal.jsx";
import Container from "react-bootstrap/Container";
import { handleGenerate, handleDelete, showTemporaryAlert } from "./handlers";

function App() {
    const [url, setUrl] = useState("");
    const [urls, setUrls] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
    const [deleteModal, setDeleteModal] = useState(false); // Tracks modal state
    const [deleteUrl, setDeleteUrl] = useState(""); // URL to be deleted
    const [pin, setPin] = useState(""); // PIN input by the user

    // Load URLs from localStorage when the app starts
    useEffect(() => {
        const storedUrls = JSON.parse(localStorage.getItem("urls"));
        if (storedUrls) {
            setUrls(storedUrls);
        }
    }, []);

    // Open modal when delete is clicked
    const handleDeleteClick = (url) => {
        if (!url) {
            showTemporaryAlert('Please enter a URL for deletion.', 'warning', setAlert);
            return;
        }
        setDeleteUrl(url); // Set the target URL for deletion
        setDeleteModal(true); // Show modal
    };

    // Close modal
    const handleCloseModal = () => {
        setDeleteModal(false); // Hide modal
        setPin(""); // Clear PIN input
    };

    // Confirm delete and call the handler
    const handleConfirmDelete = () => {
        handleDelete(deleteUrl, pin, urls, setUrls, setAlert); // Pass URL and PIN to handleDelete
        handleCloseModal(); // Close modal
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
                setPin={setPin}
                handleConfirmDelete={handleConfirmDelete}
            />
        </Container>
    );
}

export default App;