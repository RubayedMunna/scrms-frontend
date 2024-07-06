import React, { useState } from 'react';
import axios from 'axios';
const SyllabusUploadTest = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading file');
        }
    };
    return (
        <div>
            <div className="App">
            <h1>Upload Syllabus XML</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".xml" />
                <button type="submit">Upload</button>
            </form>
            <p>{message}</p>
        </div>
        </div>
    );

};


export default SyllabusUploadTest;