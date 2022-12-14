
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import ActionAlert from "./client-components/ActionAlert";
import axios from "axios";
import { useState } from "react";

const Reset = () => {
  //action alerts
  const [success, setSuccess] = useState();
  const [failed, setFailed] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();

  const [email, setEmail] = useState();

  const client = axios.create({
    baseURL: "/api/user",
    headers: {
      "Content-Type": "application/json",
    },
  });
  //process form
  const handleSubmit = async (e) => {
    e.preventDefault();

    //send inputs
    try {
      setLoading(true);
      setFailed(false);
      setSuccess(false);
      setMessage(null);
      // localhost: 3000 / api / client - api / auth / reset;

      const reset = await client.post("/reset", { email });
      //if axios returns error/ execution terminates and move to catch //success won't show

      setLoading(false);
      setFailed(false);
      setSuccess(true);
      setMessage(`Success! Login credentials sent to your email.`);
    } catch (error) {
      //catch will handle errors from server based on error status codes

      setFailed(true);
      setLoading(false);
      setSuccess(false);
      //extract error from server from error object
      setMessage(`${error.response.data.Error}`);
    }
  };

  return (
    <div>
      <Row
        className="justify-content-center mx-0 py-5"
        style={{ minHeight: "86vh" }}
      >
        <Col md="4">
          <Form onSubmit={handleSubmit}>
            <p>Enter your email to reset password</p>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                required
                placeholder="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Reset
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Reset;
