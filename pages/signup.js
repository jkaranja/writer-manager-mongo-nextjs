import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clientAuthSelect,
  clientRegister,
  resetClientAlerts,
} from "../redux/features/client-redux/clientAuthSlice";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import alertToast from "../helpers/setToast";
import { FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import setToast from "../helpers/setToast";

const Signup = () => {
  const captchaRef = useRef(null);

  

  /*----------------------------
    INPUTS/STATE
   ----------------------------*/
  //form state object
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  //update input field values on change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  /*----------------------------
    SUBMIT FORM
  ------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    //on check, get token generated using the ref prop passed to captcha component
    //will be empty string if captcha is not checked else token//very long
    const captchaToken = await captchaRef.current.getValue();

    //if captcha is not checked//show alert, and exit
    if (!captchaToken) {
      toast.error(
        "Failed! You didn't check the reCAPTCHA. Please try again and check it."
      );
      return;
    }

    try {
      setToast("loading", "Registering...");

      const result = await axios.post("/api/client-api/auth/register", {
        ...inputs,
        captchaToken,
      });

      setToast(
        "success",
        "Success! One more thing: we've sent a confirmation link to your email. Please click it to activate your account or contact us if you didn't get the email."
      );
    } catch (error) {
      setToast("error", error);
    }

    //reset captcha but not the inputs in case failed
    captchaRef.current.reset();
  };

  return (
    <div>
      <Row
        className="justify-content-center mx-0 py-5"
        style={{ minHeight: "86vh" }}
      >
        <Col md="4">
          <Form onSubmit={handleSubmit}>
            <h3>Fill the form below to get started</h3>
            <Form.Group className="mb-3" controlId="formBasicUserName">
              <Form.Control
                required
                placeholder="Enter your username"
                type="text"
                name="username"
                value={inputs.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                required
                placeholder="Enter your email"
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                required
                minLength="6"
                pattern="[^\s]+"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
              <small>
                (Password should be at least 6 characters with no spaces)
              </small>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicRe">
              <ReCAPTCHA
                sitekey="6LeUaXsUAAAAAC5X4Emq357w78M2UIBd2Hx67kmC"
                ref={captchaRef}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <Form.Group className="text-info my-2">
              <small>
                <Form.Text className="text-info text-decoration-underline">
                  <Link href="/login">Login here</Link>
                </Form.Text>
              </small>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
