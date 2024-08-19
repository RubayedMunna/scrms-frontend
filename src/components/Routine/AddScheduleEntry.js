import React, { useState } from 'react';
import axios from 'axios';

const AddScheduleEntry = ({ onSave }) => {
    const [formData, setFormData] = useState({
        dept_id: '',
        day: '',
        year: '',
        time_slot: '',
        additional_time_slot: '',
        teacher: '',
        course: '',
        room: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5001/api/add-schedule-entry', formData)
            .then(response => {
                console.log('Schedule entry added:', response.data);
                setSuccessMessage('Schedule entry successfully added!');
                if (onSave) onSave(); // Callback to parent component to refresh the data or close the form
                setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
            })
            .catch(error => {
                console.error('Error adding schedule entry:', error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Department ID:
                    <input type="number" name="dept_id" value={formData.dept_id} onChange={handleChange} />
                </label>
                <label>
                    Day:
                    <input type="text" name="day" value={formData.day} onChange={handleChange} />
                </label>
                <label>
                    Year:
                    <input type="text" name="year" value={formData.year} onChange={handleChange} />
                </label>
                <label>
                    Time Slot:
                    <input type="text" name="time_slot" value={formData.time_slot} onChange={handleChange} />
                </label>
                <label>
                    Additional Time Slot:
                    <input type="text" name="additional_time_slot" value={formData.additional_time_slot} onChange={handleChange} />
                </label>
                <label>
                    Teacher:
                    <input type="text" name="teacher" value={formData.teacher} onChange={handleChange} />
                </label>
                <label>
                    Course:
                    <input type="text" name="course" value={formData.course} onChange={handleChange} />
                </label>
                <label>
                    Room:
                    <input type="text" name="room" value={formData.room} onChange={handleChange} />
                </label>
                <button type="submit">Add Entry</button>
            </form>
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default AddScheduleEntry;
