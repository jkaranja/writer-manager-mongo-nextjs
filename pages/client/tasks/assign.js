import React, { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

import DatePicker from "react-datepicker";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";
import DropFiles from "../../../components/common/DropFiles";
import {
  resetWriters,
  setWriters,
  writersSelect,
} from "../../../redux/features/client/manageWSlice";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWriters } from "../writers/manageService";
import setToast from "../../../utils/setToast";
import { clientAuthSelect } from "../../../redux/features/client/clientAuthSlice";

const Assign = () => {
  const ref = useRef();
  const dispatch = useDispatch();
  //get client/token
  const {
    client,
    client: { token },
  } = useSelector(clientAuthSelect);
  //get destructured state
  const { writers } = useSelector(writersSelect);

  /**------------------------------
    * STATES
   -------------------------------*/
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [deadline, setDeadline] = useState(null);

  const [progress, setProgress] = useState(0);

  //Other fields/file object state
  const [inputs, setInputs] = useState({
    title: "",
    budget: "",
    cWriter: "pool",
    instructions: "",
  });

  const [writerIsError, setWriterIsError] = useState(null);

  /**------------------------------
    * AXIOS CONFIG
   -------------------------------*/

  const clientX = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "multipart/form-data", //don't forget to change this when using next.js, else req.body/files = undefined since
      //multer will only accept multipart content type data stream, (parses data, upload files & forward req),  so it skips, then you disable parsing in next config = false, so the req is not parsed at no stage.
      //in express, it will work just// express.json() //will not parse the data if it has files/// also sets the correct headers for multer//but you should always set the correct headers
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

  /* --------------------------------
     AUTH + FETCH
   --------------------------------*/
  const fetchWriters = async (clientX) => {
    try {
      const data = await getWriters(clientX);
      //then dispatch returned id to store
      dispatch(setWriters(data));
    } catch (error) {
      setWriterIsError("No writers or error! Add writers or reload page.");
    }
  };
  useEffect(() => {
    //if client is null /go to login// local storage/state not set
    if (!client) {
      router.push("/login");
    }

    fetchWriters(clientX);

    return () => {
      dispatch(resetWriters());
    };
  }, [client, dispatch]);

  /* --------------------------------
     INPUTS
   --------------------------------*/

  //other fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  /* --------------------------------
     HANDLE SUBMIT
   --------------------------------*/

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]); //create files : [...files,]
    }
    //append form inputs
    //loop object// Object.keys(obj) returns array with keys
    Object.keys(inputs).forEach((key) => {
      formData.append(key, inputs[key]); //title, inputs[title]//value
      return formData;
    });
    //append deadline as well
    formData.append("deadline", deadline);

    try {
      setToast("progress", "Uploading...", progress);
      const { data } = await clientX.post(
        "http://localhost:3000/api/clientAPI/tasks/assignTask",
        formData,
        { ...uploadProgress }
      );

      setToast("success", "Task assigned. Find task under 'Current tasks'.");
    } catch (error) {
      setToast("error", error);
    }
  };

  /* --------------------------------
     TIMEPICKER
   --------------------------------*/
  //disable time before current time//can be used to filter passed date + today
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  //disable date before today//don't disable today
  const filterPassedDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate.getDate() === new Date().getDate()) {
      return currentDate.getTime() > selectedDate.getTime();
    }
    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <DashLayout>
      <InfoDiv content="Assign tasks">
        <FaInfoCircle color="#4dabff" size={20} className=" me-2" />
      </InfoDiv>

      <Row className=" bg-light p-5">
        <Form
          className="justify-content-between"
          onSubmit={(e) => {
            window.confirm("Confirm operation")
              ? handleAssignSubmit(e)
              : e.preventDefault();
          }}
        >
          <Row className="bg-white py-4 mb-2">
            <Col>
              <Form.Group className="mb-3" controlId="Title">
                <Form.Label>Task title</Form.Label>
                <span className="mx-1 text-danger">*</span>
                <Form.Control
                  required
                  size="sm"
                  type="text"
                  name="title"
                  value={inputs.title}
                  placeholder="Task title"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="budget">
                <Form.Label>Budget</Form.Label>
                <span className="mx-1 text-danger">*</span>
                <InputGroup size="sm">
                  <InputGroup.Text>Ksh</InputGroup.Text>
                  <Form.Control
                    required
                    size="sm"
                    type="number"
                    placeholder="0"
                    min={0}
                    name="budget"
                    value={inputs.budget}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="Deadline">
                <Form.Label>Assign to options</Form.Label>
                <span className="mx-1 text-danger">*</span>
                <Form.Select
                  required
                  className="mb-3"
                  size="sm"
                  aria-label="Default select example"
                  name="cWriter"
                  value={inputs.cWriter}
                  onChange={handleChange}
                >
                  <optgroup label="Add to pool">
                    <option value="pool">Any of your writers</option>
                  </optgroup>
                  <optgroup label="Specific writer">
                    {writerIsError ? (
                      <option disabled>{writerIsError}</option>
                    ) : (
                      writers.map((writer, i) => {
                        return (
                          <option key={i} value={writer._id}>
                            {writer.username}
                          </option>
                        );
                      })
                    )}
                  </optgroup>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="Deadline">
                <Form.Label>Deadline</Form.Label>
                <span className="mx-1 text-danger">*</span>
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  showTimeSelect
                  closeOnScroll={true}
                  filterTime={filterPassedTime}
                  filterDate={filterPassedDate}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select deadline"
                  className="form-control form-control-sm mb-3"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="px-0">
            <Col className="bg-white py-4">
              <Form.Group className="mb-3" controlId="instr">
                <Form.Label>Task instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Add instructions"
                  rows={6}
                  name="instructions"
                  value={inputs.instructions}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col className="bg-white py-4 ms-3">
              <Form.Group className="mb-3" controlId="uploads">
                <Form.Label>Task instruction files</Form.Label>
                <DropFiles
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="text-end">
            <Col xs={12} className=" px-0">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="my-3"
              >
                Assign Task
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    </DashLayout>
  );
};

// // get writers
// const getServerSideProps = async()=>{
// //get state token
// const clientX = axios.create({
//   baseURL: "",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// });

//   let res={writers, isError};
//   try {

//     const { data } = await clientX.post(
//       "http://localhost:3000/api/client-api/auth/manage-writers",
//       inputs
//     );

//     res = data;
//   } catch (error) {
//     res.isError = error.response.data.Error
//       ? error.response.data.Error
//       : `Error! Try again or contact support.`;
//   }

//   return {
//     props: {
//       writers: data
//     }
//   }

// }

export default Assign;
