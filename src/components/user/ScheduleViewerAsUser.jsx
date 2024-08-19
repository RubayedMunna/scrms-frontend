import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleViewerAsUser = () => {
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // State to track week offset

    useEffect(() => {
        axios.get('http://localhost:5002/api/fetch-all-data')
            .then(response => {
                setDepartments(response.data.departments);
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });

        axios.get('http://localhost:5002/api/holidays')
            .then(response => {
                const holidaysData = response.data.map(holiday => ({
                    day: new Date(holiday.start_date).toLocaleString('default', { weekday: 'long' }),
                    date: new Date(holiday.start_date).toLocaleDateString(),
                    event_name: holiday.event_name,
                }));
                setHolidays(holidaysData);
            })
            .catch(error => console.error('Error fetching holidays:', error));
    }, []);

    const handleFetchSchedule = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/schedule', {
                params: { department }
            });
            if (response.data.length === 0) {
                setError(`Routine for the department '${department}' is not found.`);
                setSchedule([]);
                setSuccessMessage('');
            } else {
                setSchedule(response.data);
                console.log(response.data);
                setError('');
                setSuccessMessage('Routine is fetched successfully!');
            }
        } catch (err) {
            setError('Error fetching schedule data.');
            console.error(err);
        }
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.toLocaleString('default', { weekday: 'long' });
    };

    const isHoliday = (day, date) => {
        return holidays.some(holiday => holiday.day === day && holiday.date === date);
    };

    const getHolidayDetailsForWeek = (weekOffset = 0) => {
        const today = new Date();
        const adjustedDate = new Date(today.setDate(today.getDate() + (weekOffset * 7)));
        const startOfWeek = new Date(adjustedDate.setDate(adjustedDate.getDate() - adjustedDate.getDay()));
        const endOfWeek = new Date(adjustedDate.setDate(adjustedDate.getDate() + (6 - adjustedDate.getDay())));

        const weekHolidays = holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= startOfWeek && holidayDate <= endOfWeek;
        });

        return weekHolidays.length > 0 ? weekHolidays : null;
    };

    const getCurrentWeekRange = (weekOffset = 0) => {
        const today = new Date();
        const adjustedDate = new Date(today.setDate(today.getDate() + (weekOffset * 7)));
        const startOfWeek = new Date(adjustedDate.setDate(adjustedDate.getDate() - adjustedDate.getDay()));
        const endOfWeek = new Date(adjustedDate.setDate(adjustedDate.getDate() + (6 - adjustedDate.getDay())));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        return `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
    };

    const generateScheduleTable = (weekOffset = 0) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const years = ['4th year', '3rd year', '2nd year', '1st year'];
        const timeSlots = ['Morning 1', 'Morning 2', 'Noon 1', 'Noon 2', 'Afternoon 1', 'Afternoon 2'];

        const adjustedToday = new Date(new Date().setDate(new Date().getDate() + (weekOffset * 7)));

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
                <tbody style={rowTextStyle}>
                    {days.map((day) => (
                        <React.Fragment key={day}>
                            {years.map((year, yearIndex) => {
                                const date = new Date(adjustedToday.setDate(adjustedToday.getDate() + (days.indexOf(day) - adjustedToday.getDay()))).toLocaleDateString();
                                const isTodayRow = isToday(day);
                                const isHolidayRow = isHoliday(day, date);
                                const rowStyle = isHolidayRow 
                                ? { backgroundColor: '#DC143C' } // Red for holidays
                                : isTodayRow 
                                ? { backgroundColor: '#C1E899' } // Light green for today
                                : { backgroundColor: '#F0E68C' }; // Light yellow for regular days


                                return (
                                    <tr key={`${day}-${year}`} style={rowStyle}>
                                        {yearIndex === 0 && (
                                            <td rowSpan={4} style={rowStyle} >
                                                {day}
                                                <br/>
                                                {date}
                                            </td>
                                        )}
                                        <td style={rowStyle}>{year}</td>
                                        {timeSlots.map((slot) => {
                                            const entry = schedule.find(
                                                (item) =>
                                                    item.day === day &&
                                                    item.year === year &&
                                                    item.time_slot === slot
                                            );
                                            return (
                                                <td key={slot} style={rowStyle}>
                                                    {entry ? (
                                                        <>
                                                            <div>{removeFirstBracketsOrParentheses(entry.course)}</div>
                                                            <div>{entry.teacher}</div>
                                                            <div>{entry.room}</div>
                                                        </>
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={timeSlots.length + 2} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            {getHolidayDetailsForWeek(currentWeekOffset) && (
                                <div>
                                    <strong>Holiday Details:</strong>
                                    {getHolidayDetailsForWeek(currentWeekOffset).map((holiday, index) => (
                                        <div key={index}>
                                            {holiday.day}, {holiday.date}: {holiday.event_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    };

    const removeFirstBracketsOrParentheses = (text) => {
        return text.replace(/[\[(][^\]\)]+[\])]/, '').trim();
    };

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
    };
    const rowTextStyle = {
        textAlign: 'center',
        color: 'grey'
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

            {schedule.length > 0 && (
                <>
                    <h3 className="text-center fw-bold text-secondary my-4 text-uppercase">
                        Routine for {getCurrentWeekRange(currentWeekOffset)}
                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                            >
                                Previous Week
                            </button>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                            >
                                Next Week
                            </button>
                        </div>
                    </h3>
                    {generateScheduleTable(currentWeekOffset)}
                </>
            )}
        </div>
    );
};

export default ScheduleViewerAsUser;