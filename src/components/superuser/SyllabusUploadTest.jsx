import React, { useState } from 'react';
import axios from 'axios';

const SyllabusUploadTest = () => {
    const [file, setFile] = useState(null);
    const [departmentName, setDepartmentName] = useState('');
    const [sessionName, setSessionName] = useState('');
    const [examYear, setExamYear] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('department_name', departmentName);
        formData.append('session_name', sessionName);
        formData.append('exam_year', examYear);

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
                    <input
                        type="text"
                        placeholder="Enter Department Name"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Session"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Exam Year"
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                    />
                    <button type="submit">Upload</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default SyllabusUploadTest;
