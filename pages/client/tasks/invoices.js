
import { FaEdit, } from "react-icons/fa";
import { ImCheckmark, ImCross } from "react-icons/im";


import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";
import MainPagination from "../../../components/common/MainPagination";

import Link from "next/link";

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

const Invoices = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  /**------------------------------
    * AXIOS CONFIG
   -------------------------------*/
  //get client
  const {
    client,
    client: { token },
  } = useSelector((state) => state.clientAuth);

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
   AUTH + FETCH + 
   ----------------------------------------*/
  const fetchTasks = async (clientX) => {
    try {
      setToast("loading", "Loading...");
      const { data } = await clientX.get(
        "http://localhost:3000/api/clientAPI/tasks/invoiceTasks"
      );
      //then dispatch returned id to store
      dispatch(setCurrentTasks(data));
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
  }, [client, dispatch]);

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

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(8); //initial max 8 pages then ellipsis//next
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0); //initial must be zero//add start  ellipsis after 8 //prev
  const [itemsPerPage] = useState(15); //static
  const [pageNumberLimit] = useState(8); //static page limit/both min & max setter
  const [currentList, setCurrentList] = useState([]); //current list items for current page/ state
  const [taskData, setTaskData] = useState([]); //passed to pagination/set by filter

  //set current list based on filtered paginated data
  useEffect(() => {
    //set tasks for current page number//clicked
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = taskData.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentList(currentItems);
  }, [taskData, currentPage]);

  //get page/number clicked
  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit == 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  /* --------------------------------
   FILTER & CHECKED
  ---------------------------------*/
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
        writerFilter = { ...writerFilter, [task.cWriter]: task.cUsername };
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
      //if current page !==1 reset to start from page 1
      currentPage !== 1 && setCurrentPage(1);
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
    //if current page !==1 reset to start from page 1
    currentPage !== 1 && setCurrentPage(1);
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

        {currentTasks.length ? (
          <Row className="justify-content-between">
            

                <Col className="pb-3" xs="auto">
                  <Col className="px-0 text-muted"><input type="checkbox" /> Archived</Col>
                </Col>
              
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
                    <option>Ongoing</option>
                    <option>Onhold</option>
                    <option>Dispute </option>
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
      

     
        {currentList.length ? (       
          
             <>

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
            {currentList.map((task, id) => {
                return (
                  <tr key={task._id}>
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
                    // checked={checked}
                    // onClick={() => setRadioChecked(!checked)}
                  />
                  <input type="number" className="mx-3 px-0" />
                </td>
                <td>
                  <input
                    name="payType"
                    type="radio"
                    // checked={checked}
                    // onClick={() => setChecked(!checked)}
                  />
                </td>
              </tr>
              ) })}
            </tbody>
          </Table>
         </>
        ) : (
          <p>No tasks.</p>
        )}
        <Row>
        <Col xs={12} className="pt-3">
          <MainPagination
            items={taskData}
            itemsPerPage={itemsPerPage}
            handleNextBtn={handleNextBtn}
            handlePrevBtn={handlePrevBtn}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            minPageNumberLimit={minPageNumberLimit}
            maxPageNumberLimit={maxPageNumberLimit}
          />
        </Col>
      </Row>
    </DashLayout>
  );
};

export default Invoices;









