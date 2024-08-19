import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        // Fetch the list of teachers from the backend
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:5004/teachers');
                setTeachers(response.data);
            } catch (error) {
                console.error('There was an error fetching the teacher list!', error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <div>
            <h1>Teacher Profiles</h1>
            <ul>
                {teachers.map(teacher => (
                    <li key={teacher.teacher_id}>
                        <div>{teacher.profileImage}</div>
                        <img 
                            src={`http://localhost:5004${teacher.profileImage}`} 
                            alt={`${teacher.Name}'s profile`} 
                            width="100"
                        />
                        <h3>{teacher.Name}</h3>
                        <p>Designation: {teacher.Designation}</p>
                        <p>Email: {teacher.Email}</p>
                        <p>Phone: {teacher.Phone}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TeacherList;
