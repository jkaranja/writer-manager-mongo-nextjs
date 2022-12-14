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
import { FaCheck, FaEdit, FaRegCheckSquare, FaRegTrashAlt } from "react-icons/fa";
import { ImCheckboxChecked, ImCheckmark, ImCross } from "react-icons/im";

import { RiStarLine } from "react-icons/ri";

import style from "../../../styles/order.module.css";
import Link from "next/link";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";

const Invoices = () => {
  const [checked, setChecked] = useState(false);
  return (
    <DashLayout>
      <InfoDiv></InfoDiv>
      <Row>
        <Row className=" py-2 mx-0 justify-content-end">
          <Col className="px-0 text-muted"><input type="checkbox" /> Archived</Col>
          <Col md={2}>
            <Form.Select size="sm">
              <option>Filter by status</option>
              <option value="1">Ongoing</option>
              <option value="2">Onhold</option>
              <option value="3">Completed</option>
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
        <Row className="justify-content-end">
          <Col></Col>
          <Col md={4} className="my-3">
            <span className="mx-3 fw-bold text-muted">Selected: 20</span>
            <span className="fw-bold text-muted">Amount Due: 20</span>

            <Button variant="primary" className="float-end">
              Mark as Paid
            </Button>
          </Col>
        </Row>

        <Row>
          <Table responsive="lg" className="task-table" bordered>
            <thead>
              <tr>
                <th colSpan={5}></th>
                <th colSpan={2}>
                  Invoice{" "}
                  <span className="float-end mx-2 text-info">
                    <FaEdit className="mx-1" />
                    Edit
                  </span>
                </th>
                <th colSpan={2}>
                  Payment
                  <span className="float-end mx-2 text-info">
                    <FaEdit className="mx-1" />
                    Edit
                  </span>
                </th>
              </tr>

              <tr>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <th>ID</th>
                <th>Writer</th>
                <th style={{ width: "30%" }}>Task subject</th>
                <th>status</th>
                <th>Budget(Ksh)</th>
                <th>Invoice Amount</th>
                <th>Partial</th>

                <th>Full</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td className="text-primary">#123</td>
                <td>John k</td>
                <td>React Table Editable Data Example...</td>
                <td>ongoing</td>
                <td>
                  <span>4500/=</span>
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Invoice amount"
                    className="mx-0 "
                  />
                </td>
                <td>
                  <input
                    name="payType"
                    type="radio"
                    checked={checked}
                    onClick={() => setRadioChecked(!checked)}
                  />
                  <input type="number" className="mx-3 px-0" />
                </td>
                <td>
                  <input
                    name="payType"
                    type="radio"
                    checked={checked}
                    onClick={() => setChecked(!checked)}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <div>
            //hide archived orders//only current/completed//you can add check
            box to include them. orderPayments //invoice per writer//tasks with
            paid status x //Enable invoice editing/then edit mode//then save/ or
            request invoice from writer btn//mark as paid //select tasks//bulk//
            swap options///to request invoice for selected//makrk as paid
            partial Amount//Full Amaount //radio btn//if partial//paaid status
            is false paid in full //if there is any unread message for any order
            thread, bold row text//click insie cell to Editable //on out of
            focus// save//show record//save paid//invoice//enable witer invoice
            will be from writer saved toast //will have same api//grab order id,
            cell name//value //create a page for invoice //create a whole page
            for invoice//edit table/invoice//per writer //save changes //in edit
            mode// mark as paid is disabled //filter is //writer
            //status-paid//unpaid default//bordered table //in ongoing//include
            a button to go to invoice//invoice will have total budget//total
            invoice //in row Buget paid invoice //
          </div>
        </Row>
        {/* <OrderItem /> */}
      </Row>
    </DashLayout>
  );
};

export default Invoices;
