import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { IoAddCircle } from 'react-icons/io5';
import { employerAddJob, updateuserPostedJobs } from '../services/allApi';
import { jobCardEditContext, profileDetailsContext } from '../Contexts/ContextApi';

const AddJob = ({ userJobDetail }) => {
  const { profileDetails, setProfileDetails } = useContext(profileDetailsContext);
  const { jobCardUpdateDetails, setJobCardUpdateDetails } = useContext(jobCardEditContext)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [insideEdit, setInsideEdit] = useState(false)

  const [addJobDetails, setAddJobDetails] = useState({
    jobLocation: "", jobType: "", skills: "", salaryRange: "", companyName: "", designation: "", description: ""
  });

  const [editJobDetails, setEditJobDetails] = useState({
    jobLocation: "", jobType: "", skills: "", salaryRange: "", companyName: "", designation: "", description: ""
  });

  const handleUploadJob = async () => {
    if (addJobDetails.jobLocation && addJobDetails.jobType && addJobDetails.skills && addJobDetails.salaryRange && addJobDetails.companyName && addJobDetails.designation && addJobDetails.description) {
      const token = sessionStorage.getItem("token");
      const userDetails = JSON.parse(sessionStorage.getItem("user"));
      if (token && userDetails.role === "Employer") {
        const reqHeaders = {
          "Authorization": `Bearer ${token}`
        };
        try {
          const result = await employerAddJob(addJobDetails, reqHeaders);
          console.log("API Response Data:", result.data);
          if (result.status === 200) {
            alert("Job added successfully!");
            setProfileDetails(result.data.newJob || result.data);
            setJobCardUpdateDetails(result.data)
          } else {
            alert("Error adding job!");
          }
          setAddJobDetails({
            jobLocation: "", designation: "", jobType: "", skills: "",
            salaryRange: "", companyName: "", description: ""
          });
          handleClose();
        } catch (error) {
          console.error("Error uploading job:", error);
          alert("Something went wrong!");
        }
      } else {
        alert("Authentication missing... Please login to add job.");
      }
    } else {
      alert("Please fill all details.");
    }
  }

  useEffect(() => {
    if (userJobDetail) {
      setInsideEdit(true)
      setEditJobDetails({ jobLocation: userJobDetail.jobLocation, jobType: userJobDetail.jobType, skills: userJobDetail.skills, salaryRange: userJobDetail.salaryRange, companyName: userJobDetail.companyName, designation: userJobDetail.designation, description: userJobDetail.description })
    }
  }, [userJobDetail])

  console.log(userJobDetail);


  const handleUpdateJob = async () => {
    if (editJobDetails.jobLocation && editJobDetails.jobType && editJobDetails.skills && editJobDetails.salaryRange && editJobDetails.companyName && editJobDetails.designation && editJobDetails.description) {
      const token = sessionStorage.getItem("token");
      const userDetails = JSON.parse(sessionStorage.getItem("user"));
      if (token && userDetails.role === "Employer") {
        const reqHeaders = {
          "Authorization": `Bearer ${token}`
        };
        try {
          const result = await updateuserPostedJobs(userJobDetail._id, editJobDetails, reqHeaders)
          console.log("API Response Data:", result.data);
          if (result.status === 200) {
            alert("Job updated successfully!");
            setJobCardUpdateDetails(result.data)
          } else if (result.status == 404) {
            alert(result.response.data);
          }
          handleClose();
        } catch (error) {
          console.error("Error uploading job:", error);
          alert("Something went wrong!");
        }
      } else {
        alert("Authentication missing... Please login to add job.");
      }
    } else {
      alert("Please fill all details.");
    }
  }


  return (
    <>
      {!insideEdit ? (
        <>
          <IoAddCircle onClick={handleShow} />
          <Modal centered size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>New Job Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="align-items-center">
                <div>
                  {Object.keys(addJobDetails).map((key) => (
                    <div className="mb-2" key={key}>
                      <input
                        value={addJobDetails[key]}
                        onChange={(e) =>
                          setAddJobDetails((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        type="text"
                        placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                        className="form-control"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleUploadJob} variant="primary">Add</Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <span onClick={handleShow}>Edit</span>
          <Modal centered size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Job Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="align-items-center">
                <div>
                  {Object.keys(editJobDetails).map((key) => (
                    <div className="mb-2" key={key}>
                      <input
                        value={editJobDetails[key]}
                        onChange={(e) =>
                          setEditJobDetails((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        type="text"
                        placeholder=""
                        className="form-control"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleUpdateJob} variant="primary">Update</Button>
            </Modal.Footer>
          </Modal>
        </>
      )

      }


    </>
  );
};

export default AddJob;
