import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function useCourseData() {
    const [departments, setDepartments] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [examYears, setExamYears] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5002/api/fetch-all-data')
            .then(response => {
                setDepartments(response.data.departments); // Extract departments data
                setSessions(response.data.sessions); // Extract sessions data
                setExamYears(response.data.examYears); // Extract examYears data
                setCourses(response.data.courses); // Extract courses data
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }, []);

    return { departments, sessions, examYears, courses };
}

export function useCombinedData() {
    const { departments, sessions, examYears, courses } = useCourseData();

    // Create lookup maps
    const departmentMap = new Map(departments.map(dept => [dept.dept_id, dept.Dept_Name]));
    const sessionMap = new Map(sessions.map(sess => [sess.session_id, { name: sess.Session_name, dept_id: sess.dept_id }]));
    const examYearMap = new Map(examYears.map(exam => [exam.exam_year_id, { exam_year: exam.Exam_year, semester: exam.Semester, session_id: exam.session_id }]));

    // Create combined data
    const combinedData = courses.map(course => {
        const examYear = examYearMap.get(course.exam_year_id);
        if (!examYear) {
            return {
                department_name: 'N/A',
                course_title: course.Course_title,
                exam_year: 'N/A',
                session: 'N/A',
            };
        }

        const session = sessionMap.get(examYear.session_id);
        if (!session) {
            return {
                department_name: 'N/A',
                course_title: course.Course_title,
                exam_year: examYear.exam_year,
                session: 'N/A',
            };
        }

        const departmentName = departmentMap.get(session.dept_id) || 'N/A';

        return {
            department_name: departmentName,
            course_title: course.Course_title,
            exam_year: examYear.exam_year,
            session: session.name,
        };
    });

    return { combinedData };
}

function CourseDataDisplay() {
    const { departments, sessions, examYears, courses } = useCourseData();
    const { combinedData } = useCombinedData();
    
 
    return (
        <div className="App">
            <h1>All Data</h1>
            <div>
                <h2>Departments</h2>
                <table>
                    <thead>
                        <tr>
                            <th>dept_id</th>
                            <th>Dept_Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(row => (
                            <tr key={row.dept_id}>
                                <td>{row.dept_id}</td>
                                <td>{row.Dept_Name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Sessions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>session_id</th>
                            <th>dept_id</th>
                            <th>Session_name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(row => (
                            <tr key={row.session_id}>
                                <td>{row.session_id}</td>
                                <td>{row.dept_id}</td>
                                <td>{row.Session_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Exam Years</h2>
                <table>
                    <thead>
                        <tr>
                            <th>exam_year_id</th>
                            <th>session_id</th>
                            <th>Exam_year</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examYears.map(row => (
                            <tr key={row.exam_year_id}>
                                <td>{row.exam_year_id}</td>
                                <td>{row.session_id}</td>
                                <td>{row.Exam_year}</td>
                                <td>{row.Semester}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Courses</h2>
                <table>
                    <thead>
                        <tr>
                            <th>course_id</th>
                            <th>exam_year_id</th>
                            <th>Course_code</th>
                            <th>Couorse_credit</th>
                            <th>course_title</th>
                            <th>course_type</th>
                            <th>contact_hour</th>
                            <th>rationale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(row => (
                            <tr key={row.course_id}>
                                <td>{row.course_id}</td>
                                <td>{row.exam_year_id}</td>
                                <td>{row.Course_code}</td>
                                <td>{row.Couorse_credit}</td>
                                <td>{row.Course_title}</td>
                                <td>{row.course_type}</td>
                                <td>{row.contact_hour}</td>
                                <td>{row.rationale}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Combined Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Department Name</th>
                            <th>Course Title</th>
                            <th>Exam Year</th>
                            <th>Session</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combinedData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.department_name}</td>
                                <td>{row.course_title}</td>
                                <td>{row.exam_year}</td>
                                <td>{row.session}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CourseDataDisplay;
