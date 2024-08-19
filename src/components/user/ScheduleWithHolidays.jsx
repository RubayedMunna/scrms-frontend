import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ScheduleWithHolidays = () => {
    const [schedule, setSchedule] = useState([]); // Keeping schedule as an empty array
    const [holidays, setHolidays] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('week'); // Default view is week

    useEffect(() => {
        // Fetch holidays
        axios.get('http://localhost:5002/api/holidays')
            .then(response => {
                console.log('Fetched holidays:', response.data);
                setHolidays(response.data);
                generateCalendarEvents(); // Generate events using the fetched holidays
            })
            .catch(error => console.error('Error fetching holidays:', error));
    }, []);

    const generateCalendarEvents = () => {
        const calendarEvents = schedule.map((item) => ({
            title: `${item.course} - ${item.teacher} (${item.room})`,
            start: new Date(item.year, item.month - 1, item.day),
            end: new Date(item.year, item.month - 1, item.day),
            allDay: true,
            isHoliday: false,
        }));

        const holidayEvents = holidays.map((holiday) => ({
            title: holiday.event_name,
            start: new Date(holiday.start_date),
            end: new Date(holiday.end_date),
            allDay: true,
            isHoliday: true,
        }));

        setEvents([...calendarEvents, ...holidayEvents]);
    };

    const renderRoutineTable = () => {
        const startDate = moment(currentDate).startOf('isoWeek').toDate(); // Start of the week
        const endDate = moment(currentDate).endOf('isoWeek').toDate(); // End of the week
        const datesArray = [];

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            datesArray.push(new Date(date));
        }

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return (
            <table className="table table-bordered text-center">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Holidays</th>
                    </tr>
                </thead>
                <tbody>
                    {datesArray.map((date) => {
                        const day = weekdays[date.getDay()];
                        const routines = schedule.filter(item => new Date(item.year, item.month - 1, item.day).toDateString() === date.toDateString());
                        const isHolidayToday = holidays.some(holiday => new Date(holiday.start_date).toDateString() === date.toDateString());
                        const holidayName = holidays.find(holiday => new Date(holiday.start_date).toDateString() === date.toDateString())?.event_name;

                        return (
                            <tr key={date.toDateString()} className={isHolidayToday ? 'bg-danger text-white' : ''}>
                                <td>{date.toDateString()}</td>
                                <td>{day}</td>
                                {isHolidayToday ? (
                                    <td colSpan="2" className="bg-danger text-white text-center">
                                        {holidayName}
                                    </td>
                                ) : (
                                    <td>
                                        {routines.length > 0 ? (
                                            routines.map((routine, index) => (
                                                <div key={index}>{`${routine.course} - ${routine.teacher} (${routine.room})`}</div>
                                            ))
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleBack = () => {
        const newDate = moment(currentDate).subtract(1, view === 'week' ? 'weeks' : 'months').toDate();
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = moment(currentDate).add(1, view === 'week' ? 'weeks' : 'months').toDate();
        setCurrentDate(newDate);
    };

    const getCurrentWeekLabel = () => {
        const startOfWeek = moment(currentDate).startOf('isoWeek').format('MMMM D');
        const endOfWeek = moment(currentDate).endOf('isoWeek').format('D');
        return `${startOfWeek} – ${endOfWeek}`;
    };

    return (
        <div className="container mt-4">
            <h3>Holidays</h3>

            <div className="mb-3 d-flex align-items-center">
                <button className="btn btn-info me-2" onClick={handleToday}>Today</button>
                <button className="btn btn-secondary me-2" onClick={handleBack}>Back</button>
                <button className="btn btn-secondary me-2" onClick={handleNext}>Next</button>
                <h5 className="mb-0 mx-2">{getCurrentWeekLabel()}</h5>
                <select
                    className="form-select ms-2"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                >
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                </select>
            </div>

            {/* Display Routine Table */}
            {renderRoutineTable()}

            {/* Display Calendar */}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={['month', 'week', 'day']} // Add the views you want to allow
                step={30}
                date={currentDate}
                onNavigate={date => setCurrentDate(date)}
                eventPropGetter={(event) => {
                    const backgroundColor = event.isHoliday ? 'red' : 'blue';
                    const color = event.isHoliday ? 'white' : 'black';
                    return { style: { backgroundColor, color } };
                }}
            />
        </div>
    );
};

export default ScheduleWithHolidays;
