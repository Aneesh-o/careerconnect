import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header';
import { IsEmployeeStatusContext } from '../Contexts/ContextApi';
import { Container, Row, Col, Form, InputGroup, Button, Image, ListGroup } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import { getAllEmployers, getMessage, getUserDetails, sendMessage } from '../services/allApi';
import { useParams } from 'react-router-dom';
import serverUrl from '../services/serverUrl';
import { io } from "socket.io-client";

const Chat = () => {
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext);
    const [message, setMessage] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { id } = useParams();
    const socket = io(serverUrl);
    // console.log(messages)
    useEffect(() => {
    //     setSocket(socket);
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        socket.emit("register", id)
    }, [])

    useEffect(() => {
        socket.on("receive", (newMessage) => {
            // console.log("hi")
            // newMessage.createdAt = Date.now()
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => socket.off("receive");
    }, [selectedUser]);

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            const userData = JSON.parse(sessionStorage.getItem("user"));
            setIsEmployee(userData.role === "Employer");
        }
    }, [setIsEmployee]);

    useEffect(() => {
        fetchAllUsersAndEmployers();
    }, []);

    // ✅ Define getMessages function BEFORE using it inside useEffect
    const getMessages = async () => {
        try {
            if (!selectedUser || !selectedUser._id) return;
            const result = await getMessage({ senderId: id, receiverId: selectedUser._id });
            setMessages(result.status === 200 ? result.data.messages : []);
        } catch (error) {
            console.log(error);
        }
    };

    // 🔹 useEffect to fetch messages when a user is selected
    useEffect(() => {
        if (selectedUser) {
            getMessages();
        }
    }, [selectedUser]);

    const fetchAllUsersAndEmployers = async () => {
        if (sessionStorage.getItem("token")) {
            try {
                const [usersResult, employersResult] = await Promise.all([
                    getUserDetails(),
                    getAllEmployers()
                ]);
                if (usersResult.status === 200 && employersResult.status === 200) {
                    setUserDetails([...usersResult.data, ...employersResult.data]);
                } else {
                    alert("Failed to fetch user or employer details");
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Authentication failed...please login");
        }
    };

    const handleSendMessage = async () => {
        if (!selectedUser || !selectedUser._id || !message.trim()) return;

        const newMessage = {
            senderId: id,
            receiverId: selectedUser._id,
            message: message.trim(),
            createdAt: new Date().toISOString(),
        };

        try {
            const result = await sendMessage(newMessage);
            if (result.status === 201) {
                setMessage('');
                // setMessages(prev => [...prev, newMessage]);
                getMessages()
                socket.emit("send", newMessage);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <>
            <Header isEmployee={isEmployee} />
            <Container fluid className="p-0 d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
                <div style={{ width: "300px", borderRight: "1px solid #ddd", backgroundColor: "white" }}>
                    <div className="p-3 border-bottom">
                        <h5 className="mb-0">Chats</h5>
                    </div>
                    <ListGroup variant="flush">
                        {userDetails.filter(item => item._id !== id).map((item) => (
                            <ListGroup.Item key={item._id} action className={`border-0 py-3 ${selectedUser?._id === item._id ? "bg-light" : ""}`} onClick={() => setSelectedUser(item)}>
                                <div className="d-flex align-items-center">
                                    <Image src={item.profilePic ? `${serverUrl}/uploads/${item.profilePic}` : "default_profile.jpg"} roundedCircle width={50} height={50} className="me-3" />
                                    <h6 className="mb-0">{item.username || item.companyname}</h6>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div className="flex-grow-1 d-flex flex-column">
                    {selectedUser ? (
                        <div className="d-flex align-items-center p-3 border-bottom bg-white">
                            <h6 className="mb-0">{selectedUser.username}</h6>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center p-3 border-bottom bg-white">
                            <h6 className="mb-0 text-muted">Select a user to chat</h6>
                        </div>
                    )}
                    <div className="flex-grow-1 p-3 overflow-auto bg-light">
                        {messages.map((msg, index) => (
                            <Row key={index} className={`d-flex mt-2 ${msg.senderId === id ? "justify-content-end" : "justify-content-start"}`}>
                                <Col xs="auto">
                                    <div className={`p-2 rounded ${msg.senderId === id ? "bg-primary text-white" : "bg-white text-dark"}`} style={{ borderRadius: "18px" }}>
                                        {msg.message}
                                    </div>
                                    <small className="text-muted d-block text-end">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </Col>
                            </Row>
                        ))}
                    </div>
                    {selectedUser && (
                        <div className="p-3 bg-white">
                            <Form>
                                <InputGroup>
                                    <Form.Control value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message here..." />
                                    <Button onClick={handleSendMessage} variant="primary">
                                        <FiSend />
                                    </Button>
                                </InputGroup>
                            </Form>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default Chat;
