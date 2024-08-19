import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

import '../../App.css';

const DepartmentDetails = () => {
    const { dept_id } = useParams();
    const [designations, setDesignations] = useState([]);
    const [department, setDepartment] = useState(null);
    const [chairman, setChairman] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [examYears, setExamYears] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [staff, setStaff] = useState([]);
    const [showAddRoomForm, setShowAddRoomForm] = useState(false);
    const [newRoom, setNewRoom] = useState({ Room_no: '', Room_type: '', Capacity: '' });
    const [roomTypes, setRoomTypes] = useState([]);
    const [showChairmanForm, setShowChairmanForm] = useState(false);
    const [selectedChairman, setSelectedChairman] = useState('');

    const [showAddStaffForm, setShowAddStaffForm] = useState(false);
    const [newStaff, setNewStaff] = useState({ Name: '', Role: '', Email: '', Phone: '', Password: '' });

    const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        Name: '',
        Designation: '',
        Email: '',
        Phone: '',
        Password: '',
        Abvr: ''
    });

    const [showAddSessionForm, setShowAddSessionForm] = useState(false);
    const [newSession, setNewSession] = useState({
        Session_name: ''
    });

    const navigate = useNavigate();
    const defaultProfileImage = '/files/images/Default_Profile_Image.png';

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

            const fetchDesignations = async () => {
                try {
                    const response = await axios.get('http://localhost:5002/api/teacher-designations', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setDesignations(response.data);
                } catch (error) {
                    console.error('Failed to fetch designations:', error);
                }
            };

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

                    const sessionsResponse = await axios.get(`http://localhost:5002/api/department-sessions/${dept_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSessions(sessionsResponse.data);

                } catch (error) {
                    console.error('Error fetching department details:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchDesignations();
            fetchDepartmentDetails();
        } else {
            navigate('/login');
        }
    }, [dept_id, navigate]);

    const handleDelete = async (room_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-department-room/${room_id}`);
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
            await axios.post(`http://localhost:5002/api/add-department-room/${dept_id}`, newRoom);
            setRooms([]);
            const roomsResponse = await axios.get(`http://localhost:5002/api/department-room/${dept_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRooms(roomsResponse.data);
            setNewRoom({ Room_no: '', Room_type: '', Capacity: '' });
            setShowAddRoomForm(false);
        } catch (error) {
            console.error('Failed to add room:', error);
        }
    };

    const handleChairmanToggle = () => {
        setShowChairmanForm(!showChairmanForm);
    };

    const handleChairmanChange = (e) => {
        setSelectedChairman(e.target.value);
    };

    const handleChairmanSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send PUT request to update department chairman
            await axios.put(`http://localhost:5002/api/update-department-chairman/${dept_id}`, { teacher_id: selectedChairman });

            // Update local state to reflect the new chairman
            setChairman(teachers.find(teacher => teacher.teacher_id === selectedChairman));

            // Close the form
            setShowChairmanForm(false);
        } catch (error) {
            console.error('Failed to update chairman:', error);
        }
    };

    const handleAddStaffToggle = () => {
        setShowAddStaffForm(!showAddStaffForm);
    };

    const handleStaffInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddStaffSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5002/api/add-department-staff/${dept_id}`, newStaff);
            setStaff([]);
            const staffResponse = await axios.get(`http://localhost:5002/api/department-staff/${dept_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStaff(staffResponse.data);
            setNewStaff({ Name: '', Role: '', Email: '', Phone: '', Password: '' });
            setShowAddStaffForm(false);
        } catch (error) {
            console.error('Failed to add staff:', error);
        }
    };

    const handleDeleteStaff = async (staff_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-department-staff/${staff_id}`);
            setStaff(staff.filter(staffMember => staffMember.staff_id !== staff_id));
        } catch (error) {
            console.error('Failed to delete staff:', error);
        }
    };


    const handleAddTeacherToggle = () => {
        setShowAddTeacherForm(!showAddTeacherForm);
    };

    const handleTeacherInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeacher((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTeacherSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5002/api/add-teacher/${dept_id}`, newTeacher);
            // Refresh teacher list after adding
            const teachersResponse = await axios.get(`http://localhost:5002/api/department-teacher/${dept_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTeachers(teachersResponse.data);
            setNewTeacher({ Name: '', Designation: '', Email: '', Phone: '', Password: '', Abvr: '' });
            setShowAddTeacherForm(false);
        } catch (error) {
            console.error('Failed to add teacher:', error);
        }
    };

    const handleDeleteTeacher = async (teacher_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-teacher/${teacher_id}`);
            setTeachers(teachers.filter(teacher => teacher.teacher_id !== teacher_id));
        } catch (error) {
            console.error('Failed to delete teacher:', error);
        }
    };


    const handleAddSessionToggle = () => {
        setShowAddSessionForm(!showAddSessionForm);
    };

    const handleSessionInputChange = (e) => {
        const { name, value } = e.target;
        setNewSession((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleAddSessionSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5002/api/add-department-session/${dept_id}`, newSession);
            // Refresh session list after adding
            const sessionsResponse = await axios.get(`http://localhost:5002/api/department-sessions/${dept_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSessions(sessionsResponse.data);
            setNewSession({ Session_name: '' });
            setShowAddSessionForm(false);
        } catch (error) {
            console.error('Failed to add Session:', error);
        }
    };

    const handleDeleteSession = async (session_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-department-session/${session_id}`);
            setSessions(sessions.filter(session => session.session_id !== session_id));
        } catch (error) {
            console.error('Failed to delete session:', error);
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
                        <Button variant="info" onClick={handleChairmanToggle} className="mt-3">
                            {showChairmanForm ? 'Cancel' : 'Change Chairman'}
                        </Button>
                        {showChairmanForm && (
                            <Form onSubmit={handleChairmanSubmit} className="mt-3">
                                <Form.Group as={Row} controlId="formChairman">
                                    <Form.Label column sm={2}>Select Chairman</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control
                                            as="select"
                                            value={selectedChairman}
                                            onChange={handleChairmanChange}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                                    {teacher.Name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" type="submit">Update Chairman</Button>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            )}

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-secondary text-white text-center">
                    <h4>Teachers</h4>
                </Card.Header>
                <Card.Body>
                    {showAddTeacherForm ? (
                        <Form onSubmit={handleAddTeacherSubmit} className="">
                            <Form.Group controlId="formTeacherName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Name"
                                    value={newTeacher.Name}
                                    onChange={handleTeacherInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formTeacherDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Designation"
                                    value={newTeacher.Designation}
                                    onChange={handleTeacherInputChange}
                                    required
                                >
                                    <option value="">Select designation</option>
                                    {designations.map((designation, index) => (
                                        <option key={index} value={designation}>
                                            {designation}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formTeacherEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    value={newTeacher.Email}
                                    onChange={handleTeacherInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formTeacherPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Phone"
                                    value={newTeacher.Phone}
                                    onChange={handleTeacherInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formTeacherPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="Password"
                                    value={newTeacher.Password}
                                    onChange={handleTeacherInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formTeacherAbvr">
                                <Form.Label>Abvr</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Abvr"
                                    value={newTeacher.Abvr}
                                    onChange={handleTeacherInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-2">
                                Add Teacher
                            </Button>
                            <Button variant="secondary" onClick={handleAddTeacherToggle} className="ms-2 mt-2">Cancel</Button>
                        </Form>
                    ) : (
                        <Button variant="primary" onClick={handleAddTeacherToggle} className="mt-4">Add New Teacher</Button>
                    )}

                    <ListGroup variant="flush" className='mt-3'>
                        {teachers.map(teacher => (
                            <ListGroup.Item key={teacher.teacher_id} className="d-flex justify-content-between align-items-center">
                                <Link to={`/teacher-profile/${teacher.teacher_id}`} className="text-decoration-none">
                                    <div>
                                        <img

                                            src={teacher?.profileImage ? `http://localhost:5004${teacher.profileImage}` : defaultProfileImage}
                                            alt={teacher.Name}
                                            className="rounded-circle me-3"
                                            width="80"
                                            height="80"
                                        />
                                        {teacher.Name} ({teacher.Designation})
                                    </div>
                                </Link>

                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteTeacher(teacher.teacher_id)}
                                >
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>


                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-secondary text-white text-center">
                    <h4>Department Sessions</h4>
                    
                </Card.Header>
                <Card.Body>
                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={handleAddSessionToggle}
                    >
                        {showAddSessionForm ? 'Cancel' : 'Add New Session'}
                    </Button>
                    
                    {showAddSessionForm && (
                        <Form onSubmit={handleAddSessionSubmit} className="mt-3">
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="sessionName">
                                        <Form.Label>Session Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Session_name"
                                            value={newSession.Session_name}
                                            onChange={handleSessionInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit" className="mt-3">
                                Add Session
                            </Button>
                            <Button variant="secondary" onClick={handleAddSessionToggle} className="ms-2 mt-3">
                                Cancel
                            </Button>
                        </Form>
                    )}
                    <ListGroup variant="flush" className="mt-3">
                        {sessions.map((session) => (
                            <ListGroup.Item
                                key={session.session_id}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <Link to={`/session-details/${session.session_id}`} className="text-decoration-none">
                                    {session.Session_name}
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSession(session.session_id)}
                                >
                                    Delete
                                </Button>
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
                                {/* <span>{room.Room_no}</span> */}
                                <Link to={`/edit-room/${room.room_id}`} className="text-decoration-none">
                                    {room.Room_no}
                                </Link>
                                <span>{room.Room_type} (Capacity: {room.Capacity})</span>
                                <div>
                                    {/* <Link to={`/edit-room/${room.room_id}`} className="btn btn-outline-primary btn-sm me-2">
                                        Edit
                                    </Link> */}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(room.room_id)}>
                                        Delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-light text-dark text-center">
                    <h4>Staff</h4>
                </Card.Header>
                <Card.Body>
                    {showAddStaffForm ? (
                        <Form onSubmit={handleAddStaffSubmit} className="mb-4">
                            <Form.Group as={Row} controlId="formStaffName" className='my-3' >
                                <Form.Label column sm={2}>Name</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Name"
                                        value={newStaff.Name}
                                        onChange={handleStaffInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formStaffRole" className='my-3'>
                                <Form.Label column sm={2}>Role</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Role"
                                        value={newStaff.Role}
                                        onChange={handleStaffInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formStaffEmail" className='my-3'>
                                <Form.Label column sm={2}>Email</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="email"
                                        name="Email"
                                        value={newStaff.Email}
                                        onChange={handleStaffInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formStaffPhone" className='my-3'>
                                <Form.Label column sm={2}>Phone</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Phone"
                                        value={newStaff.Phone}
                                        onChange={handleStaffInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formStaffPassword" className='my-3'>
                                <Form.Label column sm={2}>Password</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="password"
                                        name="Password"
                                        value={newStaff.Password}
                                        onChange={handleStaffInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit">Add Staff</Button>
                            <Button variant="secondary" onClick={handleAddStaffToggle} className="ms-2">Cancel</Button>
                        </Form>
                    ) : (
                        <Button variant="primary" onClick={handleAddStaffToggle} className="mb-4">
                            Add New Staff
                        </Button>
                    )}
                    <ListGroup variant="flush">
                        {staff.map(staffMember => (
                            <ListGroup.Item key={staffMember.staff_id} className="d-flex justify-content-between align-items-center">
                                <Link to={`/edit-staff-profile/${staffMember.staff_id}`} className="text-decoration-none">
                                    {staffMember.Name}
                                </Link>
                                <span>{staffMember.Role}</span>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteStaff(staffMember.staff_id)}>
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

        </Container>
    );
};

export default DepartmentDetails;
