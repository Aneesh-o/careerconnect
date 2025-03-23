import React, { useContext, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Header from "../Components/Header";
import { IsEmployeeStatusContext } from "../Contexts/ContextApi";
import { getUserAppliedJobs, rejectApplicants, selectApplicants, userAppliedDetails } from "../services/allApi";

const Contact = () => {
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext);
    const [userDetails, setUserDetails] = useState([]);
    const [select, setSelect] = useState(false);
    const [userAppliedJobs, setUserAppliedJobs] = useState([])

    useEffect(() => {
        if (sessionStorage.getItem("user")) {
            const userData = JSON.parse(sessionStorage.getItem("user"));
            setIsEmployee(userData.role === "Employer");
        }
    }, []);

    useEffect(() => {
        getAppliedUserDetails();
        fetchAppliedJobs()
    }, []);


    const getAppliedUserDetails = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("Token missing");
            return;
        }
        const reqHeaders = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const result = await userAppliedDetails(reqHeaders); // API call
            if (result.status === 200) {
                console.log("Fetched Data:", result.data);

                let hasNonRejectedApplicants = false; // Flag to check for valid applicants

                const updatedJobs = result.data.jobs.map(job => {
                    const totalApplicantsCount = job.applicants.length; // ✅ Total applicants count

                    // Filter out rejected applicants
                    const filteredApplicants = job.applicants.filter(applicant => {
                        if (applicant.status !== "Rejected") {
                            hasNonRejectedApplicants = true; // Found at least one valid applicant
                            return true; // Keep non-rejected applicants
                        }
                        return false; // Remove rejected applicants
                    });

                    return {
                        ...job,
                        applicants: filteredApplicants, // ✅ Only non-rejected applicants remain
                        totalApplicants: totalApplicantsCount, // ✅ Total applicants (before filtering)
                    };
                });

                setUserDetails({ jobs: updatedJobs }); // ✅ Update job details

            } else {
                console.error("Unexpected response:", result);
                alert(result.response?.data || "An error occurred");
            }
        } catch (err) {
            console.error("Error fetching applied user details:", err);
            alert("Failed to fetch applied user details. Please try again.");
        }
    };


    const handleReject = async (jobId, applicantId) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Authentication missing... Please login");
            return;
        }
        const reqHeader = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        try {
            const response = await rejectApplicants({ jobId, applicantId }, reqHeader);
            if (response?.status === 200) {
                alert("Applicant rejected successfully!");
                getAppliedUserDetails();
            } else if (response?.status === 404) {
                alert(response?.data?.error || "Applicant not found");
            } else if (response?.status === 403) {
                alert(response?.data?.error || "You are not authorized.");
            } else if (response?.status === 409) {
                alert(response?.data?.error || "Applicant is already rejected.");
            }

        } catch (err) {
            console.error("Error rejecting applicant:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleSelect = async (jobId, applicantId) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Authentication missing... Please login");
            return;
        }
        const reqHeader = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        try {
            const response = await selectApplicants({ jobId, applicantId }, reqHeader);
            if (response?.status === 200) {
                alert("Applicant selected successfully!");
                setSelect(true)
            } else if (response?.status === 404) {
                alert(response?.data?.error || "Applicant not found");
            } else if (response?.status === 403) {
                alert(response?.data?.error || "You are not authorized.");
            } else if (response?.status === 409) {
                alert(response?.data?.error || "Applicant is already selected.");
            }

        } catch (err) {
            console.error("Error selecting applicant:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    const fetchAppliedJobs = async () => {
        const token = sessionStorage.getItem("token")
        if (token) {
            const reqHeader = {
                "Authorization": `Bearer ${token}`
            }
            try {
                const result = await getUserAppliedJobs(reqHeader)
                if (result.status == 200) {
                    console.log(result);
                    setUserAppliedJobs(result.data)
                } else if (result.status == 500) {
                    alert(result.response.data)
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Authorization failed...please login")
        }
    };

    return (
        <>
            <Header isEmployee={isEmployee} />
            <div style={{ backgroundColor: "#0A3321", color: "white", minHeight: "100vh", paddingTop: "50px" }} className="d-flex justify-content-center">
                {
                    isEmployee ?
                        <div className="text-center w-75">
                            <h4 className="mb-4 text-warning">Candidate Applications</h4>

                            {userDetails.jobs && userDetails.jobs.length > 0 ? (
                                userDetails.jobs.map((job) => (
                                    <div key={job._id} className="mb-5">
                                        <h5>{job.companyName} - {job.designation}</h5>
                                        <p>
                                            <strong>Location:</strong> {job.jobLocation} | <strong>Type:</strong> {job.jobType} | <strong>Skills Required:</strong> {job.skills}
                                        </p>
                                        <p><strong>Total Applicants:</strong> {job.totalApplicants}</p>

                                        {job.applicants.length > 0 ? (
                                            <Table striped bordered hover responsive variant="dark">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone Number</th>
                                                        <th>Education</th>
                                                        <th>Applied Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {job.applicants.map((applicant, index) => (
                                                        <tr key={index}>
                                                            <td>{applicant.username || "Unknown"}</td>
                                                            <td>{applicant.email || "Unknown"}</td>
                                                            <td>{applicant.phoneNumber || "Unknown"}</td>
                                                            <td>{applicant.education || "Not provided"}</td>
                                                            <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <Button
                                                                        onClick={() => handleReject(job._id, applicant.userId)}
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                    {
                                                                        select ?
                                                                            <Button variant="outline-primary" size="sm">Selected</Button>
                                                                            :
                                                                            <Button onClick={() => handleSelect(job._id, applicant.userId)} variant="outline-primary" size="sm">Contact</Button>
                                                                    }

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </Table>
                                        ) : (
                                            <p className="text-danger fw-bold">No applicants for this job.</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-danger fw-bold">No jobs posted or no applicants yet.</p>
                            )}
                        </div>
                        :
                        <div className="text-center w-75">
                            <h4 className="mb-4 text-warning">Applied Job Status</h4>
                            {userAppliedJobs && userAppliedJobs.length > 0 ? (
                                userAppliedJobs.map((job) => (
                                    <div key={job._id} className="mb-5">
                                        <h5>{job.companyName} - {job.designation}</h5>
                                        <p>
                                            <strong>Location:</strong> {job.jobLocation} |
                                            <strong> Type:</strong> {job.jobType} |
                                            <strong> Skills Required:</strong> {job.skills}
                                        </p>
                                        <p><strong>Salary Range:</strong> {job.salaryRange}</p>
                                        {job.applicants && job.applicants.length > 0 ? (
                                            <Table striped bordered hover responsive variant="dark">
                                                <thead>
                                                    <tr>
                                                        <th>Role</th>
                                                        <th>Applied Date</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {job.applicants.map((applicant, index) => (
                                                        <tr key={index}>
                                                            <td>{job.designation}</td>
                                                            <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                                                            <td>{applicant.status}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <p className="text-danger fw-bold">No applicants for this job.</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-danger fw-bold">No applied jobs found.</p>
                            )}
                        </div>
                }
            </div>
        </>
    );
};

export default Contact;
















// import { Table, Button } from "react-bootstrap";

// const AppliedJobsList = ({ userAppliedJobs, handleReject, handleSelect, select }) => {
//     return (
//         <div className="text-center w-75">
//             <h4 className="mb-4 text-warning">Applied Job Status</h4>

//         </div>
//     );
// };

// export default AppliedJobsList;
