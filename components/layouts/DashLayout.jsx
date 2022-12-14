import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import layout from "../../styles/layout.module.css";
import ClientSidebar from "../client/ClientSidebar";
import ClientNav from "../client/ClientNav";

const DashLayout = ({ children }) => {
  return (
    <>
      <ClientNav />
      <Row className={`m-0 p-0 ${layout.dashRow}`}>
        <Col xs="auto p-0" className={layout.sidebarNav}>
          <ClientSidebar />
        </Col>
        <Col className={`mx-md-2 px-4 py-3 my-2 ${layout.centerDiv}`}>
          {children}
        </Col>
      </Row>
    </>
  );
};

export default DashLayout;
