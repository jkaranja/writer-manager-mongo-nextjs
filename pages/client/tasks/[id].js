///export async function getStatciPros(context);  context.params.id
//<Link href={`/blog/${encodeURIComponent(post.slug)}`}></Link>

import style from "../../../styles/order.module.css";
import { BiArrowBack } from "react-icons/bi";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";
import MainPagination from "../../../components/common/MainPagination";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import setToast from "../../../utils/setToast";
import { server } from "../../../config/server";
import { FaFileDownload } from "react-icons/fa";
import fileDownload from "../../../utils/fileDownload";
import DropFiles from "../../../components/common/DropFiles";
import { clientAuthSelect } from "../../../redux/features/client/clientAuthSlice";
import {
  addThreadMessage,
  resetAlerts,
  threadSelect,
} from "../../../redux/features/client/threadSlice";

import { getThread } from "../../../redux/features/client/threadSlice";

const SingleTask = () => {
  const router = useRouter();
  const ref = useRef();

  const {
    isReady,
    query: { id },
  } = useRouter();

  const dispatch = useDispatch();

  //get client
  const {
    client,
    client: { token },
  } = useSelector(clientAuthSelect);

  //get client
  const { thread, singleTask, isError, isLoading, isSuccess, message } =
    useSelector(threadSelect);

  /**------------------------------
    * STATES
   -------------------------------*/
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [threadMessage, setThreadMessage] = useState("");

  const [progress, setProgress] = useState(0);
  /** Alerts------------------------ */

  useEffect(() => {
    if (isLoading) {
      setToast("loading", message);
    } else if (progress) {
      setToast("progress", "Sending...", progress);
    }
    if (isSuccess) {
      message ? setToast("success", message) : toast.dismiss();
      dispatch(resetAlerts());
    } else if (isError) {
      setToast("error", message);
      dispatch(resetAlerts());
    }
  }, [isSuccess, isError, progress, isLoading]);

  /**------------------------------
    * AXIOS CONFIG
   -------------------------------*/

  const clientX = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  //progress object
  const uploadProgress = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setProgress(percentage);
    },
  };
  /* ----------------------------------------
   AUTH + FETCH + 
   ----------------------------------------*/

  useEffect(() => {
    //if client is null /go to login// local storage/state not set
    if (!client) {
      router.push("/login");
    }
    //check if router is ready to use id else id is undefined on api route//add isReady or outer in arr dep in useEff
    if (!isReady) return;
    //fetch thread
    dispatch(getThread(id));
  }, [client, dispatch, isReady]);

  /* ----------------------------------------
   HANDLE SUBMIT
   ----------------------------------------*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]); //create files : [...files,]
    }
    formData.append("threadMessage", threadMessage);
    formData.append("task", singleTask._id);
    formData.append("sender", client.email);

    dispatch(addThreadMessage({ formData, uploadProgress }));
    //clear on submit 
    setSelectedFiles([]);
    setThreadMessage("");
  };
  
  

  return (
    <DashLayout>
      <InfoDiv content="Order Id: 349"></InfoDiv>

      {Object.keys(singleTask).length ? (
        <Row className={style.singleContainer}>
          <Col className={style.singleTop}>
            <div className={style.topItem}>
              <a href="#" onClick={() => history.back()}>
                <BiArrowBack color="#4dabff" size={18} className=" me-2" />
              </a>
            </div>
            <div className={style.topItem}>
              <Button variant="primary" size="sm" className="mx-3">
                Move
              </Button>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </Col>

          <Col xs={12} className={style.singleMain}>
            <div className={style.orderInfo}>
              <h4>{singleTask.title}</h4>
              <p className="text-secondary">
                <span className="me-3 my-2">Word count: 400</span>
                <span className="me-3 my-2">Total price: 1200/=</span>
                <span className="me-3 my-2">Files:</span>
                <span className="me-3 my-2 float-end text-danger">
                  <span className="text-info text-muted mx-2 ">Deadline:</span>
                  {new Date(singleTask.deadline).toLocaleString()}
                </span>
              </p>

              <p className="text-secondary">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  readOnly
                  as="textarea"
                  rows={1}
                  className=" bg-white"
                  value={singleTask.instructions}
                />
              </p>
              <p className="text-secondary">
                Instruction Files
                {singleTask.instructionFiles &&
                singleTask.instructionFiles.length ? (
                  singleTask.instructionFiles.map((file, id) => {
                    return (
                      <p
                        key={id}
                        className="text-info text-decoration-underline"
                      >
                        <li
                          style={{ display: "block", cursor: "pointer" }}
                          onClick={() =>
                            fileDownload("uploads_inst", file, token)
                          }
                        >
                          <FaFileDownload className="text-info" />
                          {file}
                        </li>
                      </p>
                    );
                  })
                ) : (
                  <p>No files</p>
                )}
              </p>
            </div>
            <div
              className={`border-top mx-0 px-3 bg-light  ${style.orderThread}`}
            >
              {thread.map((threadMess) => {
                return (
                  <Row
                    key={threadMess._id}
                    xs={12}
                    className={`border bg-white justify-content-between pe-3 py-1 my-3 mx-1   ${style.threadCard}`}
                  >
                    <Col md={9} className=" my-3 pb-0 ">
                      <p>{threadMess.threadMessage}</p>

                      <p className="text-secondary">
                        Attachments
                        {threadMess.threadFiles &&
                        threadMess.threadFiles.length ? (
                          threadMess.threadFiles.map((file, id) => {
                            return (
                              <p
                                key={id}
                                className="text-info text-decoration-underline"
                              >
                                <li
                                  style={{
                                    display: "block",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    fileDownload("uploads_thr", file, token)
                                  }
                                >
                                  <FaFileDownload className="text-info" />
                                  {file}
                                </li>
                              </p>
                            );
                          })
                        ) : (
                          <p>No files</p>
                        )}
                      </p>
                    </Col>
                    <Col className="text-md-end">
                      <p>{new Date(threadMess.updatedAt).toLocaleString()}</p>
                    </Col>
                    <Col xs={12} className="text-end">
                      <Button variant="light" size="sm" className="text-danger">
                        Delete
                      </Button>
                    </Col>
                  </Row>
                );
              })}

              <Col className="py-2 my-3">
                <Form
                  onSubmit={(e) =>
                    window.confirm("Confirm operation")
                      ? handleSubmit(e)
                      : e.preventDefault()
                  }
                >
                  <Form.Group className="mb-3" controlId="instr">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      required
                      placeholder="Enter message"
                      rows={6}
                      name="message"
                      value={threadMessage}
                      onChange={(e) => setThreadMessage(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="uploads">
                    <Form.Label>Attach files</Form.Label>
                    <DropFiles
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" size="sm">
                    Submit
                  </Button>
                </Form>
              </Col>
            </div>
          </Col>
        </Row>
      ) : (
        <span>Failed to load. Please reload page.</span>
      )}
    </DashLayout>
  );
};

//won't work since server doesn't know who is logged in i.e no token//
//only pre-render data that is public and don't need authentication to see
//eg blog posts/products/
// export const getServerSideProps = async (context) => {

//   let result;
//   try {
//     const { data } = await axios.get(
//       `http://localhost:3000/api/clientAPI/tasks/${context.params.id}`);
//     result = data;
//   } catch (error) {
//     result = error.response.data.Error
//       ? error.response.data.Error
//       : `Error! Try again or contact support.`;
//   }

//   return {
//     props: {
//       result,
//     },
//   };
// };

export default SingleTask;
