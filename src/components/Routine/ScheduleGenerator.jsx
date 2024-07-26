import React, { useState } from 'react';
import axios from 'axios';

const ScheduleGenerator = () => {
    const [file, setFile] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5001/api/upload-teachers-preference', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSchedule(response.data);
            setError(null);
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to generate schedule.');
            setSchedule(null);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Generate Schedule</button>

            {error && <p>{error}</p>}

            {schedule && (
                <div>
                    <h3>Generated Schedule</h3>
                    <pre>{JSON.stringify(schedule, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ScheduleGenerator;
