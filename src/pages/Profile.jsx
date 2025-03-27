import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Card, ListGroup, Button, Nav, Form, } from 'react-bootstrap';
import { ThreeDots, Envelope, Telephone, GenderFemale, CalendarDate, GeoAlt, Building, Award, Calendar, PencilSquare, Briefcase, Share } from 'react-bootstrap-icons';
import Header from '../Components/Header';
import JobCard from '../Components/JobCard';
import Footer from '../Components/Footer';
import AddJob from '../Components/AddJob';
import JobSeekerDetails from '../Components/JobSeekerDetails';
import { employerDetailsContext, IsEmployeeStatusContext, profileDetailsContext } from '../Contexts/ContextApi';
import { employerAcDetails, getUserJobDetails, seekerProfileDetails, updateSeekerResume } from '../services/allApi';
import serverUrl from '../services/serverUrl';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineFileUpload } from "react-icons/md"; // Correct import


const Profile = () => {
    const { profileDetails, setProfileDetails } = useContext(profileDetailsContext)
    const { employerDetails, setEmployerDetails } = useContext(employerDetailsContext)
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)
    const [jobSeekerProfileDetails, setJobSeekerProfileDetails] = useState({})
    const [employerProfileDetails, setEmployerProfileDetails] = useState({})

    const [resume, setResume] = useState(null);


    useEffect(() => {
        if (!resume) return;

        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (allowedTypes.includes(resume.type)) {
            updateResume();
        } else {
            setResume(null);
            alert("Invalid file type. Please upload a PDF or DOCX.");
        }
    }, [resume]);


    useEffect(() => {
        getUsersDetails()
        getEmployerDetails()
    }, [employerDetails, profileDetails])


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

    const getUsersDetails = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const reqHeaders = {
                    Authorization: `Bearer ${token}`
                };
                const result = await seekerProfileDetails(reqHeaders);
                if (result?.status === 200) {
                    setJobSeekerProfileDetails(result.data);
                } else if (result?.status === 401) {
                    alert(result.response?.data || "Unauthorized access");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        } else {
            alert("Authentication missing... Please login");
        }
    };


    const getEmployerDetails = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const reqHeaders = {
                    Authorization: `Bearer ${token}`
                };
                const result = await employerAcDetails(reqHeaders);
                if (result?.status === 200) {
                    setEmployerProfileDetails(result.data);
                } else if (result?.status === 401) {
                    alert(result.response?.data || "Unauthorized access");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        } else {
            alert("Authentication missing... Please login");
        }
    };

    const updateResume = async () => {
        const token = sessionStorage.getItem("token")
        if (token) {
            const reqHeaders = {
                "Authorization": `Bearer ${token}`,
            }
            const reqBody = new FormData()
            reqBody.append("resume", resume)

            try {
                const result = await updateSeekerResume(reqBody, reqHeaders)

                if (result.status == 200) {
                    alert("Resume Updated successfully");
                } else if (result.status == 404) {
                    alert(result.response.error)
                }
            } catch (err) {
                alert(err)
            }
        } else {
            alert("Authentication failed please login...")
        }
    }
console.log(employerProfileDetails);


    return (
        <>
            <div style={{ backgroundColor: '#0A3321', color: 'white' }}>
                <Header isEmployee={isEmployee} />
            </div>
            {
                isEmployee ?
                    <Container fluid className="bg-light p-3">
                        <Card className="shadow-sm">
                            <Card.Body className="p-0">
                                {/* Profile header */}
                                <div className="d-flex p-3 align-items-center border-bottom">
                                    <div className="d-flex align-items-center mb-1">
                                        <img className='border me-2' style={{ width: '70px', borderRadius: '50%' }} src={`${serverUrl}/uploads/${encodeURIComponent(employerProfileDetails?.profilePic)}`} alt="" />
                                        <h5 className="mb-0 mx-2">{employerProfileDetails.companyname ? employerProfileDetails.companyname : "Nill"}</h5>
                                    </div>
                                    <div className="ms-auto d-flex">
                                        <Button variant="light" className="me-2 rounded-circle">
                                            <AddJob />
                                        </Button>
                                        <Button variant="light" className="me-2 rounded-circle">
                                            <Link to={employerProfileDetails?._id ? `/chat/${employerProfileDetails._id}` : '#'}>
                                                <IoChatbubbleEllipses />
                                            </Link>
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
                                                    Posted Jobs
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        {/* Hiring Process */}
                                        <div className="p-3">
                                            {/* Jobs Applied */}
                                            <div className="mb-3">
                                                <JobCard insideProfile={true} />
                                            </div>
                                        </div>
                                    </Col>
                                    {/* Right Sidebar */}
                                    <Col md={4}>
                                        <div className="p-3">
                                            <div className='d-flex justify-content-between'>
                                                <h5 className="mb-3">Company Information</h5>
                                                <Form.Group>
                                                    <div className="d-flex justify-content-end">
                                                        <Button variant="light" className="rounded-circle">
                                                            <JobSeekerDetails employerProfileDetails={employerProfileDetails} isEmployee={isEmployee} />
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <ListGroup variant="flush" className="mb-4">
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Envelope className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Email Address</span>
                                                    <span className="ms-auto bg-light rounded px-2 py-1 small">{employerProfileDetails.email ? employerProfileDetails.email : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Telephone className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Phone Number</span>
                                                    <span className="ms-auto bg-light rounded px-2 py-1 small">{employerProfileDetails.phoneNumber ? employerProfileDetails.phoneNumber : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <GeoAlt className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Address</span>
                                                    <span className="ms-5">{employerProfileDetails.address ? employerProfileDetails.address : "Nill"}</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Container>
                    :
                    <Container fluid className="bg-light p-3">
                        <Card className="shadow-sm">
                            <Card.Body className="p-0">
                                {/* Profile header */}
                                <div className="d-flex p-3 align-items-center border-bottom">
                                    <div className="d-flex align-items-center mb-1">
                                        <img className='border me-2' style={{ width: '70px', borderRadius: '50%' }} src={`${serverUrl}/uploads/${jobSeekerProfileDetails?.profilePic}`} alt="" />
                                        <h5 className="mb-0 me-2">{jobSeekerProfileDetails.username}</h5>
                                    </div>
                                    <div className="ms-auto d-flex">
                                        <Button variant="light" className="me-2 rounded-circle">
                                            <Link to={jobSeekerProfileDetails?._id ? `/chat/${jobSeekerProfileDetails._id}` : '#'}>
                                                <IoChatbubbleEllipses />
                                            </Link>
                                        </Button>
                                        <Button variant="light" className="me-2 rounded-circle">
                                            <label htmlFor="file-upload" className="d-flex align-items-center justify-content-center" style={{ cursor: "pointer" }}>
                                                <MdOutlineFileUpload size={24} />
                                                <input name='resume' onChange={e => setResume(e.target.files[0])} type="file" id="file-upload" style={{ display: "none" }} />
                                            </label>
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
                                                    <div className="fw-bold text-dark">{jobSeekerProfileDetails.experienceInYears ? jobSeekerProfileDetails.experienceInYears : "Nill"}</div>
                                                </Col>
                                                <Col md={4}>
                                                    <div>Current Employer</div>
                                                    <div className="fw-bold text-dark">{jobSeekerProfileDetails.currentEmployer ? jobSeekerProfileDetails.currentEmployer : "Nill"}</div>
                                                </Col>
                                                <Col md={4}>
                                                    <div>Current Salary</div>
                                                    <div className="fw-bold text-dark">{jobSeekerProfileDetails.currentSalary ? jobSeekerProfileDetails.currentSalary : "Nill"}</div>
                                                </Col>
                                                <Col md={4}>
                                                    <div>Expected Salary</div>
                                                    <div className="fw-bold text-dark">{jobSeekerProfileDetails.expectedSalary ? jobSeekerProfileDetails.expectedSalary : "Nill"}</div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            {/* Jobs Applied */}
                                            <div className="mb-3">


                                            </div>
                                        </div>
                                    </Col>
                                    {/* Right Sidebar */}
                                    <Col md={4}>
                                        <div className="p-3">
                                            <div className='d-flex justify-content-between'>
                                                <h5 className="mb-3">Personal Information</h5>
                                                <Form.Group>
                                                    <div className="d-flex justify-content-end">
                                                        <Button variant="light" className="rounded-circle">
                                                            <JobSeekerDetails jobSeekerProfileDetails={jobSeekerProfileDetails} />
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <ListGroup variant="flush" className="mb-4">
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Envelope className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Email Address</span>
                                                    <span className="ms-auto bg-light rounded px-2 py-1 small">{jobSeekerProfileDetails.email ? jobSeekerProfileDetails.email : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Telephone className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Phone Number</span>
                                                    <span className="ms-auto bg-light rounded px-2 py-1 small">{jobSeekerProfileDetails.phoneNumber ? jobSeekerProfileDetails.phoneNumber : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <GenderFemale className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Gender</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.gender ? jobSeekerProfileDetails.gender : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <CalendarDate className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Birthdate</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.birthDate ? jobSeekerProfileDetails.birthDate : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <GeoAlt className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Living Address</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.address ? jobSeekerProfileDetails.address : "Nill"}</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                            <h5 className="mb-3">Education Information</h5>
                                            <ListGroup variant="flush" className="mb-4">
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Building className="me-2 text-muted" />
                                                    <span className="text-muted me-2">University</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.university ? jobSeekerProfileDetails.university : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Award className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Qualification Held</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.qualification ? jobSeekerProfileDetails.qualification : "Nill"}</span>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="px-0 py-2 d-flex align-items-center">
                                                    <Calendar className="me-2 text-muted" />
                                                    <span className="text-muted me-2">Year Graduation</span>
                                                    <span className="ms-auto">{jobSeekerProfileDetails.yearOfGraduation ? jobSeekerProfileDetails.yearOfGraduation : "Nill"}</span>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Container>
            }
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Profile

