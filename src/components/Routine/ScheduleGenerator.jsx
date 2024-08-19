import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ScheduleGenerator = () => {
    const [file, setFile] = useState(null);
    const [department, setDepartment] = useState(''); // New state for department
    const [departments, setDepartments] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
   
    useEffect(() => {
        axios.get('http://localhost:5002/api/fetch-all-data')
            .then(response => {
                setDepartments(response.data.departments); // Extract departments data
               console.log(response.data.departments);
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }, []);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }


        if (!department) {
            alert('Please enter a department name!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('department', department); // Append department to formData

        try {
            const response = await axios.post('http://localhost:5001/api/upload-teachers-preference', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Transform the response data
            const transformedData = transformScheduleData(response.data);
            setSchedule(transformedData);
            setError(null);
            setSuccessMessage('Schedule generated successfully!');

        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Failed to generate schedule.');
            setSchedule([]);
            setSuccessMessage(''); // Clear success message on error
        }
    };

    const transformScheduleData = (data) => {
        const result = [];
        for (const day in data) {
            for (const time in data[day]) {
                for (const year in data[day][time]) {
                    data[day][time][year].forEach((item) => {
                        result.push({
                            id: item.id, // Ensure id is included
                            dept_id: item.dept_id,
                            day,
                            timeSlot: time,
                            year,
                            ...item
                        });
                    });
                }
            }
        }
        return result;
    };

    const handleBackToHome = () => {
        navigate('/su-dashboard'); // Adjust the route as per your application's home page route
    };

    const handleViewRoutine = () => {
        navigate('/view-routine'); // Adjust the route as per your application's home page route
    };

    return (
<div className="container mt-4">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <div className="card  shadow-sm">
                <div className="card-body">
                    <h5 className="card-title text-center mb-4">Upload and Generate Schedule</h5>


                    <div className="mb-3">
            <select
                className="form-select"
                value={department}
                onChange={handleDepartmentChange}
            >
                <option value="" disabled>Select Department Name</option>
                {departments.map((dept, index) => (
                    <option key={index} value={dept.Dept_Name}>
                        {dept.Dept_Name}
                    </option>
                ))}
            </select>
        </div>
                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        onClick={handleUpload}
                    >
                        Upload and Generate Schedule
                    </button>

                    {error && (
                        <p className="mt-3 text-danger text-center">{error}</p>
                    )}
                    {successMessage && (
                        <div className="mt-3 alert alert-success text-center" role="alert">
                            {successMessage}
                        </div>
                    )}
                    
                </div>
                
            </div>
            <div className="d-grid gap-2 justify-content-md m-2">
            <button className="btn btn-success" type="button" onClick={handleViewRoutine}>View Routine</button>
            <button className="btn btn-dark" type="button" onClick={handleBackToHome}>Back to Home</button>
            </div>
            
        </div>
    </div>
</div>
);
};

export default ScheduleGenerator;