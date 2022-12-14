import Form from "react-bootstrap/Form";
import React from "react";

import { Button, ButtonGroup, Col, Row, CloseButton } from "react-bootstrap";
import { FaFileUpload, FaInfoCircle } from "react-icons/fa";
import { BsFillFileEarmarkArrowUpFill, BsTrash } from "react-icons/bs";

const DropFiles = ({ selectedFiles, setSelectedFiles }) => {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);

  /*------------------------------------------
  /FileList returned by drop and onchange events
  ------------------------------------------*/
  //FileList is not an array bt object wil arrays of files
  //you can iterate it with a for loop bt not with any array iterator//eg map/filter
  //use either of below mtd to convert to array to use iterators
  // const files = [...filesList];
  // const fileListAsArray = Array.from(fileList);

  /* -------------------------------
/BYTES TO KILOBYTES FOR PREVIEW
---------------------------------*/
  const KILO_BYTES_PER_BYTE = 1000;

  const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

  /* -------------------------------
/LINK UPLOAD BTN TO FILE INPUT/
---------------------------------*/
  const inputRef = React.useRef(null);
  // triggers the input when the button is clicked
  const handleUploadBtn = () => {
    inputRef.current.click();
  };

  /* ---------------------------------
/LISTEN FOR DRAG ON AREA & SET EFFECT
--------------------------------------*/
  // handle drag events//when you drag over the area//
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /* -------------------------------
/HANDLE DRAG UPLOAD FOR DROPPED FILES
--------------------------------------*/
  // triggers when file is dropped inside the area//input not needed here//drop area used
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      //update selected files state
      setSelectedFiles([...selectedFiles, ...e.dataTransfer.files]);
    }
  };

  /* -------------------------------------
/HANDLE NORMAL FILE UPLOAD/BTN OR LABEL AREA CLICK
-----------------------------------------*/
  // triggers when file is selected with click//input used
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      //update selected files state
      setSelectedFiles([...selectedFiles, ...e.target.files]);
    }
  };

  /* ----------------------
/REMOVE FILE FROM LIST
-------------------------*/
  const handleDeleteBtn = (filename) => {
    setSelectedFiles((prev) => {
      return prev.filter((file) => file.name !== filename);
    });
  };

 

  return (
    <div>
      <Form.Group
        className="mb-3"
        id="form-file-upload"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Form.Control
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <Form.Label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p className="my-2">Drag and drop your file here </p>
            <ButtonGroup>
              <Button
                variant="outline-info fw-bold shadow-none upload-button "
                onClick={handleUploadBtn}
              >
                <FaFileUpload color="#0dcaf0" size={20} className=" me-2" />
              </Button>
              <Button
                variant="outline-info fw-bold shadow-none upload-button"
                onClick={handleUploadBtn}
              >
                Upload Files
              </Button>
            </ButtonGroup>
          </div>
        </Form.Label>
      </Form.Group>

      {selectedFiles.map((file) => (
        <div className=" upload-file-preview" key={file.name}>
          <span>{file.name.slice(0, 50).trim()}</span>
          <span>{convertBytesToKB(file.size)} kb</span>

          <CloseButton onClick={() => handleDeleteBtn(file.name)} />
        </div>
      ))}
    </div>
  );
};

export default DropFiles;
