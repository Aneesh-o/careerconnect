import React, { useContext, useEffect, useState } from 'react'
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../services/allApi';
import { IsEmployeeStatusContext } from '../Contexts/ContextApi';
import serverUrl from '../services/serverUrl';


const FindCandidates = () => {
  const [usersDetails, setUsersDetails] = useState([])
  const [searchQuery, setSearchQuery] = useState(""); 
  const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)
  const [preview, setPreview] = useState("")


  useEffect(() => {
    fetchUserDetails()
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      setIsEmployee(userData.role === "Employer");
    }
  }, []);



  const fetchUserDetails = async () => {
    if (sessionStorage.getItem("token")) {
      try {
        const result = await getUserDetails()
        if (result.status == 200) {
          setUsersDetails(result.data)
          console.log(`jhhhd${result.data}`);
        } else if (result.status == 500) {
          alert(result.response.data)
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Authentication failed...please login")
    }
  }

  const filteredUsers = usersDetails.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
      <Header isEmployee={isEmployee} />
      <div className='pt-3 pb-3' style={{ backgroundColor: '#0A3321', color: 'white', minHeight: '100vh' }}>
        <h3 className='text-center'>Find Candidates</h3>
        <div className='container d-flex w-75 justify-content-center mt-3 '>
          <Form className='d-flex align-items-center border shadow rounded bg-light'>
            <i className='fa-solid fa-magnifying-glass text-dark mx-2'></i>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='form-control px-4' type='text' placeholder='Enter name...' />
            <button className='btn btn-success px-4 ms-2'>Search</button>
          </Form>
        </div>
        {
          filteredUsers?.length > 0 ?
            filteredUsers.map(details => (
              <Card className="mb-5 w-50 container mt-5">
                <Card.Body>
                  <Row>
                    <Col xs={3} className="text-center d-flex justify-content-center align-items-center">
                      <Link to={`/profiledetails/${details._id}`}> 
                        <Card.Img
                          src={preview ? preview : `${serverUrl}/uploads/${details?.profilePic}`}
                          roundedCircle
                          className="img-fluid my-2 w-50"
                        />
                      </Link>
                    </Col>
                    <Col xs={6}>
                      <div key={details.id} className="mb-3"> 
                        <Card.Title className="mb-1">Name : {details.username}</Card.Title>
                        <div className="mb-2">
                          <div className="text-muted small">
                            <i className="bi bi-geo-alt "></i>
                            Education : {details.qualification}
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-building"></i>
                            Email : {details.email}
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-mortarboard"></i>
                            Phone Number : {details.phoneNumber}
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-currency-dollar"></i>
                            Experience in years : {details.experienceInYears
                            }
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
            :
            <div className='text-center text-danger mt-5 fw-bold fs-5'>No user details found.</div>
        }
        <div>
          <div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FindCandidates