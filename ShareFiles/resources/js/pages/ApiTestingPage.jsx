import React, { useState } from 'react';
import axios from 'axios';

const ApiTestingPage = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState([{ key: '', value: '' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const handleAddHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const handleHeaderChange = (index, key, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [key]: value };
        setHeaders(newHeaders);
    };

    const handleRequest = async () => {
        try {
            setError('');
            let headersObj = {};
            headers.forEach(header => {
                if (header.key && header.value) {
                    headersObj[header.key] = header.value;
                }
            });

            const options = {
                method,
                url,
                headers: headersObj,
                ...(method !== 'GET' && { data: body ? JSON.parse(body) : {} })
            };

            const result = await axios(options);
            setResponse(JSON.stringify(result.data, null, 2));
        } catch (err) {
            setError('Error making request: ' + err.message);
            setResponse('');
        }
    };

    return (
        <div className="container">
            <h1>API Testing</h1>
            <div className="form-group">
                <label htmlFor="url">API URL:</label>
                <input
                    type="text"
                    className="form-control"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="method">Method:</label>
                <select
                    id="method"
                    className="form-control"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
            <div className="form-group">
                <label>Headers:</label>
                {headers.map((header, index) => (
                    <div key={index} className="d-flex mb-2">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Key"
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Value"
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                        />
                    </div>
                ))}
                <button className="btn btn-secondary" onClick={handleAddHeader}>Add Header</button>
            </div>
            <div className="form-group">
                <label htmlFor="body">Body (JSON):</label>
                <textarea
                    id="body"
                    className="form-control"
                    rows="5"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            <button className="btn btn-primary" onClick={handleRequest}>Send Request</button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {response && (
                <div className="mt-3">
                    <h3>Response:</h3>
                    <pre>{response}</pre>
                </div>
            )}
        </div>
    );
};

export default ApiTestingPage;