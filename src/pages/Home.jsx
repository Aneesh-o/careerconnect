import React, { useContext, useEffect } from 'react'
import { Container, Card, Row, Col, Badge, } from 'react-bootstrap';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { IsEmployeeStatusContext } from '../Contexts/ContextApi';

const Home = () => {
  const { isEmployee, setIsEmployee } = useContext(IsEmployeeStatusContext)

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

  return (
    <>
      <div style={{ backgroundColor: '#0A3321', color: 'white', minHeight: "100vh" }}>
        {/* Navbar */}
        <Header isEmployee={isEmployee} />
        {/* Hero Section */}
        <Container className="py-5 text-center mt-2">
          <h5 className="display-2 fw-bold mb-3">Build your very own job <br />portal with jobtale</h5>
          {/* Job Categories */}
          <div className="d-flex justify-content-center gap-3 pt-5">
            <span className="text-white-50 me-2">Popular Jobs:</span>
            <Badge pill bg="dark" className="px-3 py-2">Designer</Badge>
            <Badge pill bg="success" className="px-3 py-2">Web Developer</Badge>
            <Badge pill bg="dark" className="px-3 py-2">Software Engineer</Badge>
            <Badge pill bg="success" className="px-3 py-2">Business</Badge>
          </div>
          {/* Trust Logos */}
          <div className="pt-5 mt-5">
            <p className="text-white-50 mb-4">Trusted By 1M+ Business</p>
            {/* <marquee> */}
            <Row className="justify-content-center align-items-center mt-5">
              <Col xs={6} sm={4} md={2} className="mb-4 ">
                <div className="text-white-50 "><img style={{ width: '60px' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1280px-Infosys_logo.svg.png" alt="" /></div>
              </Col>
              <Col xs={6} sm={4} md={2} className="mb-4">
                <div className="text-white-50"><img style={{ width: '60px' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png" alt="" /></div>
              </Col>
              <Col xs={6} sm={4} md={2} className="mb-4">
                <div className="text-white-50"><img style={{ width: '60px' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1200px-Wipro_Primary_Logo_Color_RGB.svg.png" alt="" /></div>
              </Col>
              <Col xs={6} sm={4} md={2} className="mb-4">
                <div className="text-white-50"><img style={{ width: '60px' }} src="https://s32519.pcdn.co/es/wp-content/uploads/sites/3/2020/08/accenture-logo-672x284px.png" alt="" /></div>
              </Col>
              <Col xs={6} sm={4} md={2} className="mb-4">
                <div className="text-white-50"><img style={{ width: '60px' }} src="https://www.broadcom.com/media/blt4ac44e0e6c6d8341/blt5d143c6f438aa176/61705997923218529eece109/TCS-Logo-Colour-RGB.png?width=722" alt="" /></div>
              </Col>
              <Col xs={6} sm={4} md={2} className="mb-4">
                <div className="text-white-50"><img style={{ width: '60px' }} src="https://i.pinimg.com/736x/4e/3f/9f/4e3f9fa38e241a7b15ea727240cb953d.jpg" alt="" /></div>
              </Col>
            </Row>
            {/* </marquee> */}
          </div>
        </Container>
      </div>
      <Container fluid className="py-5 bg-light">
        <Container className="py-4">
          <Card className="border-0 shadow-lg rounded-4 p-4 p-md-5 position-relative">
            <Row className="text-center mb-4">
              <Container className="py-5">
                <div className="text-center">
                  <h2 className="fw-bold">
                    <span className="border-bottom border-primary pb-1">How it works</span>
                  </h2>
                  <p className="text-muted w-50 mx-auto">
                  Inspirational careers usually have a direct impact on the well-being of an individual. This effect may be physical or psychological. Careers of this nature may also benefit society by positively affecting the lives of other people.                  </p>
                </div>

                <Row className="mt-4 text-center">
                  <Col md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm border-0 p-3">
                      <div className="rounded bg-light p-4">
                        <h5 className="fw-semibold">Create Profile</h5>
                        <p className="text-muted">Set up your profile to get started</p>
                      </div>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm border-0 p-3">
                      <div className="rounded bg-light p-4">
                        <h5 className="fw-semibold">Receive Job Offers</h5>
                        <p className="text-muted">Get job offers that match your skills</p>
                      </div>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm border-0 p-3">
                      <div className="rounded bg-light p-4">
                        <h5 className="fw-semibold">Contact Employer</h5>
                        <p className="text-muted">Communicate directly with recruiters</p>
                      </div>
                    </Card>
                  </Col>

                  <Col md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm border-0 p-3">
                      <div className="rounded bg-light p-4">
                        <h5 className="fw-semibold">Get Your Dream Job</h5>
                        <p className="text-muted">Land the job you always wanted</p>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Card>
        </Container>
      </Container>
      <Footer />
    </>
  )
}

export default Home
