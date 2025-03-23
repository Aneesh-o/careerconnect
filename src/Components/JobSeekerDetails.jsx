import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import { employerUpdateProfileApi, seekerProfileUpdation } from '../services/allApi';
import { employerDetailsContext, profileDetailsContext } from '../Contexts/ContextApi';

const JobSeekerDetails = ({ isEmployee, employerProfileDetails, jobSeekerProfileDetails }) => {
    const { employerDetails, setEmployerDetails } = useContext(employerDetailsContext)
    const { profileDetails, setProfileDetails } = useContext(profileDetailsContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [jobSeekerpreview, setJobSeekerpreview] = useState("")
    const [employerpreview, setEmployerpreview] = useState("")

    const handleShow = () => {
        setEmployerAcDetails({
            email: employerProfileDetails?.email || "",
            companyname: employerProfileDetails?.companyname || "",
            phoneNumber: employerProfileDetails?.phoneNumber || "",
            address: employerProfileDetails?.address || "",
            profilePic: employerProfileDetails?.profilePic || ""
        });

        setJobSeekerAcDetails({
            email: jobSeekerProfileDetails?.email || "",
            username: jobSeekerProfileDetails?.username || "",
            phoneNumber: jobSeekerProfileDetails?.phoneNumber || "",
            gender: jobSeekerProfileDetails?.gender || "",
            birthDate: jobSeekerProfileDetails?.birthDate || "",
            address: jobSeekerProfileDetails?.address || "",
            university: jobSeekerProfileDetails?.university || "",
            qualification: jobSeekerProfileDetails?.qualification || "",
            yearOfGraduation: jobSeekerProfileDetails?.yearOfGraduation || "",
            experienceInYears: jobSeekerProfileDetails?.experienceInYears || "",
            currentEmployer: jobSeekerProfileDetails?.currentEmployer || "",
            currentSalary: jobSeekerProfileDetails?.currentSalary || "",
            expectedSalary: jobSeekerProfileDetails?.expectedSalary || "",
            profilePic: jobSeekerProfileDetails?.profilePic || ""
        });

        setShow(true);
    };

    const [imageFileStatus, setImgFileStatus] = useState(false)

    const [jobSeekerAcDetails, setJobSeekerAcDetails] = useState({
        email: "", username: "", phoneNumber: "", gender: "", birthDate: "", address: "", university: "", qualification: "", yearOfGraduation: "", experienceInYears: "", currentEmployer: "", currentSalary: "", expectedSalary: "", profilePic: ""
    });

    const [employerAcDetails, setEmployerAcDetails] = useState({
        email: "", companyname: "", phoneNumber: "", address: "", profilePic: ""
    });


    useEffect(() => {
        if (jobSeekerAcDetails.profilePic.type == "image/png" || jobSeekerAcDetails.profilePic.type == "image/jpg" || jobSeekerAcDetails.profilePic.type == "image/jpeg") {
            setImgFileStatus(true)
            setJobSeekerpreview(URL.createObjectURL(jobSeekerAcDetails.profilePic));
        } else {
            setImgFileStatus(false)
            setJobSeekerpreview('')
            setJobSeekerAcDetails({ ...jobSeekerAcDetails, profilePic: '' })
        }
    }, [jobSeekerAcDetails.profilePic])

    useEffect(() => {
        if (employerAcDetails.profilePic.type == "image/png" || employerAcDetails.profilePic.type == "image/jpg" || employerAcDetails.profilePic.type == "image/jpeg") {
            setImgFileStatus(true)
            setEmployerpreview(URL.createObjectURL(employerAcDetails.profilePic));
        } else {
            setImgFileStatus(false)
            setEmployerpreview('')
            setEmployerAcDetails({ ...employerAcDetails, profilePic: '' })
        }
    }, [employerAcDetails.profilePic])


    const seekerProfileUpdate = async (e) => {
        e.preventDefault()
        const { email, username, phoneNumber, gender, birthDate, address, university, qualification, yearOfGraduation, experienceInYears, currentEmployer, currentSalary, expectedSalary, profilePic } = jobSeekerAcDetails;
        if (email && username && phoneNumber && gender && address && university && qualification && yearOfGraduation && experienceInYears && currentEmployer) {
            const reqBody = new FormData()
            reqBody.append("email", email)
            reqBody.append("username", username)
            reqBody.append("phoneNumber", phoneNumber)
            reqBody.append("gender", gender)
            reqBody.append("birthDate", birthDate)
            reqBody.append("address", address)
            reqBody.append("university", university)
            reqBody.append("qualification", qualification)
            reqBody.append("yearOfGraduation", yearOfGraduation)
            reqBody.append("experienceInYears", experienceInYears)
            reqBody.append("currentEmployer", currentEmployer)
            reqBody.append("currentSalary", currentSalary)
            reqBody.append("expectedSalary", expectedSalary)
            reqBody.append("profilePic", profilePic)
            const token = sessionStorage.getItem("token")
            if (token) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
                try {
                    const result = await seekerProfileUpdation(reqBody, reqHeader);
                    if (result.status === 200) {
                        alert("Profile updated successfully");
                        setProfileDetails(result.data);
                        handleClose();
                    } else {
                        alert(result.response?.data || "Error updating profile");
                    }
                } catch (err) {
                    console.error("Error while updating profile:", err.message || err);
                    alert("An error occurred. Please try again later.");
                }
            }
        } else {
            alert("Please fill out the form completely.");
        }
    };

    const employerProfileUpdate = async (e) => {
        e.preventDefault()
        const { email, companyname, phoneNumber, address, profilePic } = employerAcDetails;
        if (email && companyname && phoneNumber && address) {
            const reqBody = new FormData()
            reqBody.append("email", email)
            reqBody.append("companyname", companyname)
            reqBody.append("phoneNumber", phoneNumber)
            reqBody.append("address", address)
            reqBody.append("profilePic", profilePic)
            const token = sessionStorage.getItem("token")
            if (token) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
                try {
                    const result = await employerUpdateProfileApi(reqBody, reqHeader);
                    if (result.status === 200) {
                        alert("Profile updated successfully");
                        setEmployerDetails(result.data);
                        handleClose();
                    } else {
                        alert(result.response?.data || "Error updating employer profile");
                    }
                } catch (err) {
                    console.error("Error while updating employer profile:", err.message || err);
                    alert("An error occurred. Please try again later.");
                }
            }
        } else {
            alert("Please fill in all required fields");
        }
    };




    return (
        <>
            <PencilSquare onClick={handleShow} />
            <Modal centered size='lg' show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Personal Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!isEmployee ? (
                        <>
                            <div className='mb-2'>
                                <label className='d-flex justify-content-center'>
                                    <input onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, profilePic: e.target.files[0] })} type="file" style={{ display: 'none' }} />
                                    <img style={{ height: '100px' }} className='img-fluid' src={jobSeekerpreview ? jobSeekerpreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s"} alt="No image" />
                                </label>
                                {
                                    !imageFileStatus && <div className='text-warning fw-bolder my-2 text-center'>Upload only the following file types ( jpeg , jpg , png )</div>
                                }
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.email} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, email: e.target.value })} type="email" placeholder='Email' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.username} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, username: e.target.value })} type="text" placeholder='Username' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.phoneNumber} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, phoneNumber: e.target.value })} type="number" placeholder='PhoneNumber' className='form-control' />
                            </div>
                            <div className="mb-2">
                                <span className='me-2'>Gender :</span>
                                <label htmlFor="male">
                                    Male
                                    <input className='mx-2' id="male" name="gender" value="Male" type="radio" checked={jobSeekerAcDetails.gender === "Male"} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, gender: e.target.value })} />
                                </label>
                                <label htmlFor="female">
                                    Female
                                    <input className='mx-2' id="female" name="gender" value="Female" type="radio" checked={jobSeekerAcDetails.gender === "Female"} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, gender: e.target.value })} />
                                </label>
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.birthDate} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, birthDate: e.target.value })} type="date" placeholder='BirthDate' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.address} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, address: e.target.value })} type="text" placeholder='Address' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.university} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, university: e.target.value })} type="text" placeholder='University' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.qualification} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, qualification: e.target.value })} type="text" placeholder='Qualification' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.yearOfGraduation} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, yearOfGraduation: e.target.value })} type="text" placeholder='YearOfGraduation' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.experienceInYears} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, experienceInYears: e.target.value })} type="text" placeholder='ExperienceInYears' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.currentEmployer} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, currentEmployer: e.target.value })} type="text" placeholder='CurrentEmployer' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.currentSalary} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, currentSalary: e.target.value })} type="text" placeholder='CurrentSalary' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={jobSeekerAcDetails.expectedSalary} onChange={e => setJobSeekerAcDetails({ ...jobSeekerAcDetails, expectedSalary: e.target.value })} type="text" placeholder='ExpectedSalary' className='form-control' />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* <div className='mb-2'>
                                <label className='d-flex justify-content-center'>
                                    <input onChange={e => setEmployerAcDetails({ ...employerAcDetails, profilePic: e.target.files[0] })} type="file" style={{ display: 'none' }} />
                                    <img style={{ height: '100px' }} className='img-fluid' src={employerpreview ? employerpreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s"} alt="No image" />
                                </label>
                                {
                                    !imageFileStatus && <div className='text-warning fw-bolder my-2 text-center'>Upload only the following file types ( jpeg , jpg , png )</div>
                                }
                            </div> */}
                            <div className='mb-2'>
                                <input value={employerAcDetails.companyname} onChange={e => setEmployerAcDetails({ ...employerAcDetails, companyname: e.target.value })} type="text" placeholder='Company Name' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={employerAcDetails.email} onChange={e => setEmployerAcDetails({ ...employerAcDetails, email: e.target.value })} type="email" placeholder='Email Address' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={employerAcDetails.phoneNumber} onChange={e => setEmployerAcDetails({ ...employerAcDetails, phoneNumber: e.target.value })} type="number" placeholder='Phone Number' className='form-control' />
                            </div>
                            <div className='mb-2'>
                                <input value={employerAcDetails.address} onChange={e => setEmployerAcDetails({ ...employerAcDetails, address: e.target.value })} type="text" placeholder='Address' className='form-control' />
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={isEmployee ? employerProfileUpdate : seekerProfileUpdate}>Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default JobSeekerDetails;
