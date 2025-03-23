import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-5 bg-white">
      <Container>
        <Row className="mt-1">
          {/* Brand and Description */}
          <Col md={4} className="mb-2 mb-md-0">
            <h3 className="mb-4 fw-bold" style={{ color: '#0c2d1c' }}>
              <span className="position-relative">
                Career<span className="position-absolute" style={{ color: '#c0f953', fontSize: '1.5rem', top: '-5px', left: '0' }}>•</span> connect
              </span>
            </h3>
            <p className="text-muted">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni molestiae nam officiis officia excepturi at sit eveniet pariatur asperiores totam tempore, quia corrupti! Sapiente nobis quibusdam fugit deleniti non asperiores?
            </p>
            <div className="d-flex mt-4">
              <a href="https://www.facebook.com/" className="me-3 d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', backgroundColor: '#0c2d1c', color: 'white', borderRadius: '5px' }}>
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/accounts/login/?hl=en" className="me-3 d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'white', color: '#0c2d1c', border: '1px solid #0c2d1c', borderRadius: '5px' }}>
                <FaInstagram />
              </a>
              <a href="https://x.com/?lang=en" className="me-3 d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'white', color: '#0c2d1c', border: '1px solid #0c2d1c', borderRadius: '5px' }}>
                <FaTwitter />
              </a>
              <a href="www.linkedin.com/in/aneesh-o" className="d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', backgroundColor: 'white', color: '#0c2d1c', border: '1px solid #0c2d1c', borderRadius: '5px' }}>
                <FaLinkedin />
              </a>
            </div>
          </Col>

          {/* Support Section */}
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-4 fw-bold" style={{ color: '#0c2d1c' }}>Support</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">How it Work</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Features</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Pricing</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Download</a></li>
            </ul>
          </Col>

          {/* Useful Links Section */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-4 fw-bold" style={{ color: '#0c2d1c' }}>Useful Links</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">About</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Services</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Blog</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Contact</a></li>
            </ul>
          </Col>

          {/* Support Section (second) */}
          <Col md={3} sm={6}>
            <h5 className="mb-4 fw-bold" style={{ color: '#0c2d1c' }}>Support</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">FAQS</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Term & Conditions</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Privacy policy</a></li>
              <li className="mb-3"><a href="#" className="text-decoration-none text-muted">Help Center</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer






