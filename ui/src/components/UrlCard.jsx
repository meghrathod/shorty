import React from 'react';

const UrlCard = ({ urlObj, handleDelete, margin }) => {
    return (
        <div className={`card bg-base-100 shadow-xl ${margin} border border-base-300 rounded-lg dark:border-zinc-400`}>
            <div className="card-body items-center text-center">
                <p className="text-sm">
                    Original URL:{" "}
                    <a
                        href={urlObj.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary font-bold"
                    >
                        {urlObj.originalUrl}
                    </a>
                    <br />
                    Shortened:{" "}
                    <a
                        href={window.location.origin+"/"+urlObj.shortURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-secondary font-bold"
                    >
                        {window.location.origin+"/"+urlObj.shortURL}
                    </a>
                    <br />
                    PIN: <span className="text-gray-500 font-bold">{urlObj.pin}</span>
                </p>
                <div className="card-actions justify-center">
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => window.location.href = `/analytics?short_url=${urlObj.shortURL}&pin=${urlObj.pin}`}
                    >
                        View Analytics
                    </button>
                    <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(urlObj.shortURL, urlObj.pin)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlCard;
