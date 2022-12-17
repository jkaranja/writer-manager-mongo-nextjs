import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";

import Link from "next/link";
import { ImCheckmark } from "react-icons/im";
import { BsBoxArrowRight } from "react-icons/bs";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  currentTasksSelect,
  resetCurrentTasks,
  setCurrentTasks,
} from "../../../redux/features/client/currentTasksSlice";
import axios from "axios";
import setToast from "../../../utils/setToast";
import { toast } from "react-toastify";
import { server } from "../../../config/server";
import { clientAuthSelect } from "../../../redux/features/client/clientAuthSlice";
import CustomPagination from "../../../components/common/CustomPagination";

const Current = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  /**------------------------------
    * AXIOS CONFIG
   -------------------------------*/
  //get client
  const {
    client,
    client: { token },
  } = useSelector(clientAuthSelect);

  //get destructured state
  const { currentTasks } = useSelector(currentTasksSelect);

  const clientX = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  /**------------------------------
    * STATES
   -------------------------------*/

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const itemsPerPage = 15;

  console.log(currentPage)

  /* ----------------------------------------
   AUTH + FETCH + 
   ----------------------------------------*/
  const fetchTasks = async (clientX) => {
    try {
      setToast("loading", "Loading...");
      const {
        data: { result, pages },
      } = await clientX.get(
        `${server}/api/clientAPI/tasks/currentTasks?page=${currentPage}&size=${itemsPerPage}`
      );

      setTotalPages(pages);
      //then dispatch returned id to store
      dispatch(setCurrentTasks(result));
      toast.dismiss();
    } catch (error) {
      setToast("error", error);
    }
  };

  useEffect(() => {
    //if client is null /go to login// local storage/state not set
    if (!client) {
      router.push("/login");
    }
    fetchTasks(clientX);
    return () => {
      dispatch(resetCurrentTasks());
    };
  }, [client, dispatch, currentPage]);

  /* ----------------------------------------
   ADD WRITER
   ----------------------------------------*/

  const handleAddWriterSubmit = async (e) => {
    e.preventDefault();

    try {
      setToast("loading", "Loading...");
      const { data } = await clientX.post(
        "http://localhost:3000/api/clientAPI/writers/manageWriters",
        inputs
      );
      //then dispatch to store
      dispatch(addWriter(data));

      setToast(
        "success",
        "Writer added. We have sent login details to the writer's email."
      );
    } catch (error) {
      setToast("error", error);
    }
  };

  /* ----------------------------------------
   REMOVE
   ----------------------------------------*/
  const handleRemoveWriter = async (id) => {
    try {
      setToast("loading", "Loading...");
      const { data } = await clientX.delete(
        `http://localhost:3000/api/clientAPI/writers/manageWriters/${id}`
      );

      //then dispatch returned id to store
      dispatch(removeWriter(data));

      toast.dismiss();
    } catch (error) {
      setToast("error", error);
    }
  };

  /* --------------------------------
   FILTER & CHECKED
  ---------------------------------*/
  const [taskData, setTaskData] = useState([]);

  const [selectedWriter, setSelectedWriter] = useState("");
  const [title, setTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  //checked
  const [checkedCount, setCheckedCount] = useState(0);
  const [allChecked, setAllChecked] = useState(false);
  let count = 0;

  //filter by writer/get all writers for tasks available
  let writerFilter = {};
  if (currentTasks.length) {
    currentTasks.forEach((task, id) => {
      if (task.cWriter) {
        writerFilter = { ...writerFilter, [task.cWriter.email]: task.cWriter.username };
      }
    });
  }

  //=======APPLY FILTER CHANGES TO task DATA========
  useEffect(() => {
    //set initial tasks if no filter
    if (!selectedWriter && !title && !taskStatus) {
      //reset allChecked to default/false
      setAllChecked(false);
      setCheckedCount(0);
     
      setTaskData(currentTasks);
      return;
    }
    //first check if selected writer state is valid
    //after review actions if no task with current selected writer state, reset it and exit//causes re-render
    if (selectedWriter) {
      if (!(selectedWriter in writerFilter)) {
        setSelectedWriter("");
        return;
      }
    }

    const newData = currentTasks.filter((task) => {
      //writer filter//if empty set filter true/allow task to be returned
      const currWriterFilter = selectedWriter
        ? task.cWriter === selectedWriter
        : true;
      //title
      const titleFilter = title
        ? task.title.toLowerCase().includes(title.toLowerCase())
        : true;
      //status
      const statusFilter = taskStatus
        ? task.taskStatus.toLowerCase().includes(taskStatus.toLowerCase())
        : true;

      return currWriterFilter && titleFilter && statusFilter;
    });

    //reset allChecked to default/false
    setAllChecked(false);
    setCheckedCount(0);
   
    setTaskData(newData);
  }, [currentTasks, selectedWriter, title, taskStatus]);

  /*-----------------------------------------------
  HANDLE CHECK CLICK
  -----------------------------------------------*/
  const handleChecked = (id) => {
    //all !isChecked
    if (id === "all") {
      const updatedData = taskData.map((task) => {
        //only when allChecked will be set to true
        if (!allChecked) {
          count++;
        }
        return { ...task, isChecked: !allChecked };
      });

      setCheckedCount(count);
      setAllChecked(!allChecked);
      setTaskData(updatedData);
      return; //exit
    }
    //single check//update check status and amount//combined
    const updatedData = taskData.map((task) => {
      if (task._id === id) {
        //when clicked is false>true
        if (!task.isChecked) {
          count++;
        }
        return { ...task, isChecked: !task.isChecked };
      }
      //others/true
      if (task.isChecked) {
        count++;
      }
      return task;
    });
    //update states
    setCheckedCount(count);
    setTaskData(updatedData);
  };

  /*--------------------------------------------
  HANDLE CHECKED DISPATCH
  ---------------------------------------------*/

  return (
    <DashLayout>
      <InfoDiv></InfoDiv>

      <Row>
        {currentTasks.length ? (
          <Row className="justify-content-between">
            {checkedCount ? (
              <>
                <Col xs={12} className="mb-1">
                  <span>Selected: {checkedCount}</span>
                </Col>

                <Col className="pb-3" xs="auto">
                  <Row>
                    <Col>
                      <InputGroup className="mb-3 btask btask-info " size="sm">
                        <InputGroup.Text className="rounded-0 bg-info text-white">
                          Move To
                        </InputGroup.Text>
                        <Form.Select size="sm" className="rounded-0 btask-0">
                          <option>Completed</option>
                          <option>Archived </option>
                        </Form.Select>
                      </InputGroup>
                    </Col>
                    <Col>
                      <InputGroup className="mb-3 btask btask-info " size="sm">
                        <InputGroup.Text className="rounded-0 bg-info text-white">
                          Status
                        </InputGroup.Text>
                        <Form.Select className="rounded-0 btask-0" size="sm">
                          <option>Ongoing</option>
                          <option>Onhold</option>
                          <option>Starred </option>
                        </Form.Select>
                      </InputGroup>
                    </Col>
                    <Col>
                      <Button
                        variant="danger btask btask-danger"
                        size="sm"
                        className=" py-1 px-4"
                      >
                        Delete
                      </Button>{" "}
                    </Col>
                  </Row>
                </Col>
              </>
            ) : (
              <Col className="mb-1">
                <span>Selected: {checkedCount}</span>
              </Col>
            )}
            <Col xs={12} md={9} lg={9} xl={7} xxl={6} className="pb-3">
              <Row>
                <Col className="pe-0">
                  <Form.Select
                    required
                    className="mb-3"
                    size="sm"
                    value={selectedWriter}
                    onChange={(e) => setSelectedWriter(e.target.value)}
                  >
                    <option value="">Filter by writer</option>
                    {Object.keys(writerFilter).map((writer, id) => {
                      return (
                        <option key={id} value={writer}>
                          {writerFilter[writer]}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
                <Col className="px-1">
                  <Form.Select
                    required
                    className="mb-3"
                    size="sm"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                  >
                    <option>Filter by status</option>
                    <option>Pool</option>
                    <option>Ongoing</option>
                    <option>Onhold</option>
                  </Form.Select>
                </Col>
                <Col className="px-0">
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="By title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}
      </Row>

      <Row>
        {taskData.length ? (
          <Table responsive="lg" hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={allChecked}
                    onChange={() => handleChecked("all")}
                  />
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
              {taskData.map((task, id) => {
                return (
                  <tr key={task._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={task.isChecked}
                        onClick={() => handleChecked(task._id)}
                      />
                    </td>
                    <td className="text-info">
                      <Link href={`/client/tasks/${task._id}`}>#id</Link>
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
                      <Link href={`/client/tasks/${task._id}`}>
                        <BsBoxArrowRight className="text-info" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No tasks.</p>
        )}
        <Col xs={12} className="pt-3">
          <CustomPagination
            page={currentPage}
            pages={totalPages}
            changePage={setCurrentPage}
          />
        </Col>
      </Row>
    </DashLayout>
  );
};

export default Current;
