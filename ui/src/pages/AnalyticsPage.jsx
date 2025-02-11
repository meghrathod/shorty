import React from 'react';

const AnalyticsPage = ({ analyticsData }) => {
    const { urlDetails, analytics } = analyticsData;

    return (
        <div className="my-8 mx-3 flex flex-col items-center">
            <div className="card w-full max-w-5xl border border-base-300 dark:border-zinc-400 rounded-lg bg-base-100 shadow-xl mb-8 text-center">
                <div className="card-body">
                    <p className="text-lg font-bold">Url Details</p>
                    <p>
                        Short URL:{" "}
                        <a
                            href={window.location.origin + "/" + urlDetails.shortURL}
                            className="link link-primary"
                        >
                            {window.location.origin + "/" + urlDetails.shortURL}
                        </a>
                    </p>
                    <p>
                        Redirect URL:{" "}
                        <a
                            href={urlDetails.url}
                            className="link link-secondary"
                        >
                            {urlDetails.url}
                        </a>
                    </p>
                    <p>Creation Date: {new Date(urlDetails.dateCreated).toLocaleString()}</p>
                    <p>PIN: {urlDetails.pin}</p>
                </div>
            </div>

            <div className="overflow-x-auto w-full max-w-5xl">
                <table className="table border border-separate dark:border-zinc-400 rounded-lg shadow-xl">
                    <thead>
                    <tr>
                        <th>Access Time</th>
                        <th>User Agent</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Country</th>
                    </tr>
                    </thead>
                    <tbody>
                    {analytics && analytics.length > 0 ? (
                        analytics.map((log, index) => (
                            <tr key={index} className="hover:bg-pink-50 dark:hover:bg-pink-700">
                                <td>{new Date(log.accessTime).toLocaleString()}</td>
                                <td>{log.userAgent}</td>
                                <td>{log.ipAddress}</td>
                                <td>{log.location}</td>
                                <td>{log.country}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No analytics data available yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsPage;
