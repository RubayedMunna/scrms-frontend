import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Form, Row, Col, Card } from 'react-bootstrap';

const EditStaffProfile = () => {
    const { staff_id } = useParams();
    console.log(staff_id);
    const [staff, setStaff] = useState(null);
    const [editing, setEditing] = useState(false);
    const [department, setDepartment] = useState(null);
    const [formData, setFormData] = useState({
        Name: '',
        Role: '',
        Email: '',
        Phone: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaffProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5002/api/staff-profile/${staff_id}`);
                setStaff(response.data.staff);
                setDepartment(response.data.department);

                setFormData({
                    Name: response.data.staff.Name,
                    Role: response.data.staff.Role,
                    Email: response.data.staff.Email,
                    Phone: response.data.staff.Phone,
                });
            } catch (error) {
                console.error('Error fetching staff profile:', error);
            }
        };
        fetchStaffProfile();
    }, [staff_id]);

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
            await axios.put(`http://localhost:5002/api/update-staff-profile/${staff_id}`, formData);
            setEditing(false);
            window.location.reload();
            // Optionally navigate to the profile page or show a success message
        } catch (error) {
            console.error('Error updating staff profile:', error);
        }
    };

    if (!staff) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <Card className="shadow-lg">
                <Card.Header as="h2" className="text-center">
                    {staff.Name}
                </Card.Header>
                <Card.Body>
                    {!editing ? (
                        <>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Name:</strong> {staff.Name}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Role:</strong> {staff.Role}</p>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Department:</strong> {department}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Phone:</strong> {staff.Phone}</p>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <p><strong>Email:</strong> {staff.Email}</p>
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
                            <Form.Group as={Row} controlId="formRole" className="mb-3">
                                <Form.Label column sm={2}>Role</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="Role"
                                        value={formData.Role}
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

export default EditStaffProfile;
