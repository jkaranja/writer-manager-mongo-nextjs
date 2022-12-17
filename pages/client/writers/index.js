import { useEffect, useState } from "react";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import {
  Table,
  Form,
  Container,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import MainPagination from "../../../components/common/MainPagination";

import { useDispatch, useSelector } from "react-redux";

import {
  resetWriters,
  removeWriter,
  addWriter,
  setWriters,
  writersSelect,
} from "../../../redux/features/client/manageWSlice";
import { useRouter } from "next/router";
import DashLayout from "../../../components/layouts/DashLayout";
import InfoDiv from "../../../components/client/InfoDiv";
import axios from "axios";
import setToast from "../../../utils/setToast";
import { toast } from "react-toastify";
import { getWriters } from "./manageService";

const ManageWriters = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  //get client
  const {
    client,
    client: { token },
  } = useSelector((state) => state.clientAuth);

  //get destructured state
  const { writers } = useSelector(writersSelect);

  const clientX = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  //add writer on click
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  /* ----------------------------------------
   AUTH + FETCH + 
   ----------------------------------------*/
  const fetchWriters = async (clientX) => {
    try {
      setToast("loading", "Loading...");
      const data = await getWriters(clientX);
      //then dispatch returned id to store
      dispatch(setWriters(data));
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
    fetchWriters(clientX);
    return () => {
      dispatch(resetWriters());
    };
  }, [client, dispatch]);

  //handle change
  const handleAddWriterChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };
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
   UPDATE
   ----------------------------------------*/
  //update writer

  // const [inputs, setInputs] = useState({
  //   username: "",
  //   email: "",
  //   phoneNumber: "",
  //   accountStatus: "",
  // });

  //update input field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const updateWriterSubmit = (e) => {
    e.preventDefault();

    // dispatch(
    //   updateWriter({
    //     id: modalData._id,
    //     currEmail: modalData.email,
    //     newEmail: inputs.email,
    //     username: inputs.username,
    //     currUsername: modalData.username,
    //     phoneNumber: inputs.phoneNumber,
    //     accountStatus: inputs.accountStatus,
    //   })
    // );
    //close modal after dispatch
  };

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(8); //initial max 8 pages then ellipsis//next
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0); //initial must be zero//add start  ellipsis after 8 //prev
  //not dynamic/updated
  const [itemsPerPage] = useState(15);
  const [pageNumberLimit] = useState(8); //static page limit/both min & max setter

  //set current items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = writers.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <DashLayout>
      <InfoDiv content="Manage your writers">
        <FaInfoCircle color="#4dabff" size={20} className=" me-2" />
      </InfoDiv>

      <Row>
        <Col>
          <p className="my-4">
            Fill the details below to add a writer. We will send login details
            to the writer's email.
          </p>

          <Form
            onSubmit={(e) => {
              window.confirm("Confirm operation")
                ? handleAddWriterSubmit(e)
                : e.preventDefault();
            }}
            className="mb-5"
          >
            <Row className="">
              <Col md="3">
                <Form.Label>Writer username</Form.Label>{" "}
                <span class="text-danger">*</span>
                <Form.Control
                  type="text"
                  required
                  size="sm"
                  placeholder="Enter username"
                  name="username"
                  value={inputs.username}
                  onChange={handleAddWriterChange}
                />
              </Col>
              <Col md="3">
                <Form.Label>Email</Form.Label>
                <span class="text-danger">*</span>
                <Form.Control
                  type="email"
                  required
                  size="sm"
                  placeholder="Enter email"
                  name="email"
                  value={inputs.email}
                  onChange={handleAddWriterChange}
                />
              </Col>
              <Col md="3">
                <Form.Label>Phone number</Form.Label>
                <span class="text-danger">*</span>
                <Form.Control
                  type="text"
                  required
                  pattern="[+][2][5][4][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]"
                  size="sm"
                  placeholder="+2547********"
                  name="phoneNumber"
                  value={inputs.phoneNumber}
                  onChange={handleAddWriterChange}
                />
                <small>Format: +2547********</small>
              </Col>
              <Col className="d-flex align-items-center pt-2">
                <Button size="sm" variant="primary" type="submit">
                  Add writer
                </Button>
              </Col>
            </Row>
          </Form>

          <p className="my-2">Writers added: {currentItems.length}</p>

          {currentItems.length ? (
            <Table hover responsive="md" size="sm">
              <thead>
                <tr className="border-top">
                  <td>
                    <Form.Check type="checkbox" label="" />
                  </td>
                  <th>Writer username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Date added</th>
                  <th colSpan={2}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((writer, id) => {
                  return (
                    <tr key={writer._id}>
                      <td>
                        <Form.Check type="checkbox" />
                      </td>
                      <td>{writer.username}</td>
                      <td>{writer.email}</td>
                      <td>{writer.phoneNumber}</td>
                      <td>
                        {new Date(writer.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/[/]/g, "-")}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          // onClick={() => manageWriter(writer._id)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            window.confirm("Confirm operation") &&
                            handleRemoveWriter(writer._id)
                          }
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>You haven't added any writer yet.</p>
          )}

          <Col className="pt-3">
            <MainPagination
              items={writers}
              itemsPerPage={itemsPerPage}
              handleNextBtn={handleNextBtn}
              handlePrevBtn={handlePrevBtn}
              handlePageClick={handlePageClick}
              currentPage={currentPage}
              minPageNumberLimit={minPageNumberLimit}
              maxPageNumberLimit={maxPageNumberLimit}
            />
          </Col>
        </Col>
      </Row>
    </DashLayout>
  );
};

export default ManageWriters;
