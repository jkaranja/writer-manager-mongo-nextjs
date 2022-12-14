import React from "react";
import { Col, Row } from "react-bootstrap";

const InfoDiv = ({ children, content }) => {
  return (
    <Row>
      <Col md="12" className="mt-2 infoDIV">
        <p>
          {children}
          {content}
        </p>
      </Col>
      <hr />
    </Row>
  );
};
InfoDiv.defaultProps = {
  content: "Orders",
};

export default InfoDiv;
