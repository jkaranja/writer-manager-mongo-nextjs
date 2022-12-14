//all nextjs  .setSomethingProps functions must be exported from under pages//not components
//GETsTATICprops() //no context object

//getServerSideProps(context) { //context has params
// /can be used as above but getInitialProps run both on server and client
//getInitialProps(context)//context has pathname, query, res, req, err, asPath

//use
//const { data, error } = useSWR('/api/user', fetch);
//It handles caching, revalidation, focus tracking, refetching on interval, and more.
import Form from "react-bootstrap/Form";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";
import { BsFillFileEarmarkArrowUpFill, BsTrash } from "react-icons/bs";
import DatePicker from "react-datepicker";

import InfoDiv from "../../components/client-components/InfoDiv";

//ref https://www.codemzy.com/blog/react-drag-drop-file-upload
//make this an upload component//pass state, setfile
//parent will only set state for files and setfile//+ delete handler in upload componet
const Assign = () => {
  //or use React-dropzone library
  // drag state
  const [dragActive, setDragActive] = React.useState(false);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // at least one file has been selected so do something
      // handleFiles(e.target.files);
    }
  };

  //YOU DON'T NEED THE BUTTON INSIDE LABEL. BUT FOR KEYBOARD USES, ADD BUTTON EVENT ONCLICK TO TRIGGER FILE SELECTOR
  //USE USEREF TO BIND THE FILE INPUT  AND BUTTON ON CLICK
  //THIS WAY YOU CAN ALSO USE UPLOAD BUTTON OUTSIDE THE LABEL
  //OR OTHER CASES WHEN YOU WANT TO HIDE INPUT FIELD AND SHOW BUTTON ONLY
  //BUT HERE YOU CAN FORMAT LABEL AS BUTTON USING 'AS={BUTTON} AND HIDE INPUT

  //USE  ref
  const inputRef = React.useRef(null);

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  //for preview
  const KILO_BYTES_PER_BYTE = 1000;

  const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);
  //delete selected from preview//remove from state

  ///timepicker
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>     

      <div>
        <Form.Group
          controlId="formFileLg"
          className="mb-3"
          id="form-file-upload"
          onDragEnter={handleDrag}
        >
          <input
            ref={inputRef}
            type="file"
            id="input-file-upload"
            multiple={true}
            onChange={handleChange}
          />
          <label
            id="label-file-upload"
            htmlFor="input-file-upload"
            className={dragActive ? "drag-active" : ""}
          >
            <div>
              <p>Drag and drop your file here or</p>
              <button className="upload-button" onClick={onButtonClick}>
                <BsFillFileEarmarkArrowUpFill className="fas fa-file-upload" />
                Upload a file
              </button>
            </div>
          </label>
          {/* NEEDED SINCE INSIDE THE DRAG AREA THERE ARE OTHER ELEMENTS THAT WILL TRIGGER DRAGLEAVE AND CAUSE FLICKERING */}
          {dragActive && (
            <div
              id="drag-file-element"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </Form.Group>
        <div className="bg-dark">
          <p className="text-white">{`file.name`}</p>
          <aside className="text-end">
            <p className="text-white text-start">
              {convertBytesToKB(456666)}fils.size kb
            </p>
            <BsTrash className="bg-white fas fa-trash-alt " />
          </aside>
        </div>
        <p>fileicon, filename(344kb), x/deleteicon</p>
      </div>

      <InfoDiv content="Assign orders">
        <FaInfoCircle color="#4dabff" size={20} className=" me-2" />
      </InfoDiv>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        Email
        <Form.Check type="checkbox" checked={false} />
        whatsapp
        <Form.Check type="checkbox" checked={false} />
      </Form>
      
    </>
  );
};

export default Assign;
