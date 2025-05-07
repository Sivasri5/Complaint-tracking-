import "./Footer.css"

const Footer = () => {
  return (
    <footer className="main-footer py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">© {new Date().getFullYear()} Complaint Portal. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <ul className="footer-links list-inline mb-0 text-center text-md-end">
              <li className="list-inline-item">
                <a href="mailto:support@complaintportal.com" className="footer-link">
                  <i className="bi bi-envelope me-2"></i>
                  support@complaintportal.com
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="tel:+919080610799" className="footer-link">
                  <i className="bi bi-telephone me-2"></i>
                  9080610799
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
