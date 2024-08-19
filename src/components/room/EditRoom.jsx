import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const EditRoom = () => {
    const { room_id } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const navigate = useNavigate();
    // console.log(room_id)

    useEffect(() => {
        const fetchRoomData = async () => {
            console.log(room_id);
            try {
                const response = await axios.get(`http://localhost:5002/api/department-room-by-roomid/${room_id}`);
                setRoomData(response.data);
                console.log('Fetched Room Data:', response.data);
            } catch (error) {
                console.error('Failed to fetch room data:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/room-types');
                setRoomTypes(response.data);
                console.log('Fetched Room Types:', response.data);
            } catch (error) {
                console.error('Failed to fetch room types:', error);
            }
        };

        fetchRoomData();
        fetchRoomTypes();
    }, [room_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5002/api/department-room/${room_id}`, roomData);
            navigate(`/department-details/${roomData.dept_id}`);
        } catch (error) {
            console.error('Failed to update room:', error);
        }
    };

    if (!roomData || roomTypes.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h2>Edit Room</h2>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group as={Row} controlId="formRoomNumber">
                    <Form.Label column sm={2}>Room Number</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="Room_no"
                            value={roomData.Room_no}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formRoomType">
                    <Form.Label column sm={2}>Room Type</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            as="select"
                            name="Room_type"
                            value={roomData.Room_type}
                            onChange={handleInputChange}
                        >
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
                            value={roomData.Capacity}
                            onChange={handleInputChange}
                        />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">Update Room</Button>
            </Form>
        </Container>
    );
};

export default EditRoom;
