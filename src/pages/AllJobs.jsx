import React, { useContext, useEffect, useState } from "react";
import Header from "../Components/Header";
import { Container, Row, Col, Form, Accordion } from "react-bootstrap";
import JobCard from "../Components/JobCard";
import Footer from "../Components/Footer";
import { getAllJob } from "../services/allApi";
import { IsEmployeeStatusContext } from "../Contexts/ContextApi";

const AllJobs = () => {

    const [fullJobDetails, setFullJobDetails] = useState([]);
    const [searchQueryJobLocation, setSearchQueryJobLocation] = useState("");
    const [searchQueryDesignation, setSearchQueryDesignation] = useState("");
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)
    const [updatingButton, setUpdatingButton] = useState(false)


    useEffect(() => {
        getFullJobs();
    }, []);

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            const userData = JSON.parse(sessionStorage.getItem("user"));
            setIsEmployee(userData.role === "Employer");
        }
    }, []);



    const getFullJobs = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const result = await getAllJob();
                if (result.status === 200) {
                    setFullJobDetails(result.data);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Authorization failed...please login");
        }
    };

    const filteredJobs = fullJobDetails.filter((job) => {
        return (
            job.jobLocation?.toLowerCase().includes(searchQueryJobLocation.toLowerCase()) &&
            job.designation?.toLowerCase().includes(searchQueryDesignation.toLowerCase())
        );
    });






    return (
        <>
            <div style={{ backgroundColor: "#0A3321", color: "white" }}>
                <Header insidelogin={true} />
            </div>

            {/* Search Bar */}
            <div className="container d-flex w-75 justify-content-center mt-5">
                <Form className="d-flex align-items-center border shadow rounded px-3" onSubmit={(e) => e.preventDefault()}>
                    <i className="fa-solid fa-magnifying-glass text-dark mx-2"></i>
                    <input onChange={(e) => setSearchQueryJobLocation(e.target.value)} className="form-control px-4" type="text" placeholder="Search Job Location" value={searchQueryJobLocation} />
                    <i className="fa-solid fa-location-dot text-dark mx-2"></i>
                    <input onChange={(e) => setSearchQueryDesignation(e.target.value)} className="form-control px-4 ms-2" type="text" placeholder="Search Designation" value={searchQueryDesignation} />
                </Form>
            </div>
            {/* Job Listings */}
            <Container fluid className="py-4">
                <Row>
                    {/* Sidebar - Filters */}
                    {/* <Col lg={3} className="shadow">
                        <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen className="mb-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Type of Employment</Accordion.Header>
                                <Accordion.Body>
                                    {["Full Time Jobs", "Part Time Jobs", "Remote Jobs", "Internship"].map((type, index) => (
                                        <Form key={index}>
                                            <Form.Group className="d-flex justify-content-between">
                                                <Form.Check type="checkbox" label={type} />
                                            </Form.Group>
                                        </Form>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Seniority Level</Accordion.Header>
                                <Accordion.Body>
                                    {["Entry Level", "Mid Level", "Senior Level"].map((level, index) => (
                                        <Form key={index}>
                                            <Form.Group className="mb-2 d-flex justify-content-between">
                                                <Form.Check type="checkbox" label={level} />
                                            </Form.Group>
                                        </Form>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Salary Level</Accordion.Header>
                                <Accordion.Body>
                                    {["10-20k", "20-30k", "30k-above"].map((salary, index) => (
                                        <Form key={index}>
                                            <Form.Group className="mb-2 d-flex justify-content-between">
                                                <Form.Check type="checkbox" label={salary} />
                                            </Form.Group>
                                        </Form>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        <div className="d-flex justify-content-evenly mb-2">
                            <button className="btn btn-dark">Submit</button>
                            <button className="btn btn-success">Reset</button>
                        </div>
                    </Col> */}

                    {/* Job Listings */}
                    <Col className="container" lg={9}>
                        <Row sm={12} md={4} lg={4}>
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => <JobCard key={job._id || job.id} updatingButton={updatingButton} item={job} />)
                            ) : (
                                <div className="text-danger fw-bolder text-center mt-3">
                                    No jobs found for your search criteria.
                                </div>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default AllJobs;
