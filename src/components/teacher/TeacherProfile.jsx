import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

const TeacherProfile = () => {
    const [user, setUser] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        Name: '',
        Designation: '',
        dept_id: '',
        Abvr: '',
        Email: '',
        Phone: ''
    });
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const { teacher_id } = useParams();
    const defaultProfileImage = '/files/images/Default_Profile_Image.png';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTeacherProfile(token);
            fetchDesignations();
            fetchDepartments();
        } else {
            window.location.href = '/login';
        }
    }, [teacher_id]);

    const fetchTeacherProfile = async (token) => {
        try {
            const response = await axios.get(`http://localhost:5002/api/teacher-profile/${teacher_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            console.log(response.data);
            setFormData({
                Name: response.data.Name,
                Designation: response.data.Designation,
                dept_id: response.data.dept_id,
                Abvr: response.data.Abvr,
                Email: response.data.Email,
                Phone: response.data.Phone
            });
        } catch (error) {
            console.error('Failed to fetch teacher profile', error);
        }
    };

    const fetchDesignations = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/teacher-designations');
            setDesignations(response.data);
        } catch (error) {
            console.error('Failed to fetch designations', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5002/api/teacher-profile/${teacher_id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditMode(false);
            fetchTeacherProfile(token); // Refresh profile data after update
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    if (!user) return <div className="text-center">Loading data...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h2>{user.Name}'s Profile</h2>
                        </div>
                        <div className="text-center">
                                        <div className="position-relative">
                                            <img
                                                src={user?.profileImage ? `http://localhost:5004${user.profileImage}` : defaultProfileImage}
                                                alt="Profile"
                                                width="150"
                                                className="img-thumbnail"
                                            />
                                        </div>
                                    </div>
                        <div className="card-body">

                            {!editMode ? (
                                <div>
                                    <p><strong>Name:</strong> {user.Name}</p>
                                    <p><strong>Designation:</strong> {user.Designation}</p>
                                    <p><strong>Department:</strong> {user.Department}</p>
                                    <p><strong>Abbreviation:</strong> {user.Abvr}</p>
                                    <p><strong>Email:</strong> {user.Email}</p>
                                    <p><strong>Phone:</strong> {user.Phone}</p>
                                    <button className="btn btn-primary" onClick={toggleEditMode}>Edit Profile</button>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="Name" 
                                            value={formData.Name} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Designation</label>
                                        <select 
                                            className="form-control" 
                                            name="Designation" 
                                            value={formData.Designation} 
                                            onChange={handleInputChange}
                                        >
                                            {designations.map(designation => (
                                                <option key={designation} value={designation}>{designation}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select 
                                            className="form-control" 
                                            name="dept_id" 
                                            value={formData.dept_id} 
                                            onChange={handleInputChange}
                                        >
                                            {departments.map(dept => (
                                                <option key={dept.dept_id} value={dept.dept_id}>{dept.Dept_Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Abbreviation</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="Abvr" 
                                            value={formData.Abvr} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            name="Email" 
                                            value={formData.Email} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="Phone" 
                                            value={formData.Phone} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                    <button type="button" className="btn btn-secondary ml-2" onClick={toggleEditMode}>Cancel</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
