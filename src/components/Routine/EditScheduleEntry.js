import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditScheduleEntry = ({ entry, onSave }) => {
    const [formData, setFormData] = useState({
        id: entry.id || '', // Ensure id is always present
        dept_id: entry.dept_id || '',
        day: entry.day || '',
        year: entry.year || '',
        time_slot: entry.timeSlot || '', // Fix the field name (if it was different)
        additional_time_slot: entry.additional_time_slot || '',
        teacher: entry.teacher || '',
        course: entry.course || '',
        room: entry.room || ''
    });

    // Ensure the formData is updated if the entry prop changes
    useEffect(() => {
        setFormData({
            id: entry.id || '',
            dept_id: entry.dept_id || '',
            day: entry.day || '',
            year: entry.year || '',
            time_slot: entry.timeSlot || '',
            additional_time_slot: entry.additional_time_slot || '',
            teacher: entry.teacher || '',
            course: entry.course || '',
            room: entry.room || ''
        });
    }, [entry]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure the id is included in the request
        if (!formData.id) {
            console.error('ID is missing in formData');
            return;
        }

        axios.put('http://localhost:5001/api/update-schedule-entry', formData)
            .then(response => {
                console.log('Schedule entry updated:', response.data);
                onSave(); // Callback to parent component to refresh the data or close the form
            })
            .catch(error => {
                console.error('Error updating schedule entry:', error.response ? error.response.data : error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={formData.id} />
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
            <button type="submit">Save</button>
        </form>
    );
};

export default EditScheduleEntry;
