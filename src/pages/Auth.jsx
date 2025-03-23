import React, { useContext, useState } from 'react';
import { Tabs, Tab, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { employerLoginApi, employerRegisterApi, seekerLoginApi, seekerRegisterApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import { IsEmployeeStatusContext } from '../Contexts/ContextApi';

const Auth = ({ insideRegister }) => {
    const navigate = useNavigate()
    const [key, setKey] = useState('employers');
    const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)
    const [jobSeekerDetails, setJobSeekerDetails] = useState({
        email: "", username: "", password: ""
    })
    const [employerDetails, setEmployerDetails] = useState({
        email: "", companyname: "", password: ""
    })

    const jobseekerRegister = async (e) => {
        e.preventDefault()
        if (jobSeekerDetails.email && jobSeekerDetails.username && jobSeekerDetails.password) {
            try {
                const result = await seekerRegisterApi(jobSeekerDetails)
                if (result.status == 200) {
                    alert("Registeerd successfully...Please login")
                    navigate("/Login")
                    setJobSeekerDetails({ email: "", username: "", password: "" })
                } else {
                    if (result.status == 406) {
                        alert(result.response.data)
                        navigate("/Login")
                        setJobSeekerDetails({ email: "", username: "", password: "" })
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill the form completly")
        }
    }

    const jobseekerLogin = async (e) => {
        e.preventDefault()
        const { email, password } = jobSeekerDetails
        if (email && password) {
            try {
                const result = await seekerLoginApi(jobSeekerDetails)
                if (result.status == 200) {
                    sessionStorage.setItem("user", JSON.stringify(result.data.user))
                    sessionStorage.setItem("token", result.data.token)
                    navigate('/')
                    setIsEmployee(false)
                    setJobSeekerDetails({ email: "", username: "", password: "" })
                } else if (result.status == 401) {
                    alert(result.response.data)
                    setJobSeekerDetails({ email: "", username: "", password: "" })
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill the form Completly...")
        }
    }

    const registerEmployer = async (e) => {
        e.preventDefault();
        if (employerDetails.email && employerDetails.companyname && employerDetails.password) {
            try {
                const result = await employerRegisterApi(employerDetails);
                console.log(result.status);

                if (result.status == 200) {
                    alert("Registration successful. Please log in.");
                    navigate('/Login');
                    setEmployerDetails({ email: "", companyname: "", password: "" });
                } else if (result.status === 406) {
                    alert(result.response?.data || "Not Acceptable");
                    navigate('/Login');
                    setEmployerDetails({ email: "", companyname: "", password: "" });
                }
            } catch (err) {
                console.log(err);
                alert("An error occurred during registration.");
            }
        } else {
            alert("Please fill the form completely...");
        }
    };

    const loginEmployer = async (e) => {
        e.preventDefault();
        if (employerDetails.email && employerDetails.password) {
            try {
                const result = await employerLoginApi(employerDetails)
                if (result.status == 200) {
                    sessionStorage.setItem("user", JSON.stringify(result.data.user))
                    sessionStorage.setItem("token", result.data.token)
                    navigate("/")
                    setIsEmployee(true)
                    setEmployerDetails({ email: "", companyname: "", password: "" })
                } else if (result.status == 401) {
                    alert(result.response.data)
                }
            } catch (err) {
                console.log(err);
                alert("An error occurred during registration.");
            }
        } else {
            alert("Please fill the form completely...");
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#0A3321', color: 'white' }}>
            <div className=" shadow p-5  rounded">
                <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" >
                    {/* Employee Ac */}
                    <Tab eventKey="employers" title="Employers">
                        <div className="p-3">
                            {
                                insideRegister ?
                                    <h3>Create your Employers account</h3>
                                    :
                                    <h3>Login into your account</h3>
                            }
                            <Form>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control value={employerDetails.email} onChange={e => setEmployerDetails({ ...employerDetails, email: e.target.value })} type="email" placeholder="Enter Company email" />
                                </Form.Group>

                                {
                                    insideRegister &&
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control value={employerDetails.companyname} onChange={e => setEmployerDetails({ ...employerDetails, companyname: e.target.value })} placeholder="Enter Company name" />
                                    </Form.Group>
                                }
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control value={employerDetails.password} onChange={e => setEmployerDetails({ ...employerDetails, password: e.target.value })} type="password" placeholder="Enter a secure password" />
                                </Form.Group>
                                {
                                    insideRegister ?
                                        <Button onClick={registerEmployer} style={{ width: '100%' }} variant="primary" type="submit" className="mt-3">
                                            Register
                                        </Button>

                                        :
                                        <Button onClick={loginEmployer} style={{ width: '100%' }} variant="primary" type="submit" className="mt-3">
                                            Login
                                        </Button>
                                }
                                <div className='mt-2 d-flex justify-content-between'>
                                    {
                                        !insideRegister ?
                                            <Form.Text className="text-muted">
                                                {/* <a href="">Forgot Your Password?</a> */}
                                            </Form.Text>
                                            :
                                            <Form.Text className="text-muted">
                                                <a href="/Login">Already Have an account</a>
                                            </Form.Text>
                                    }
                                    {!insideRegister &&
                                        <Form.Text className="text-muted">
                                            <a href="/Register">Create an account</a>
                                        </Form.Text>}
                                </div>
                            </Form>

                        </div>
                    </Tab>
                    {/* Jobseeker Ac */}
                    <Tab eventKey="jobseeker" title="Job Seeker">
                        <div className="p-3">
                            {
                                insideRegister ?
                                    <h3>Create your Jobseeker account</h3>
                                    :
                                    <h3>Login into your account</h3>
                            }
                            <Form>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Personal email</Form.Label>
                                    <Form.Control value={jobSeekerDetails.email} onChange={e => setJobSeekerDetails({ ...jobSeekerDetails, email: e.target.value })} type="email" placeholder="Enter Personal email" />
                                </Form.Group>

                                {
                                    insideRegister &&
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label> Name</Form.Label>
                                        <Form.Control value={jobSeekerDetails.username} onChange={e => setJobSeekerDetails({ ...jobSeekerDetails, username: e.target.value })} type="email" placeholder="Enter your name" />
                                    </Form.Group>

                                }
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control value={jobSeekerDetails.password} onChange={e => setJobSeekerDetails({ ...jobSeekerDetails, password: e.target.value })} type="password" placeholder="Enter a secure password" />
                                </Form.Group>
                                {
                                    insideRegister ?
                                        <Button onClick={jobseekerRegister} href='' style={{ width: '100%' }} variant="primary" type="submit" className="mt-3">Register</Button>
                                        :
                                        <Button onClick={jobseekerLogin} href='/Home' style={{ width: '100%' }} variant="primary" type="submit" className="mt-3">Login</Button>
                                }
                                <div className='mt-2 d-flex justify-content-between'>
                                    {
                                        !insideRegister ?
                                            <Form.Text className="text-muted ">
                                                {/* <a href="">Forgot Your Password?</a> */}
                                            </Form.Text>
                                            :
                                            <Form.Text className="text-muted ">
                                                <a href="/Login">Already Have an account</a>
                                            </Form.Text>
                                    }
                                    {!insideRegister &&
                                        <Form.Text className="text-muted ">
                                            <a href="/Register">Create an account</a>
                                        </Form.Text>}
                                </div>
                            </Form>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default Auth;
