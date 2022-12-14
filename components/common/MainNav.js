import Link from "next/link";

import { Navbar, Nav, Container, Alert, Button } from "react-bootstrap";

const MainNav = () => {
  return (
    <>
      {/* <Link href="/blog/hello-world" as="vvv">
        Blog Post
      </Link> */}
      {/* <Navbar
        sticky="top"
        collapseOnSelect
        expand="md"
        variant="dark"
        className="header text-white"
      >
        <Container fluid className="px-5">
          <Navbar.Brand as={Link} reloadDocument href="/">
            Clientlance
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link as={Link} to="/features">
                Features
              </Nav.Link>
              <Nav.Link as={Link} to="/pricing">
                Pricing
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              {/* prefered option 1 */}
      {/* <Nav.Link as={Link} reloadDocument to="/contact">
                Contact
              </Nav.Link>
              {/* prefered option 2 */}
      {/* <Link className="nav-link" to="/login">
                Log In
              </Link> */}
      {/*reloadDocument makes Link act as <a href>  */}
      {/*onClick={() => window.open("/signup", "_self")}  */}
      {/* <Nav.Link as={Link} reloadDocument to="/signup">
                Sign Up
              </Nav.Link>
            </Nav> */}
      {/* </Navbar.Collapse>
        </Container>
      </Navbar>  */}
      <Navbar
        sticky="top"
        collapseOnSelect
        expand="md"
        variant="dark"
        className="main-nav text-white"
      >
        <Container fluid className="px-5">
          <Navbar.Brand as={Link} href="/">
            lanceArticles
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link as={Link} href="/features">
                Features
              </Nav.Link>
              <Nav.Link as={Link} href="/contact">
                Contact
              </Nav.Link>
              <Nav.Link as={Link} href="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} href="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} href="/signup">
                Sign up
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MainNav;
