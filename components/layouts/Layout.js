import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../common/Footer"
import MainNav from "../common/MainNav";
import Meta from "../common/Meta";
import layout from "../../styles/layout.module.css"
import ClientSidebar from "../client/ClientSidebar";
import ClientNav from "../client/ClientNav";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import { clientAuthSelect } from "../../redux/features/client/clientAuthSlice";

const Layout = ({ children }) => {
  const { client } = useSelector(clientAuthSelect);

  const { pathname } = useRouter();
  return (
    <div>
      <Meta />
      <header>
        <MainNav />
      </header>
      <main>
        <Container fluid className="p-0 m-0">
          <Row className={`p-0 m-0`}>
            <Col className="p-0 m-0">{children}</Col>
          </Row>
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
