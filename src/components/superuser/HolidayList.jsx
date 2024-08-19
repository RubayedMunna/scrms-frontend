import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HolidayList = () => {
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/holidays');
                setHolidays(response.data);
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };
        fetchHolidays();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Holiday Calendar</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>No. of Days</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map((holiday) => (
                        <tr key={holiday.holiday_id}>
                            <td>{holiday.event_name}</td>
                            <td>{holiday.start_date}</td>
                            <td>{holiday.end_date}</td>
                            <td>{holiday.num_days}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HolidayList;
