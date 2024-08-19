import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Form, Row, Col, Card } from 'react-bootstrap';

const StudentUpdate = () => {
    const { student_id } = useParams();
    // console.log(student_id);
    const [student, setStudent] = useState(null);
    const [department, setDepartment] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Gender: '',
        Class_roll: '',
        Exam_roll: '',
        Registration_no: '',
        Email: '',
        Phone: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/student-profile/${student_id}`);
                setStudent(response.data.student);
                setDepartment(response.data.department);
                setFormData({
                    Name: response.data.student.Name,
                    Gender: response.data.student.Gender,
                    Class_roll: response.data.student.Class_roll,
                    Exam_roll: response.data.student.Exam_roll,
                    Registration_no: response.data.student.Registration_no,
                    Email: response.data.student.Email,
                    Phone: response.data.student.Phone,
                });
            } catch (error) {
                console.error('Error fetching student profile:', error);
            }
        };
        fetchStudentProfile();
    }, [student_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5002/api/update-student-profile/${student_id}`, formData);
            setEditing(false);
            window.location.reload();
            // Optionally navigate to the profile page or show a success message
        } catch (error) {
            console.error('Error updating student profile:', error);
        }
    };

    if (!student) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <Card className="shadow-lg">
                <Card.Header as="h2" className="text-center">
                    {student.Name}
                </Card.Header>
                <Card.Body>
                    {!editing ? (
                        <>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Name:</strong> {student.Name}</p>
                                </Col>
                                
                                <Col sm={6}>
                                    <p><strong>Gender:</strong> {student.Gender}</p>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                            <Col sm={6}>
                                    <p><strong>Department:</strong> {department.Dept_Name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Class Roll:</strong> {student.Class_roll}</p>
                                </Col>
                                
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Registration No:</strong> {student.Registration_no}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Exam Roll:</strong> {student.Exam_roll}</p>
                                </Col>
                                
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Phone:</strong> {student.Phone}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Email:</strong> {student.Email}</p>
                                </Col>
                            </Row>
                            <Button variant="primary" onClick={handleEditToggle}>Update Profile</Button>
                        </>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group as={Row} controlId="formName" className="mb-3">
                                <Form.Label column sm={2}>Name</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formGender" className="mb-3">
                                <Form.Label column sm={2}>Gender</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        as="select"
                                        name="Gender"
                                        value={formData.Gender}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formClassRoll" className="mb-3">
                                <Form.Label column sm={2}>Class Roll</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Class_roll"
                                        value={formData.Class_roll}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formExamRoll" className="mb-3">
                                <Form.Label column sm={2}>Exam Roll</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Exam_roll"
                                        value={formData.Exam_roll}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formRegistrationNo" className="mb-3">
                                <Form.Label column sm={2}>Registration No</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Registration_no"
                                        value={formData.Registration_no}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formEmail" className="mb-3">
                                <Form.Label column sm={2}>Email</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formPhone" className="mb-3">
                                <Form.Label column sm={2}>Phone</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Phone"
                                        value={formData.Phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit">Save Changes</Button>
                            <Button variant="secondary" onClick={handleEditToggle} className="ms-2">Cancel</Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentUpdate;
