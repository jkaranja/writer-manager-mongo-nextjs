import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import style from "../../styles/order.module.css";
import { RiStarLine } from "react-icons/ri";
import Link from "next/link";

const OrderItem = () => {
  return (
    <>
      {[...Array(5).fill()].map((item, i) => (
        <Row key={i} className="style.grid">
          <Link href={`/client/${encodeURIComponent("3")}`}>
            <Col className={style.orderCard}>
              <div className={style.cardItem}>
                <Form.Check type="checkbox" checked={false} />
                <RiStarLine color="#4dabff" size={18} className=" me-2" />
              </div>
              <div className={style.cardItem}>
                <span>John K</span>
              </div>

              <div className={style.cardItem}>
                <span>
                  {`Removes all borders on the table and cells, including table
                header.Removes all borders on the table and cells, including
                table header.Removes all borders on the table and cells,
                including table header.`.slice(0, 140) + "..."}
                </span>
              </div>
              <div className={style.cardItem}>Dec 3</div>
              <div className={style.cardItem}>Delete icon</div>
            </Col>
          </Link>
        </Row>
      ))}
    </>
  );
};

export default OrderItem;
