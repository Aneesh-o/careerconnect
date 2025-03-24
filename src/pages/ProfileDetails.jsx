import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header';
import { Container, Row, Col, Card, ListGroup, Nav, Button } from 'react-bootstrap';
import { Envelope, Telephone, GenderFemale, CalendarDate, GeoAlt, Building, Award, Calendar, Briefcase } from 'react-bootstrap-icons';
import { getParticularUserDetails } from '../services/allApi';
import { useParams } from 'react-router-dom';
import { IsEmployeeStatusContext } from '../Contexts/ContextApi';
import serverUrl from '../services/serverUrl';
import { FaDownload } from "react-icons/fa";

const ProfileDetails = () => {
    const { id } = useParams();
    const [jobSeekerProfileDetails, setJobSeekerProfileDetails] = useState({});
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)


    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            const userData = JSON.parse(sessionStorage.getItem("user"));
            setIsEmployee(userData.role === "Employer");
        }
    }, []);


    useEffect(() => {
        getUsersDetails();
    }, [id]); // 

    const getUsersDetails = async () => {
        if (!id) {
            alert("User details not found");
            return;
        }
        try {
            const result = await getParticularUserDetails(id);
            console.log(result);
            if (result.status === 200) {
                setJobSeekerProfileDetails(result.data);
            } else if (result.status === 404) {
                alert(result.response.data);
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    return (
        <>
            <div style={{ backgroundColor: '#0A3321', color: 'white' }}>
                <Header isEmployee={true} />
            </div>
            <Container fluid className="bg-light p-3">
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        {/* Profile header */}
                        <div className="d-flex p-3 align-items-center border-bottom">
                            <div className="d-flex align-items-center mb-1">
                                <img style={{ width: '50px', borderRadius: '50%' }} src={`${serverUrl}/uploads/${jobSeekerProfileDetails?.profilePic}`} alt="" />
                                <h5 className="mb-0 mx-2">{jobSeekerProfileDetails.username || "N/A"}</h5>
                            </div>
                            <div className="ms-auto d-flex">
                                <Button variant="light" className="me-2 rounded-circle">
                                    <a target='blank' href={`${serverUrl}/uploads/${jobSeekerProfileDetails.resume}`}
                                        download
                                        style={{ textDecoration: "none", color: "inherit" }}>
                                        Download Resume <FaDownload />
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <Row className="g-0">
                            <Col md={8} className="border-end">
                                {/* Navigation tabs */}
                                <Nav variant="tabs" defaultActiveKey="job-application" className="px-3 border-bottom">
                                    <Nav.Item>
                                        <Nav.Link eventKey="job-application" className="d-flex align-items-center py-2">
                                            <Briefcase size={18} className="me-2" />
                                            Experience
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                {/* Hiring Process */}
                                <div className="p-3">
                                    <Row className="g-3 text-muted small">
                                        <Col md={4}>
                                            <div>Experience in Years</div>
                                            <div className="fw-bold text-dark">{jobSeekerProfileDetails.experienceInYears || "Nill"}</div>
                                        </Col>
                                        <Col md={4}>
                                            <div>Current Employer</div>
                                            <div className="fw-bold text-dark">{jobSeekerProfileDetails.currentEmployer || "Nill"}</div>
                                        </Col>
                                        <Col md={4}>
                                            <div>Current Salary</div>
                                            <div className="fw-bold text-dark">{jobSeekerProfileDetails.currentSalary || "Nill"}</div>
                                        </Col>
                                        <Col md={4}>
                                            <div>Expected Salary</div>
                                            <div className="fw-bold text-dark">{jobSeekerProfileDetails.expectedSalary || "Nill"}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            {/* Right Sidebar */}
                            <Col md={4}>
                                <div className="p-3">
                                    <div className='d-flex justify-content-between'>
                                        <h5 className="mb-3">Personal Information</h5>
                                    </div>
                                    <ListGroup variant="flush" className="mb-4">
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <Envelope className="me-2 text-muted" />
                                            <span className="text-muted me-2">Email Address</span>
                                            <span className="ms-auto bg-light rounded px-2 py-1 small">{jobSeekerProfileDetails.email || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <Telephone className="me-2 text-muted" />
                                            <span className="text-muted me-2">Phone Number</span>
                                            <span className="ms-auto bg-light rounded px-2 py-1 small">{jobSeekerProfileDetails.phoneNumber || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <GenderFemale className="me-2 text-muted" />
                                            <span className="text-muted me-2">Gender</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.gender || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <CalendarDate className="me-2 text-muted" />
                                            <span className="text-muted me-2">Birthdate</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.birthDate || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <GeoAlt className="me-2 text-muted" />
                                            <span className="text-muted me-2">Living Address</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.address || "Nill"}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <h5 className="mb-3">Education Information</h5>
                                    <ListGroup variant="flush" className="mb-4">
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <Building className="me-2 text-muted" />
                                            <span className="text-muted me-2">University</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.university || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <Award className="me-2 text-muted" />
                                            <span className="text-muted me-2">Qualification Held</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.qualification || "Nill"}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                            <Calendar className="me-2 text-muted" />
                                            <span className="text-muted me-2">Year Graduation</span>
                                            <span className="ms-auto">{jobSeekerProfileDetails.yearOfGraduation || "Nill"}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ProfileDetails;
