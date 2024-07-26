import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useCourseData } from '../superuser/CourseDataDisplay';
import { useCombinedData } from '../superuser/CourseDataDisplay';
import '../../CSS/SyllabusFilter.css';
import {Card,Button} from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const getUniqueOptions = (items, key) => {
    const seen = new Set();
    return items.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}; 

function SyllabusFilter() {
    

   
    
 



    const { departments, sessions, examYears } = useCourseData();
    const { combinedData } = useCombinedData();

    
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedExamYear, setSelectedExamYear] = useState('');
    // const [departmentName, setDepartmentName] = useState('');
    // const [sessionName, setSessionName] = useState('');
    // const [examYear, setExamYear] = useState('');
    const [courseName, setCourseName] = useState('');
    const [fields] = useState([
        'Course_code', 'Couorse_credit', 'course_title', 'course_type',
        'contact_hour', 'rationale', 'chapters', 'objectives', 'prerequisites',
        'recommended_books', 'student_learning_outcomes'
    ]);
    
    const [selectedFields, setSelectedFields] = useState([fields]);
    const [courseData, setCourseData] = useState(null);
    const [showSyllabus, setShowSyllabus] = useState(false); 

   

   
    const fieldDisplayNames = {
        Course_code: 'Course Code',
        Couorse_credit: 'Course Credit',
        course_title: 'Course Title',
        course_type: 'Course Type',
        contact_hour: 'Contact Hour',
        rationale: 'Rationale',
        chapters: 'Chapters',
        objectives: 'Objectives',
        prerequisites: 'Prerequisites',
        recommended_books: 'Recommended Books',
        student_learning_outcomes: 'Student Learning Outcomes'
    };


    useEffect(() => {
        console.log('Combined Data:', combinedData); // Debugging
    }, [combinedData]);

    const handleFieldChange = (event) => {
        const value = event.target.value;
        setSelectedFields(prevSelectedFields => {
            if (prevSelectedFields.includes(value)) {
                return prevSelectedFields.filter(field => field !== value);
            } else {
                return [...prevSelectedFields, value];
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        axios.post('http://localhost:5002/api/fetch-course-details', {
            //comment out these 3 lines and comment the next three li nes if any error exits
            // departmentName,
            // sessionName,
            // examYear,
            departmentName: selectedDepartment,
            sessionName: selectedSession,
            examYear: selectedExamYear,
            courseName
        })
        .then(response => {
            setCourseData(response.data);
            console.log('Course Data:',response.data);
            setShowSyllabus(true);
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
        });
    };

    

    // Filter courseData to only include selected fields
    const filteredCourseData = courseData
        ? Object.keys(courseData).reduce((acc, key) => {
              if (selectedFields.includes(key)) {
                  acc[key] = courseData[key];
              }
              return acc;
          }, {})
        : {};

        // Filter combinedData based on selected department, session, and exam year
    const filteredCourses = combinedData.filter(course => 
        (!selectedDepartment || course.department_name === selectedDepartment) &&
        (!selectedSession || course.session === selectedSession) &&
        (!selectedExamYear || course.exam_year === selectedExamYear)
    );
       
       useEffect(() => {
        console.log('Filtered Courses:', filteredCourses); // Debugging
    }, [filteredCourses]);
        const uniqueDepartments = getUniqueOptions(departments, 'Dept_Name');
        const uniqueSessions = getUniqueOptions(sessions, 'Session_name');
        const uniqueExamYears = getUniqueOptions(examYears, 'Exam_year');
        const uniqueCourses = getUniqueOptions(combinedData, 'course_title');

        const orderedFields = [
            'Course_code', 
            'Couorse_credit', 
            'course_title', 
            'prerequisites', 
            'course_type', 
            'contact_hour'
        ];
        
        const downloadPDF = () => {
            const input = document.getElementById('syllabus-content');
            
            if (!input) {
                console.error('Element with ID "syllabus-content" not found.');
                return;
            }
    
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 190; // Width of the image in PDF
                const pageHeight = pdf.internal.pageSize.height;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
    
                let position = 0;
    
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
    
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
    
                pdf.save(`${courseName}_syllabus.pdf`);
            });
        };

    // Function to create rows based on selected fields
    const renderTableRows = () => {
        let rows = [];
        const numberOfRows = Math.ceil(orderedFields.length / 2);
    
        for (let i = 0; i < numberOfRows; i++) {
            const fieldsToDisplay = orderedFields.slice(i * 2, i * 2 + 2);
    
            if (fieldsToDisplay.some(field => selectedFields.includes(field))) {
                const isCourseRow = fieldsToDisplay.includes('Course_code') || fieldsToDisplay.includes('Couorse_credit');
    
                rows.push(
                    <tr key={i} style={isCourseRow ? {backgroundColor: '#ffe5b4' } : {}}>
                        {fieldsToDisplay.map(field => (
                            selectedFields.includes(field) && (
                                <React.Fragment key={field}>
                                    <td><strong>{fieldDisplayNames[field]}:</strong></td>
                                    <td>:</td>
                                    <td>{filteredCourseData[field]}</td>
                                </React.Fragment>
                            )
                        ))}
                    </tr>
                );
            }
        }
    
        return rows;
    };
    


    
    
    
    return (
        <div >
    <div className="container">
    <h1 className="text-center">Syllabus</h1>
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        
    <div className="row mb-4">
    <div className="col-md-6">
        <label className="form-label text-primary fw-bold">Department:</label>
        <select 
            className="form-select" 
            value={selectedDepartment} 
            onChange={e => setSelectedDepartment(e.target.value)} 
            required
        >
            <option value="">Select Department</option>
            {uniqueDepartments.map(department => (
                <option key={department.dept_id} value={department.Dept_Name}>
                    {department.Dept_Name}
                </option>
            ))}
        </select>
    </div>
    
    <div className="col-md-6">
        <label className="form-label text-primary fw-bold">Session:</label>
        <select 
            className="form-select" 
            value={selectedSession} 
            onChange={e => setSelectedSession(e.target.value)} 
            required
        >
            <option value="">Select Session</option>
            {uniqueSessions.map(session => (
                <option key={session.session_id} value={session.Session_name}>
                    {session.Session_name}
                </option>
            ))}
        </select>
    </div>
</div>

<div className="row mb-4">
    <div className="col-md-6">
        <label className="form-label text-primary fw-bold">Exam Year:</label>
        <select 
            className="form-select" 
            value={selectedExamYear} 
            onChange={e => setSelectedExamYear(e.target.value)} 
            required
        >
            <option value="">Select Exam Year</option>
            {uniqueExamYears.map(examYear => (
                <option key={examYear.exam_year_id} value={examYear.Exam_year}>
                    {examYear.Exam_year}
                </option>
            ))}
        </select>
    </div>

    <div className="col-md-6">
        <label className="form-label text-primary fw-bold">Course Name:</label>
        <input
            type="text"
            className={`form-control ${!selectedDepartment || !selectedSession || !selectedExamYear ? 'disabled' : ''}`}
            list="course-list"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
            disabled={!selectedDepartment || !selectedSession || !selectedExamYear}
            required
        />
        <datalist id="course-list">
            {uniqueCourses.map(course => (
                <option key={course.course_id} value={course.course_title} />
            ))}
        </datalist>
    </div>
</div>

        <div className="mb-4">
            <label className="form-label text-primary fw-bold ">Select Fields to Display:</label>
            <div className="row">
                {fields.map(field => (
                    <div key={field} className="col-3 form-check mb-2">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            value={field}
                            checked={selectedFields.includes(field)}
                            onChange={handleFieldChange}
                        />
                        <label className="form-check-label fw-bold" style={{ fontStyle: 'italic' }}>{fieldDisplayNames[field]}</label>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center">
            <button type="submit" className="btn btn-primary w-50">Fetch Syllabus</button>
        </div>
    </form>
</div>
                        

             
            {showSyllabus && filteredCourseData && (
                <div>
                    <div className="text-center m-3">
                            <Button variant="success" onClick={downloadPDF}>Download Syllabus as PDF</Button>
                        </div>
                <Card className="m-1" id="syllabus-content">
                    <Card.Body>
                <div className="mt-4">
                    <div className="text-center mt-4">
                    <div className="font-weight-bold">{selectedDepartment}</div>
                    <div>Jahangirnagar University</div>
                    <div>Syllabus for {selectedDepartment}</div>
                    <div className="mt-2">(Effective from: <strong>{selectedSession})</strong></div>
                    <div className="mt-4 mb-4 font-weight-bold"><u>Detailed Syllabus of : {courseName}</u></div>
                    </div>
                     

                   

                    {/* Table for orderedFields with conditional spanning */}
                    <div className="mb-4 mx-2">
                    <table className="table table-bordered table-striped">
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </table>
                    </div>

                    {/* Separate tables for additional fields */}
                    {selectedFields.includes('rationale') && filteredCourseData.rationale && (
                       <div className="mb-4 mx-2">
                            
                            <table className="table table-bordered table-striped">
                            <thead>
                                <th>Rationale</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{filteredCourseData.rationale}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedFields.includes('objectives') && filteredCourseData.objectives && (
                        <div className="mb-4 mx-2">
                            
                            <table className="table table-bordered table-striped">
                                <thead>
                                <th>Objectives</th>
                                </thead>
                                
                                <tbody>
                                    <tr>
                                    <td>
                                    <ul>
                                    {filteredCourseData.objectives.map((objective, index) => (
                                       
                                        <li key={index}>{objective}</li>
                                    ))}
                                    </ul>
                                    </td>
                                    </tr>
                                </tbody>
                                
                            </table>
                        </div>
                    )}
                    {selectedFields.includes('student_learning_outcomes') && filteredCourseData.student_learning_outcomes && (
                        <div className="mb-4 mx-2">
                            
                            <table className="table table-bordered table-striped">
                            <thead>
                                <th>Student Learning Outcomes</th>
                                </thead>
                                <tbody>
                                <tr>
                                <td>
                                <ul>
                    {filteredCourseData.student_learning_outcomes.map((outcome, index) => (
                                <li key={index}>{outcome}</li>
                                ))}
                                </ul>
                                </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedFields.includes('chapters') && filteredCourseData.chapters && (
                        <div className="mb-4 mx-2">
                           
                            <table className="table table-bordered table-striped">
                            <thead>
                                <th>Chapters</th>
                               
                                </thead>
                                <tbody>
                                <tr>
                                    <th className="col-1">#</th>
                                    <th className="col-11">Title and Descriptions</th>
                                </tr>
 
                                    {filteredCourseData.chapters.map((chapter, index) => (
                                        <tr key={index}>
                                            <td className="col-1"><strong>{index+1}</strong></td>
                                            <td className="col-11">{chapter}</td>
                                        </tr>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedFields.includes('recommended_books') && filteredCourseData.recommended_books && (
                        <div className="mb-4 mx-2">
                            <table className="table table-bordered table-striped">
                            <thead>
                                <th>Recommended Books</th>
                                </thead>
                                <tbody>
                                    {filteredCourseData.recommended_books.map((book, index) => (
                                        <tr key={index}>
                                        <td>{index+1}</td>   
                                        <td> {book.Book_title}</td>
                                        <td> {book.Writer}</td>
                                        <td> {book.Edition}</td>
                                        <td> {book.Publisher}</td>
                                        <td> {book.Publish_year}</td>
       
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                </Card.Body>
                </Card>
                </div> 
            )}
            </div>
          
       
    );
};

export default SyllabusFilter;