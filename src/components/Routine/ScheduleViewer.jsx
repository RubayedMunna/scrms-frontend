import React, { useState,useEffect } from 'react';
import axios from 'axios';


const ScheduleViewer = () => {
    
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingEntry, setEditingEntry] = useState(null);
    const [newEntry, setNewEntry] = useState({
        day: '',
        year: '',
        time_slot: '',
        additional_time_slot: '',
        teacher: '',
        course: '',
        room: '',
    });
    const [showAddForm, setShowAddForm] = useState(false);
   

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

   
    const removeFirstBracketsOrParentheses = (text) => {
        return text.replace(/[\[(][^\]\)]+[\])]/, '').trim();
    };
    
   
   
    const handleFetchSchedule = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/schedule', {
                params: { department }
            });
            if (response.data.length === 0) {
                // If no schedule is found, set an error message
                setError(`Routine for the department '${department}' is not found.`);
                setSchedule([]); // Clear any existing schedule
                setSuccessMessage('');
            } else {
                setSchedule(response.data);
                setError('');
                setSuccessMessage('Routine is fetched successfully!');
            }
        } catch (err) {
            setError('Error fetching schedule data.');
            console.error(err);
        }
    };

    const handleAddEntry = async () => {
        try {
            await axios.post('http://localhost:5001/api/add-schedule-entry', {
                department, // Send department name
                ...newEntry
            });
            setNewEntry({
                day: '',
                year: '',
                time_slot: '',
                additional_time_slot: '',
                teacher: '',
                course: '',
                room: '',
            });
            setShowAddForm(false); // Hide the "Add New Entry" form
            setSuccessMessage('Entry added successfully!');
            handleFetchSchedule(); // Fetch the updated schedule
        } catch (err) {
            setError('Error adding schedule entry.');
            console.error(err);
            setSuccessMessage('');
        }
    };

    const handleEditEntry = async () => {
        
        try {
            await axios.put('http://localhost:5001/api/update-schedule-entry', {
                id: editingEntry.id,
                department, // Send department name
                ...editingEntry
            });
            setEditingEntry(null);
            setSuccessMessage('Entry updated successfully!');
            handleFetchSchedule();
            
        } catch (err) {
            setError('Error updating schedule entry.');
            console.error(err);
            setSuccessMessage('');
        }
    };

    const handleDeleteEntry = async (id) => {
        try {
            await axios.delete('http://localhost:5001/api/delete-schedule-entry', {
                data: { id, department } // Send department name and entry ID
            });
            setSuccessMessage('Entry deleted successfully!');
            handleFetchSchedule();
        } catch (err) {
            setError('Error deleting schedule entry.');
            console.error(err);
            setSuccessMessage('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingEntry((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditClick = (item) => {
        setEditingEntry(item);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    };

    const generateScheduleTable = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const years = ['4th year', '3rd year', '2nd year', '1st year'];
        const timeSlots = ['Morning 1', 'Morning 2', 'Noon 1', 'Noon 2', 'Afternoon 1', 'Afternoon 2'];

        return (
            <table className="table table-striped table-bordered table-hover mt-4">
                <thead className="thead-dark">
                    <tr>
                        <th style={cellStyle}>Day</th>
                        <th style={cellStyle}>Year</th>
                        {timeSlots.map((slot) => (
                            <th key={slot} style={cellStyle}>{slot}</th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ fontWeight:'bold' }}>
                    {days.map((day) => (
                        <React.Fragment key={day}>
                            {years.map((year, yearIndex) => (
                                <tr key={`${day}-${year}`}>
                                    {yearIndex === 0 && (
                                        <td rowSpan={4} style={cellStyle}>{day}</td>
                                    )}
                                    <td style={cellStyle}>{year}</td>
                                    {timeSlots.map((slot) => {
                                        const entry = schedule.find(
                                            (item) =>
                                                item.day === day &&
                                                item.year === year &&
                                                item.time_slot === slot
                                        );
                                        return (
                                            <td key={slot} style={cellStyle}>
                                                {entry ? (
                                                    <>
                                                        <div>{removeFirstBracketsOrParentheses(entry.course)}</div>
                                                        <div>{entry.teacher}</div>
                                                        <div>{entry.room}</div>
                                                        <button className="btn btn-primary" onClick={() => handleEditClick(entry)}>Edit</button>
                                                         <button className="btn btn-danger ms-2" onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
                                                    </>
                                                ) : (
                                                    ''
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        );
    };


    const cellStyle = {
        border: '2px solid #d3d3d3', // Light grey color for borders
        padding: '1%',
        textAlign: 'center',
       
    };


    return (
        <div className="container mt-4">
            <h3>View Schedule</h3>
            <div className="input-group mb-3">
                <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="" disabled>Select Department Name</option>
                    {departments.map((dept, index) => (
                        <option key={index} value={dept.Dept_Name}>
                            {dept.Dept_Name}
                        </option>
                    ))}
                </select>
                <button className="btn btn-secondary" onClick={handleFetchSchedule}>
                    Fetch Schedule
                </button>
            </div>



           {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}



            {/* Add Schedule Button */}
            {!showAddForm && (
                <button className="btn btn-primary mb-3" onClick={() => setShowAddForm(true)}>Add a Schedule</button>
            )}

{/* Add/Edit Forms */}
{showAddForm && (
                 <div className="card mb-4">
                    <div className="card-header">
                        <h4>Add New Entry</h4>
                    </div>
                    <div className="card-body">

                    <div className="mb-3">
                    <input
                        type="text"
                        name="day"
                        className="form-control"
                        placeholder="Day"
                        value={newEntry.day || ''}
                        onChange={handleInputChange}
                    />
                     </div>

                     <div className="mb-3">
                    <input
                        type="text"
                        name="year"
                        className="form-control"
                        placeholder="Year"
                        value={newEntry.year || ''}
                        onChange={handleInputChange}
                    />
                    </div>


                    <div className="mb-3">
                    <input
                        type="text"
                        name="time_slot"
                        className="form-control"
                        placeholder="Time Slot"
                        value={newEntry.time_slot || ''}
                        onChange={handleInputChange}
                    />
                     </div>
                    

                     <div className="mb-3">
                    <input
                        type="text"
                        name="additional_time_slot"
                        className="form-control"
                        placeholder="Additional Time Slot"
                        value={newEntry.additional_time_slot || ''}
                        onChange={handleInputChange}
                    />
                    </div>
                    

                    <div className="mb-3">
                    <input
                        type="text"
                        name="teacher"
                        className="form-control"
                        placeholder="Teacher"
                        value={newEntry.teacher || ''}
                        onChange={handleInputChange}
                    />
                    </div>

                    <div className="mb-3">
                    <input
                        type="text"
                        name="course"
                        className="form-control"
                        placeholder="Course"
                        value={newEntry.course || ''}
                        onChange={handleInputChange}
                    />
                    </div>

                    <div className="mb-3">
                    <input
                        type="text"
                        name="room"
                        className="form-control"
                        placeholder="Room"
                        value={newEntry.room || ''}
                        onChange={handleInputChange}
                    />
                    </div>


                    <button className="btn btn-success" onClick={handleAddEntry}>Add Entry</button>
                    <button className="btn btn-secondary ms-2" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

{editingEntry && (
    <div className="card mb-4">
        <div className="card-header">
            <h4>Edit Entry</h4>
        </div>

        <div className="card-body">

            <div className="mb-3">
                <label htmlFor="day" className="form-label fw-bold">Day</label>
                <input
                    type="text"
                    id="day"
                    name="day"
                    className="form-control"
                    placeholder="Day"
                    value={editingEntry.day || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="year" className="form-label fw-bold">Year</label>
                <input
                    type="text"
                    id="year"
                    name="year"
                    className="form-control"
                    placeholder="Year"
                    value={editingEntry.year || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="time_slot" className="form-label fw-bold">Time Slot</label>
                <input
                    type="text"
                    id="time_slot"
                    name="time_slot"
                    className="form-control"
                    placeholder="Time Slot"
                    value={editingEntry.time_slot || ''}
                    onChange={handleEditInputChange}
                    readOnly
                />
            </div>

            <div className="mb-3">
                <label htmlFor="additional_time_slot" className="form-label fw-bold">Additional Time Slot</label>
                <input
                    type="text"
                    id="additional_time_slot"
                    name="additional_time_slot"
                    className="form-control"
                    placeholder="Additional Time Slot"
                    value={editingEntry.additional_time_slot || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="teacher" className="form-label fw-bold">Teacher</label>
                <input
                    type="text"
                    id="teacher"
                    name="teacher"
                    className="form-control"
                    placeholder="Teacher"
                    value={editingEntry.teacher || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="course" className="form-label fw-bold">Course</label>
                <input
                    type="text"
                    id="course"
                    name="course"
                    className="form-control"
                    placeholder="Course"
                    value={editingEntry.course || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="room" className="form-label fw-bold">Room</label>
                <input
                    type="text"
                    id="room"
                    name="room"
                    className="form-control"
                    placeholder="Room"
                    value={editingEntry.room || ''}
                    onChange={handleEditInputChange}
                />
            </div>

            <button className="btn btn-success" onClick={handleEditEntry}>Update Entry</button>
            <button className="btn btn-secondary ms-2" onClick={() => setEditingEntry(null)}>Cancel</button>
        </div>
    </div>
)}
            {/* Display Schedule Table */}
            {schedule.length > 0 && (
                <>
                    <h3>Routine</h3>
                    {generateScheduleTable()}
                </>
            )}
        </div>
    );
};

export default ScheduleViewer;
