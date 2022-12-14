import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";

import { logoutClient } from "../../redux/features/client/clientAuthSlice";

const nav = {
  boxShadow: "1px 3px 5px rgba(0, 0, 0, 0.1), -1px 1px 2px rgba(0, 0, 0, 0)",
};

function ClientNav() {
  const dispatch = useDispatch();
  const handleLogoutClick = () => {
    //remove local storage
    localStorage.removeItem("client");
    //reset client in store
    dispatch(logoutClient);
    //then redirect to home
    window.open("/", "_self");
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" style={nav}>
      <Container fluid className="px-5">
        <Nav className="me-auto">
          <Nav.Link href="#features">=</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="#deets">Messages</Nav.Link>

          <NavDropdown title="Account" align="end" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.2">Manage funds</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">subscription</NavDropdown.Item>

            <NavDropdown.Item href="#action/3.4">Profile</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.4" onClick={handleLogoutClick}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default ClientNav;
