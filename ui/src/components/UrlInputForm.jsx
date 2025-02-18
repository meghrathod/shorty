import React from "react";
import { AnimatePresence, motion } from "motion/react";

const UrlInputForm = ({ url, setUrl, handleGenerate, handleDeleteClick, custom, setCustom, customKey, setCustomKey }) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleGenerate();
        }
    };

    return (
        <div className="w-full max-w-2xl mb-8">
            <div className="form-control w-full">
                <div className="flex flex-row items-center">
                    <div className="relative w-full">
                        <input
                            type="url"
                            id="url"
                            placeholder="Enter URL to shorten or <shorty-keyword> for deletion"
                            className="input input-bordered border-gray-400 rounded-box w-full pr-16"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <label className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer bg-base-200 bg-clip-padding pl-2 backdrop-blur-sm border border-gray-400 rounded-r-box">
                            <span className="label-text mr-2 text-gray-500">Custom</span>
                            <input
                                type="checkbox"
                                id="custom"
                                className="toggle toggle-primary"
                                checked={custom}
                                onChange={(e) => setCustom(e.target.checked)}
                            />
                        </label>
                    </div>
                </div>
                <div className="relative">
                    <AnimatePresence>
                        {custom && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute w-full"
                            >
                                <input
                                    type="text"
                                    id="custom-key"
                                    placeholder="Enter custom keyword"
                                    className="input input-bordered border-gray-400 rounded-box w-full mt-2"
                                    value={customKey}
                                    onChange={(e) => setCustomKey(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="mt-14">
                    <p className="label-text-alt text-gray-500 m-2 text-center">
                        After generation, keep your PIN safe if you need to delete the URL in the future.
                    </p>
                    <p className="label-text-alt text-gray-500 m-2 text-center">
                        Add <code className="bg-base-200 px-1 rounded text-pink-600">{`<shorty-keyword>`}</code> from <code className="bg-base-200 px-1 rounded text-pink-600">{window.location.origin}/{`<shorty-keyword>`}</code> for requesting URL deletion from our database.
                    </p>
                </div>
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