// handlers.js
export const showTemporaryAlert = (message, variant, setAlert) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 5000); // Dismiss after 5 seconds
};

const serverDomain = import.meta.env.VITE_SERVER_DOMAIN;

export const handleGenerate = async (url, setUrl, urls, setUrls, setAlert) => {
    if (!url) {
        showTemporaryAlert('Please enter a URL before generating.', 'warning', setAlert);
        return;
    }

    try {
        const response = await fetch(`${serverDomain}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "url":url })
        });

        if (!response.ok) {
            throw new Error('Failed to shorten URL.');
        }

        const data = await response.json();
        console.log(data);

        const newUrl = {
            shortURL: data.shortURL,
            pin: data.pin,
            originalUrl: url,
        };
        console.log(newUrl);

        // Add new URL to state and save to localStorage
        const updatedUrls = [newUrl, ...urls];
        setUrls(updatedUrls);
        localStorage.setItem('urls', JSON.stringify(updatedUrls)); // Save updated list to localStorage

        setUrl('');
        showTemporaryAlert('URL shortened successfully.', 'success', setAlert);
    } catch (err) {
        showTemporaryAlert('Failed to shorten URL. Please try again.', 'danger', setAlert);
    }
};

export const handleDelete = async (deletedUrl, pin, urls, setUrls, setAlert) => {
    try {
        const response = await fetch(`${serverDomain}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "url":deletedUrl,
                "pin":pin
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete the URL.');
        }

        // Remove the deleted URL from state and localStorage
        const updatedUrls = urls.filter((urlObj) => urlObj.shortURL !== deletedUrl);
        setUrls(updatedUrls);
        localStorage.setItem('urls', JSON.stringify(updatedUrls)); // Update localStorage

        showTemporaryAlert('URL deleted successfully.', 'success', setAlert);
    } catch (err) {
        showTemporaryAlert('Failed to delete URL. Please try again.', 'danger', setAlert);
    }
};