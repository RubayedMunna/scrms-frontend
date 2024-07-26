import React, { useState } from 'react';
import axios from 'axios';

const SyllabusUpload = () => {
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
            const res = await axios.post('http://localhost:5001/api/upload-syllabus', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage('Error uploading file');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SyllabusUpload;
