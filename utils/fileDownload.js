// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export const fileDownload = async (parts, fileName, token) => {
  //change this before build as api/....
  window.open(
    `api/download?parts=${parts}&fileName=${encodeURIComponent(
      fileName
    )}&token=${token}`,
    "_self"
  );

  // window.open(
  //  "http://localhost:5000/api/download?parts=uploads&fileName=2LISTICLES5JULY2022-12-10 Best Starbucks green tea.docx"
  // );
};

export default fileDownload;
