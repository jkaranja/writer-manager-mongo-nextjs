import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

import { useDispatch } from "react-redux";

import { FaArrowRight } from "react-icons/fa";
import { loginSetClient } from "../redux/features/client-redux/clientAuthSlice";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import setToast from "../helpers/setToast";

const ConfirmEmail = ({ result }) => {
  const customId = "toast ID";
  const dispatch = useDispatch();
  //useEffect won't run on server// if no useEffect = error for local storage //no window/browser object
  useEffect(() => {
    //was success//client details
    if (result.email) {
      //update client entry state
      dispatch(loginSetClient(result));
      //store user in local storage
      localStorage.setItem("client", JSON.stringify(result));

      toast.success("Success! Email address confirmed!", {
        toastId: customId,
        autoClose: false,
      });
    } else {
      toast.error(result, { toastId: customId, autoClose: false });
    }
  }, []);

  return (
    <div>
      <Row
        className="justify-content-center mx-0 py-5"
        style={{ minHeight: "86vh" }}
      >
        <Col md="4" className="my-2 fw-bold">
          <p>Email address confirmation:</p>
          <hr />

          {result.email ? (
            <Button
              as={Link}
              href="/client/assign"
              size="md"
              variant="primary"
              className="text-white my-2"
            >
              <FaArrowRight /> Go to account
            </Button>
          ) : (
            <p className=" fw-normal">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            </p>
          )}
        </Col>
      </Row>
    </div>
  );
};

//context for ssr has res, req, query, params etc
//you can query db directly here//write your server side code here to avoid duplicate call
//the api path must be complete in axios with baseUrl///running on server//host

export const getServerSideProps = async (context) => {
  const {
    query: { id, key },
  } = context;

  let result;
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/client-api/auth/confirm",
      {
        id,
        key,
      }
    );

    result = data;
  } catch (error) {
    result = error.response.data.Error
      ? error.response.data.Error
      : `Error! Try again or contact support.`;
  }

  return {
    props: {
      result,
    },
  };
};

export default ConfirmEmail;
