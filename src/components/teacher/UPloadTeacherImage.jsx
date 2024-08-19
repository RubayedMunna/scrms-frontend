import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // For URL parameters
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

function UploadTeacherImage() {
    const { teacher_id } = useParams(); // Get teacher_id from URL
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!teacher_id) {
            alert('Teacher ID is required.');
            return;
        }

        if (!file) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await axios.post(`http://localhost:5004/upload/${teacher_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profile image uploaded successfully!');
            navigate('/teacher-homepage');
        } catch (error) {
            console.error('There was an error uploading the file!', error);
            alert('There was an error uploading the file.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h4>Upload Profile Image</h4>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="fileInput" className="form-label">Select Profile Image:</label>
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        id="fileInput" 
                                        onChange={handleFileChange} 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-primary w-100" 
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadTeacherImage;
