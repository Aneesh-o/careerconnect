import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { IsEmployeeStatusContext } from '../Contexts/ContextApi'
import { Container, Row, Col, Form, InputGroup, Button, Image, ListGroup } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import { getAllEmployers, getMessage, getUserDetails, sendMessage } from '../services/allApi';
import { useParams } from 'react-router-dom';
import serverUrl from '../services/serverUrl';
import { io } from "socket.io-client";


const Chat = () => {
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)

    const socket = io(serverUrl);

    const [message, setMessage] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onMessageSent, setOnMessageSent] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            const userData = JSON.parse(sessionStorage.getItem("user"))
            if (userData.role == "Employer") {
                setIsEmployee(true)
            } else {
                setIsEmployee(false)
            }
        }
    }, [])

    useEffect(() => {
        fetchAllUsersAndEmployers()
    }, [])

    useEffect(() => {
        getMessages();
    }, [selectedUser, onMessageSent]);


    const fetchAllUsersAndEmployers = async () => {
        if (sessionStorage.getItem("token")) {
            try {
                const [usersResult, employersResult] = await Promise.all([
                    getUserDetails(),      // Fetch users
                    getAllEmployers()      // Fetch employers
                ]);

                if (usersResult.status === 200 && employersResult.status === 200) {
                    // Merge both arrays
                    const combinedData = [...usersResult.data, ...employersResult.data];

                    // Store merged data in userDetails
                    setUserDetails(combinedData);
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
        try {
            if (!selectedUser || !selectedUser._id) {
                alert("Please select a user before sending a message.");
                return;
            }

            const newMessage = {
                senderId: id,
                receiverId: selectedUser._id,
                message: message.trim(),
                createdAt: new Date().toISOString(),
            };

            if (!newMessage.message) {
                alert("Message cannot be empty.");
                return;
            }

            const result = await sendMessage(newMessage);
            console.log(result);

            if (result.status === 201) {
                setMessage('');

                setMessages((prevMessages) => [...prevMessages, newMessage]);

                if (typeof socket !== "undefined") {
                    socket.emit("send", newMessage);
                } else {
                    console.warn("Socket is not defined");
                }
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    const getMessages = async () => {
        try {
            if (!selectedUser || !selectedUser._id) {
                console.log("selectedUser is null or undefined");
                return;
            }
            const reqBody = {
                senderId: id,
                recieverId: selectedUser._id
            };
            const result = await getMessage(reqBody);
            if (result.status === 200) {
                setMessages(result.data);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const formatTime = (timestamp) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };



    return (
        <>
            <Header isEmployee={isEmployee} />
            <Container fluid className="p-0 d-flex" style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
                {/* UseresList */}
                <div style={{ width: "300px", borderRight: "1px solid #ddd", backgroundColor: "white" }}>
                    <div className="p-3 border-bottom">
                        <h5 className="mb-0">Chats</h5>
                    </div>
                    <ListGroup variant="flush">
                        {userDetails.length > 0 ? (
                            userDetails
                                .filter(item => item._id !== id)
                                .map((item) => (
                                    <ListGroup.Item key={item._id} action className={`border-0 py-3 ${selectedUser?._id === item._id ? "bg-light" : ""}`} onClick={() => setSelectedUser(item)}>
                                        <div className="d-flex align-items-center">
                                            <Image src={item?.profilePic ? `${serverUrl}/uploads/${item.profilePic}`
                                                : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} roundedCircle width={50} height={50} className="me-3" />
                                            <h6 className="mb-0">{item.username ? item.username : item.companyname}</h6>
                                        </div>
                                    </ListGroup.Item>
                                ))
                        ) : (
                            <div className="p-3">No Users available</div>
                        )}
                    </ListGroup>
                </div>
                {/* Chat Area */}
                <div className="flex-grow-1 d-flex flex-column">
                    {selectedUser ? (
                        <div className="d-flex align-items-center p-3 border-bottom bg-white">
                            <Image
                                src={selectedUser?.profilePic ? `${serverUrl}/uploads/${selectedUser.profilePic}` : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} roundedCircle width={40} height={40} className="me-2" />
                            <div>
                                <h6 className="mb-0">{selectedUser.username}</h6>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center p-3 border-bottom bg-white">
                            <h6 className="mb-0 text-muted">Select a user to chat</h6>
                        </div>
                    )}

                    {/* Messages Section */}
                    <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: "#f5f5f5" }}>
                        {messages.length > 0 ? (
                            messages.map((msg, index) => {
                                const isSender = msg.senderId === id;
                                return (
                                    <Row key={index} className={`flex mt-4 flex-col ${isSender ? "items-end" : "items-start"}`}>
                                        {!isSender && (
                                            <Col xs="auto" className="pe-0">
                                                <Image
                                                    src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg"
                                                    roundedCircle
                                                    width={36}
                                                    height={36}
                                                />
                                            </Col>
                                        )}
                                        <Col xs={9} className={isSender ? "text-end" : ""}>
                                            <div className="p-2 px-3 rounded"
                                                style={{ backgroundColor: isSender ? "#00A0DC" : "white", color: isSender ? "white" : "black", borderRadius: "18px", display: "inline-block", }}> {msg.message}
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</span>
                                        </Col>
                                    </Row>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">Start your conversation...</p>
                        )}
                    </div>

                    {/* Input Area */}
                    {selectedUser && (
                        <div className="p-3 bg-white">
                            <Form>
                                <InputGroup>
                                    <Form.Control
                                        onChange={(e) => setMessage(e.target.value)}
                                        value={message}
                                        type="text"
                                        placeholder="Type a message here..."
                                    />
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
    )
}

export default Chat