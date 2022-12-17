import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  clientAuthSelect,
  loginSetClient,
} from "../redux/features/client/clientAuthSlice";
import {
  loginSetWriter,
  writerAuthSelect,
} from "../redux/features/writer/writerAuthSlice";
import { toast } from "react-toastify";
import setToast from "../utils/setToast";
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const currClient = useSelector(clientAuthSelect).client;
  const currWriter = useSelector(writerAuthSelect).writer;

  useEffect(() => {
    //if local storage is set/login them auto
    if (currClient && currClient._userType === "client") {
      router.push("/client/tasks/assign");
    } else if (currWriter && currWriter._userType === "writer") {
      router.push("/writer/tasks/available");
    }
  }, []);

  /*----------------------------
    INPUTS/STATE
   ----------------------------*/

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  //update input field values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const client = axios.create({
    baseURL: "/api/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  //process form
  const handleSubmit = async (e) => {
    e.preventDefault();

    //send inputs
    try {
      setToast("loading", "Logging in...");

      const { data } = await client.post("commonAPI/login", inputs);

      //then login to the right dash
      if (data._userType === "client") {
        //update client entry state
        dispatch(loginSetClient(data));
        //set local storage/ when it reload setting default/next load
        localStorage.setItem("client", JSON.stringify(data));
        //the route
        router.push("/client/assign");
      } else if (data._userType === "writer") {
        //update writer entry state
        dispatch(loginSetWriter(data));
        //set writer local storage
        localStorage.setItem("writer", JSON.stringify(data));
        //the route
        router.push("/writer/available");
      }
      toast.dismiss(); //important//close loading toast
    } catch (error) {
      //catch will handle errors from server based on error status codes
      setToast("error", error);
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
            <h3>Log in below</h3>
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
                placeholder="Enter your password"
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
            <Form.Group className="text-info my-2">
              <small>
                <Form.Text className="text-info text-decoration-underline">
                  <Link href="/reset">Forgot password</Link>
                </Form.Text>
              </small>
            </Form.Group>
            <Form.Group className="text-info my-2">
              <small>
                <Form.Text className="text-info text-decoration-underline">
                  <Link href="/signup" reloadDocument>
                    Sign up here
                  </Link>
                </Form.Text>
              </small>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
