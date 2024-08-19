import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import '../../App.css';

const SessionDetails = () => {
    const { session_id } = useParams();
    const [session, setSession] = useState(null);
    const [examYears, setExamYears] = useState([]);
    const [students, setStudents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddExamYearForm, setShowAddExamYearForm] = useState(false);
    const [newExamYear, setNewExamYear] = useState({
        Year: '',
        Semester: '',
        Exam_year: '',
        Education_level: 'Undergraduate',
        Start_date: '',
        End_date: '',
        session_id: session_id,
    });
    const [newStudent, setNewStudent] = useState({
        Name: '',
        Gender: 'Male',
        session_id: session_id,
        Class_roll: '',
        Exam_roll: '',
        Registration_no: '',
        Email: '',
        Password: '',
        Phone: ''
    });
    const navigate = useNavigate();
    const defaultProfileImage = 'path/to/default-image.jpg';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                jwtDecode(token);
            } catch (error) {
                console.error('Invalid token:', error);
                navigate('/login');
                return;
            }

            const fetchSessionDetails = async () => {
                try {
                    const sessionResponse = await axios.get(`http://localhost:5002/api/sessions-byid/${session_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSession(sessionResponse.data);

                    const examYearsResponse = await axios.get(`http://localhost:5002/api/session-examyear/${session_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setExamYears(examYearsResponse.data);

                    const studentsResponse = await axios.get(`http://localhost:5002/api/session-students/${session_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStudents(studentsResponse.data);
                } catch (error) {
                    console.error('Error fetching session details:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchSessionDetails();
        } else {
            navigate('/login');
        }
    }, [session_id, navigate]);

    const handleAddFormToggle = () => setShowAddForm(!showAddForm);
    const handleAddExamYearFormToggle = () => setShowAddExamYearForm(!showAddExamYearForm);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExamYearInputChange = (e) => {
        const { name, value } = e.target;
        setNewExamYear((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5002/api/add-student', newStudent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddForm(false);
            setNewStudent({
                Name: '',
                Gender: 'Male',
                session_id: session_id,
                Class_roll: '',
                Exam_roll: '',
                Registration_no: '',
                Email: '',
                Password: '',
                Phone: ''
            });
            // Refresh student list
            const studentsResponse = await axios.get(`http://localhost:5002/api/session-students/${session_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(studentsResponse.data);
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleAddExamYear = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5002/api/add-new-examyear', newExamYear, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddExamYearForm(false);
            setNewExamYear({
                Year: '',
                Semester: '',
                Exam_year: '',
                Education_level: 'Undergraduate',
                Start_date: '',
                End_date: '',
                session_id: session_id,
            });
            // Refresh exam year list
            const examYearsResponse = await axios.get(`http://localhost:5002/api/session-examyear/${session_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExamYears(examYearsResponse.data);
        } catch (error) {
            console.error('Error adding exam year:', error);
        }
    };

    const handleDeleteStudent = async (student_id) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(`http://localhost:5002/api/delete-student/${student_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudents(prev => prev.filter(student => student.student_id !== student_id));
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleDeleteExamYear = async (exam_year_id) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(`http://localhost:5002/api/delete-examyear/${exam_year_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExamYears(prev => prev.filter(examYear => examYear.exam_year_id !== exam_year_id));
            } catch (error) {
                console.error('Error deleting exam year:', error);
            }
        } else {
            navigate('/login');
        }
    };

    if (!session) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-info text-white text-center">
                    <h4>Session: {session.Session_name}</h4>
                </Card.Header>
            </Card>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-warning text-white text-center">
                    <h4>Exam Years</h4>
                </Card.Header>
                <Card.Body>
                    <Button variant="primary" onClick={handleAddExamYearFormToggle} className="mt-3">
                        {showAddExamYearForm ? 'Cancel' : 'Add New Exam Year'}
                    </Button>
                    {showAddExamYearForm && (
                        <Form onSubmit={handleAddExamYear} className="mt-3">
                            <Form.Group controlId="formYear">
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Year"
                                    value={newExamYear.Year}
                                    onChange={handleExamYearInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formSemester">
                                <Form.Label>Semester</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Semester"
                                    value={newExamYear.Semester}
                                    onChange={handleExamYearInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formExamYear">
                                <Form.Label>Exam Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Exam_year"
                                    value={newExamYear.Exam_year}
                                    onChange={handleExamYearInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formEducationLevel">
                                <Form.Label>Education Level</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Education_level"
                                    value={newExamYear.Education_level}
                                    onChange={handleExamYearInputChange}
                                    required
                                >
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="Start_date"
                                    value={newExamYear.Start_date}
                                    onChange={handleExamYearInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="End_date"
                                    value={newExamYear.End_date}
                                    onChange={handleExamYearInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className="mt-3">
                                Add Exam Year
                            </Button>
                        </Form>
                    )}
                    <ListGroup variant="flush" className="mt-3">
                        {examYears.map((examYear) => (
                            <ListGroup.Item key={examYear.exam_year_id} className="d-flex justify-content-between align-items-center">
                                <Link to={`/examyear-details/${examYear.exam_year_id}`} className="text-decoration-none">
                                    Year {examYear.Year} - Semester {examYear.Semester} ({examYear.Exam_year})
                                </Link>
                                <Button variant="danger" onClick={() => handleDeleteExamYear(examYear.exam_year_id)}>Delete</Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="shadow-lg">
                <Card.Header className="bg-success text-white text-center">
                    <h4>Students</h4>
                </Card.Header>
                <Card.Body>
                    <Button variant="primary" onClick={handleAddFormToggle} className="mt-3">
                        {showAddForm ? 'Cancel' : 'Add New Student'}
                    </Button>
                    {showAddForm && (
                        <Form onSubmit={handleAddStudent} className="mt-3">
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Name"
                                    value={newStudent.Name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Gender"
                                    value={newStudent.Gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formClassRoll">
                                <Form.Label>Class Roll</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Class_roll"
                                    value={newStudent.Class_roll}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formExamRoll">
                                <Form.Label>Exam Roll</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Exam_roll"
                                    value={newStudent.Exam_roll}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formRegistrationNo">
                                <Form.Label>Registration No</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Registration_no"
                                    value={newStudent.Registration_no}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    value={newStudent.Email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="Password"
                                    value={newStudent.Password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Phone"
                                    value={newStudent.Phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" className="mt-3">
                                Add Student
                            </Button>
                        </Form>
                    )}
                    <ListGroup variant="flush" className="mt-3">
                        {students.map((student) => (
                            <ListGroup.Item key={student.student_id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Link to={`/student-update/${student.student_id}`} className="text-decoration-none">{student.Name}</Link>
                                    <span className="text-muted ml-2">({student.Class_roll})</span>
                                </div>
                                <Button variant="danger" onClick={() => handleDeleteStudent(student.student_id)}>Delete</Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SessionDetails;
