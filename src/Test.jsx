import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

import '../../App.css';

const DepartmentDetails = () => {
    const { dept_id } = useParams();
    const [department, setDepartment] = useState(null);
    const [chairman, setChairman] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [examYears, setExamYears] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [staff, setStaff] = useState([]);
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [newRoom, setNewRoom] = useState({ Room_no: '', Room_type: '', Capacity: '' });
    const [roomTypes, setRoomTypes] = useState([]);
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

            const fetchDepartmentDetails = async () => {
                try {
                    const departmentResponse = await axios.get(`http://localhost:5002/api/department/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDepartment(departmentResponse.data);

                    const chairmanResponse = await axios.get(`http://localhost:5002/api/department-chairman/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setChairman(chairmanResponse.data);

                    const teachersResponse = await axios.get(`http://localhost:5002/api/department-teacher/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTeachers(teachersResponse.data);

                    const examYearsResponse = await axios.get(`http://localhost:5002/api/department-examyear/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setExamYears(examYearsResponse.data);

                    const roomsResponse = await axios.get(`http://localhost:5002/api/department-room/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRooms(roomsResponse.data);

                    const staffResponse = await axios.get(`http://localhost:5002/api/department-staff/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStaff(staffResponse.data);

                    const roomTypesResponse = await axios.get('http://localhost:5002/api/room-types', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRoomTypes(roomTypesResponse.data);

                } catch (error) {
                    console.error('Error fetching department details:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchDepartmentDetails();
        } else {
            navigate('/login');
        }
    }, [dept_id, navigate]);

    const handleDelete = async (room_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/department-room/${room_id}`);
            setRooms(rooms.filter(room => room.room_id !== room_id)); // Update state to remove the deleted room
        } catch (error) {
            console.error('Failed to delete room:', error);
        }
    };

    const handleAddRoomToggle = () => {
        setShowAddRoomForm(!showAddRoomForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddRoomSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5002/api/department-room/${dept_id}`, newRoom);
            setRooms([...rooms, newRoom]);
            setNewRoom({ Room_no: '', Room_type: '', Capacity: '' });
            setShowAddRoomForm(false);
        } catch (error) {
            console.error('Failed to add room:', error);
        }
    };

    if (!department) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">{department.Dept_Name}</h2>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-info text-white text-center">
                    <h4>Department Details</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Description:</strong> {department.Descript}</p>
                            <p><strong>Email:</strong> {department.Email}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Fax:</strong> {department.Fax}</p>
                            <p><strong>Phone:</strong> {department.Phone}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {chairman && (
                <Card className="mb-4 shadow-lg">
                    <Card.Header className="bg-primary text-white text-center">
                        <h4>Department Chairman</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4} className="text-center">
                                <div className="position-relative">
                                    <img
                                        src={chairman?.profileImage ? `http://localhost:5004${chairman.profileImage}` : defaultProfileImage}
                                        alt="Profile"
                                        width="250"
                                        className="img-thumbnail"
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="text-center">
                                <Row>
                                    <p>{chairman.Name}</p>
                                </Row>
                                <Row>
                                    <p>{chairman.Designation}</p>
                                </Row>
                                <Row>
                                    <p>{department.Dept_Name}</p>
                                </Row>
                                <Row>
                                    <p>{chairman.Email}</p>
                                </Row>
                                <Row>
                                    <p>{chairman.Phone}</p>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-secondary text-white text-center">
                    <h4>Teachers</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {teachers.map(teacher => (
                            <ListGroup.Item key={teacher.teacher_id} className="d-flex justify-content-between align-items-center">
                                <Link to={`/teacher-profile/${teacher.teacher_id}`} className="text-decoration-none">
                                    {teacher.Name}
                                </Link>
                                <span className="badge bg-dark">{teacher.Designation}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-warning text-white text-center">
                    <h4>Exam Years</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {examYears.map(examYear => (
                            <ListGroup.Item key={examYear.exam_year_id} className="d-flex justify-content-between align-items-center">
                                <Link to={`/exam-year/${examYear.exam_year_id}`} className="text-decoration-none">
                                    Year {examYear.Year} Semester {examYear.Semester} - {examYear.Exam_year}
                                </Link>
                                <span>{examYear.Education_level}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-info text-white text-center">
                    <h4>Rooms</h4>
                </Card.Header>
                <Card.Body>
                    {showAddRoomForm ? (
                        <Form onSubmit={handleAddRoomSubmit} className="mb-4">
                            <Form.Group as={Row} controlId="formRoomNumber">
                                <Form.Label column sm={2}>Room Number</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Room_no"
                                        value={newRoom.Room_no}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formRoomType">
                                <Form.Label column sm={2}>Room Type</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        as="select"
                                        name="Room_type"
                                        value={newRoom.Room_type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Room Type</option>
                                        {roomTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formCapacity">
                                <Form.Label column sm={2}>Capacity</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="number"
                                        name="Capacity"
                                        value={newRoom.Capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit">Add Room</Button>
                            <Button variant="secondary" onClick={handleAddRoomToggle} className="ms-2">Cancel</Button>
                        </Form>
                    ) : (
                        <Button variant="primary" onClick={handleAddRoomToggle} className="mb-4">
                            Add New Room
                        </Button>
                    )}
                    <ListGroup variant="flush">
                        {rooms.map(room => (
                            <ListGroup.Item key={room.room_id} className="d-flex justify-content-between align-items-center">
                                <span>{room.Room_no}</span>
                                <span>{room.Room_type} (Capacity: {room.Capacity})</span>
                                <div>
                                    <Link to={`/edit-room/${room.room_id}`} className="btn btn-outline-primary btn-sm me-2">
                                        Edit
                                    </Link>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(room.room_id)}>
                                        Delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="shadow-lg">
                <Card.Header className="bg-danger text-white text-center">
                    <h4>Staff</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {staff.map(staffMember => (
                            <ListGroup.Item key={staffMember.staff_id} className="d-flex justify-content-between align-items-center">
                                <span>{staffMember.Name}</span>
                                <span>{staffMember.Role}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DepartmentDetails;
