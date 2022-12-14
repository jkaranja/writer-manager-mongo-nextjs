import React from "react";
import { Col, Row } from "react-bootstrap";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";
import OrderList from "../../../components/client/OrderList";

const Current = () => {
  return (
    <DashLayout>
      <InfoDiv></InfoDiv>

      <OrderList />
    </DashLayout>
  );
};

export default Current;
