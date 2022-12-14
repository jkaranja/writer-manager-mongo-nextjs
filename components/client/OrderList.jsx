import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { BsBoxArrowRight } from "react-icons/bs";
import { ImCheckboxChecked, ImCheckmark, ImCross } from "react-icons/im";

import { RiStarLine } from "react-icons/ri";
import OrderItem from "./OrderItem";
import style from "../../styles/order.module.css";
import Link from "next/link";



const OrderList = () => {

  const [checked, setChecked] = useState(false)



/**---------------------
 * Handle Checked
 ------------------------*/

 const [allChecked, setAllChecked] = useState(false);

 const handleChecked =(id)=>{
  //id or all if else

  //toggle all !isChecked//toggle
  //order is checked comes from order.isChecked//use handle checkd to toggle this order

 }

  return (
    <Row>
      <Row className=" py-2 mx-0 justify-content-end">
        <Col className="px-0 text-muted">Selected: 20</Col>
        <Col md={2}>
          <Form.Select size="sm">
            <option>Filter by status</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select size="sm">
            <option>Filter by writer</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col xs={2} className="">
          <InputGroup className="mb-3 border border-info " size="sm">
            <InputGroup.Text className="rounded-0 bg-info text-white">
              Move To
            </InputGroup.Text>
            <Form.Select size="sm" className="rounded-0 border-0">
              <option>Completed</option>
              <option>Archive </option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={2}>
          <InputGroup className="mb-3 border border-info " size="sm">
            <InputGroup.Text className="rounded-0 bg-info text-white">
              Status
            </InputGroup.Text>
            <Form.Select className="rounded-0 border-0" size="sm">
              <option>pool//fill dynamic//current status</option>
              <option>Ongoing</option>
              <option>Onhold</option>
              <option>Dispute </option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col>
          <Button
            variant="danger border border-danger"
            size="sm"
            className=" py-1 px-4"
          >
            Delete
          </Button>{" "}
        </Col>
      </Row>

      <Row>
        <Table responsive="lg" hover>
          <thead>
            <tr>
              <th>
                <Form.Check type="checkbox" />
              </th>
              <th>ID</th>
              <th>Writer</th>
              <th style={{ width: "30%" }}>Task subject</th>
              <th>Budget(Ksh)</th>
              <th>status</th>
              <th>Paid</th>
              <th>date</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={checked}
                  onClick={() => setChecked(!checked)}
                />
              </td>
              <td className="text-info">
                <Link href="/client/3">#id</Link>
              </td>
              <td>John k</td>
              <td>React Table Editable Data Example...</td>
              <td>4000/=</td>
              <td>
                <span>Ongoing</span>
              </td>

              <td>
                {true ? (
                  <ImCheckmark className="text-info" />
                ) : (
                  <ImCross className="text-danger" />
                )}
              </td>
              <td>{new Date().toLocaleDateString()}</td>
              <td>
                <Link href="/client/3">
                  <BsBoxArrowRight className="text-info" />
                </Link>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
      {/* <OrderItem /> */}
    </Row>
  );
};

export default OrderList;
