///export async function getStatciPros(context);  context.params.id
//<Link href={`/blog/${encodeURIComponent(post.slug)}`}></Link>
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import InfoDiv from "../../components/client-components/InfoDiv";
import style from "../../styles/order.module.css";
import { BiArrowBack } from "react-icons/bi";
import Button from "react-bootstrap/Button";

import Link from "next/link";
import DashLayout from "../../components/client-components/DashLayout";
const SingleOrder = () => {

  //use useEffect to fetch//ot getServerprops
  // if (isLoading) {
  //   return <Spinner />;
  // }

  
  return (
    <DashLayout>
      <InfoDiv content="Order Id: 349"></InfoDiv>

      <Row className={style.singleContainer}>
        <Col className={style.singleTop}>
          <div className={style.topItem}>
            <Link href="/client/current">
              <BiArrowBack color="#4dabff" size={18} className=" me-2" />
            </Link>
          </div>
          <div className={style.topItem}>
            <Button variant="primary" size="sm" className="mx-3">
              Approve
            </Button>
            <Button variant="danger" size="sm">
              Cancel
            </Button>
          </div>
        </Col>

        <Col xs={12} className={style.singleMain}>
          <div className={style.orderInfo}>
            <h4>Topic: Removes all borders on the table and cells,</h4>
            <p className="text-secondary">
              <span className="me-3 my-2">Word count: 400</span>
              <span className="me-3 my-2">Total price: 1200/=</span>
              <span className="me-3 my-2">Files:</span>
              <span className="me-3 my-2 float-end text-danger">
                Deadline: Thur 2:30pm
              </span>
            </p>

            <p className="text-secondary">Instructions</p>
            <p className="text-secondary">Files</p>
          </div>
          <div
            className={`border-top mx-0 px-3 bg-light  ${style.orderThread}`}
          >
            <Row
              xs={12}
              className={`border bg-white justify-content-between pe-3 py-1 my-3 mx-1   ${style.threadCard}`}
            >
              <Col md={9} className=" my-3 pb-0 ">
                <p>
                  including table header.Removes all borders on the table and
                  cells, including table header{" "}
                </p>

                <p>2 Attachments: </p>
                <p className="my-1 text-info">Files 1: </p>
                <p className="my-1 text-info">Files 2: </p>
              </Col>
              <Col className="text-md-end">
                <p>Dec 3 </p>
              </Col>
              <Col xs={12} className="text-end">
                <Button variant="light" size="sm" className="text-danger">
                  Delete
                </Button>
              </Col>
            </Row>
            <Row
              xs={12}
              className={`border bg-white justify-content-between pe-3 my-3 mx-1   ${style.threadCard}`}
            >
              <Col md={9} className=" my-3">
                <p>Messahe...hello </p>
                <p>Messahe...hello </p>
                <p>Messahe...hello </p>
                <p>Messahe...hello </p>
              </Col>
              <Col className="text-end">
                <p>Dec 3 </p>
              </Col>
            </Row>
            <Col className="py-2">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Conversation</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>

              <Col className="text-end">
                <Button variant="primary" size="sm" className="float-start">
                  Small button
                </Button>
                <span className="me-2">
                  <Form.Check
                    type="checkbox"
                    checked={false}
                    className="d-inline me-1"
                  />
                  Email
                </span>
                <span>
                  <Form.Check
                    type="checkbox"
                    checked={false}
                    className="d-inline me-1"
                  />
                  whatsapp
                </span>
              </Col>
            </Col>
          </div>
        </Col>
      </Row>
    </DashLayout>
  );
};

export default SingleOrder;
