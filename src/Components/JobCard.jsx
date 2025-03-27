import React, { useContext, useEffect, useState } from 'react'
import { Button, Row, Col, Badge, Card } from 'react-bootstrap';
import { ThreeDots } from 'react-bootstrap-icons';
import { deleteUserJobs, getUserJobDetails, userApplyingJob } from '../services/allApi';
import { Dropdown } from "react-bootstrap";
import AddJob from './AddJob';
import { jobCardEditContext } from '../Contexts/ContextApi';
import { toast } from 'react-toastify';

const JobCard = ({ insideProfile, item ,updatingButton}) => {
    const { jobCardUpdateDetails, setJobCardUpdateDetails } = useContext(jobCardEditContext)

    const [userJobDetail, setUserJobDetail] = useState([])

    useEffect(() => {
        getUserJobs()
    }, [jobCardUpdateDetails])

    const getUserJobs = async () => {
        const token = sessionStorage.getItem("token")
        if (token) {
            const reqHeaders = {
                "Authorization": `Bearer ${token}`
            }
            try {
                const result = await getUserJobDetails(reqHeaders)
                if (result.status == 200) {
                    setUserJobDetail(result.data)
                } else if (result.status == 500) {
                    alert(result.response.data)
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Authentication Missing...Please login")
        }
    }

    const handleApplyingJob = async (jobId) => {
        if (sessionStorage.getItem("user")) {
            const userDetails = JSON.parse(sessionStorage.getItem("user"))
            const token = sessionStorage.getItem("token")
            if (userDetails.role == "Jobseeker") {
                const reqHeaders = {
                    Authorization: `Bearer ${token}`
                };
                try {
                    const result = await userApplyingJob(jobId, reqHeaders)
                    if (result.status == 200) {
                        alert("Applied success fully...you will get answer from company")
                    } else if (result.status == 400) {
                        toast.warning("Already applyed for this job...")
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    const handleDeletejob = async (jobId) => {
        const token = sessionStorage.getItem("token")
        if (token) {
            const reqHeaders = {
                Authorization: `Bearer ${token}`
            };
            try {
                const result = await deleteUserJobs(jobId, reqHeaders)
                console.log(result);

                if (result.status == 200) {
                    alert("Job deleted successfully")
                    getUserJobs()
                } else if (result.status == 404) {
                    alert(result.response.data)
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Unauthorized...please login")
        }
    }

    

    return (
        <>
            {
                !insideProfile ?
                    <div className='px-3 py-2'>
                        {
                            <Card key={item._id} className="h-100 shadow-sm border">
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small className="text-muted">{item.jobLocation}</small>
                                    </div>
                                    <h5 className="card-title mb-2">{item.designation}</h5>
                                    <div className="d-flex align-items-center mb-3">
                                        <span className="ms-2">{item.companyName}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <small className="text-muted"><i class="fa-regular fa-clock"></i><i className="bi bi-briefcase me-2"></i> {item.jobType}</small>
                                        <Badge bg="light" text="dark" className="me-3">

                                        </Badge>
                                    </div>
                                    <div className="d-flex flex-wrap mb-2">
                                        <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.skills}</small>
                                    </div>
                                    <div className="d-flex flex-wrap mb-2">
                                        <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.salaryRange}</small>
                                    </div>
                                    <div className="d-flex flex-wrap mb-2">
                                        <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.description}</small>
                                    </div>
                                    {
                                        updatingButton ?
                                            <Button size="sm" className='px-3 bg-dark' >Applied</Button>
                                            :
                                            <Button onClick={() => handleApplyingJob(item._id)} size="sm" className='px-3 bg-dark' > Apply Now</Button>
                                    }
                                </Card.Body>
                            </Card>
                        }
                    </div>
                    :
                    <Row className="g-4">
                        {
                            userJobDetail?.length > 0 ?
                                userJobDetail.map(item => (
                                    <Col sm={12} md={4} >
                                        <Card key={item._id} className="h-100 shadow-sm border">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small className="text-muted">{item.jobLocation}</small>
                                                    <Dropdown align="end">
                                                        <Dropdown.Toggle
                                                            variant="light"
                                                            className="rounded-circle border-0 p-1"
                                                            bsPrefix="custom-dropdown-toggle"
                                                        >
                                                            <ThreeDots />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item ><AddJob userJobDetail={item} /></Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleDeletejob(item._id)}>Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <h5 className="card-title mb-2">{item.designation}</h5>
                                                <div className="d-flex align-items-center mb-3">
                                                    <span className="ms-2">{item.companyName}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <small className="text-muted"><i class="fa-regular fa-clock"></i><i className="bi bi-briefcase me-2"></i> {item.jobType}</small>
                                                    <Badge bg="light" text="dark" className="me-3">
                                                    </Badge>
                                                </div>
                                                <div className="d-flex flex-wrap mb-2">
                                                    <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.skills}</small>
                                                </div>
                                                <div className="d-flex flex-wrap mb-2">
                                                    <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.salaryRange}</small>
                                                </div>
                                                <div className="d-flex flex-wrap mb-2">
                                                    <small className="text-muted"><i class="fa-regular fa-clock me-2"></i> {item.description}</small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                                :
                                <div className='text-danger fw-bolder text-align-center'>There is no jobs Posted yet</div>
                        }
                    </Row>
            }
        </>
    )
}

export default JobCard