
import { toast } from "react-toastify";

const setToast = (toastType, message, progress) => {

  
  // toast.dismiss();

  const customIdL = "toast IDL";
  const customIdS = "toast IDS";
  const customIdE = "toast IDE";
  const customIdP = "toast IDP";

  if (toastType === "progress") {
    toast(message, { progress, toastId: customIdP, autoclose: false, closeOnClick: false });
  }

  if (toastType !== "progress") {
    toast.dismiss(customIdP);
  }

  if (toastType === "loading") {
    toast.loading(message, { toastId: customIdL, closeOnClick: true });
  }
  if (toastType !== "loading") {
    toast.dismiss(customIdL);
  }

  if (toastType === "success") {
    toast.success(message, { toastId: customIdS, autoClose: 30000 });
  }
  if (toastType === "info") {
    toast.info(message, { autoClose: 30000 });
  }

  if (toastType === "error") {
    //the && returns the value of first false or the last operand value if prev =true
    //the value returned by &&s is converted to bool, if true return it else return what is after ||
    //if left operand is false return next in || //returns the first true or last value if all false
    //for response axios errors, error is in object res....data.Error //must get the error property this way//otherwise empty obj//same as backend if you don';t get
    //as err.message or err.stack or toString to convert error objects to string 
    //for runtime errors in try block/ error is in err.message//error.name//error.toString()
    //error.message extracts the message part from axios 404, network errors and runtime error
    //or if err is not in .message, convert it to string() since you can't display objects in react//guaranteed to display something

    toast.error(
      (message.response &&
        message.response.data &&
        message.response.data.Error) ||
        message.message ||
        message.toString(),
      { toastId: customIdE }
    );
  }
};

export default setToast;
