import React from "react";

const UrlInputForm = ({ url, setUrl, handleGenerate, handleDeleteClick }) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleGenerate();
        }
    };

    return (
        <div className="w-full max-w-2xl mb-8">
            <div className="form-control w-full">
                <input
                    type="url"
                    placeholder="Enter URL to shorten or <shorty-keyword> for deletion"
                    className="input input-bordered w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <p className="label-text-alt text-gray-500 m-2 text-center">
                    After generation, keep your PIN safe if you need to delete the URL in the future.
                </p>
                <p className="label-text-alt text-gray-500 m-2 text-center">
                   Add <code className="bg-base-200 px-1 rounded text-pink-600">{`<shorty-keyword>`}</code> from <code className="bg-base-200 px-1 rounded text-pink-600">{window.location.origin}/{`<shorty-keyword>`}</code> for requesting URL deletion from our database.
                </p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="btn btn-primary"
                    onClick={handleGenerate}
                >
                    Generate
                </button>
                <button
                    className="btn btn-error"
                    onClick={() => handleDeleteClick(url)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UrlInputForm;
