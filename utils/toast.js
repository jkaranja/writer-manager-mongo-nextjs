//update a specific toast//loading//option one using id
//will only work inside the scope/block where toast id is defined
 const id = toast.loading("Please wait...");//autoclose//closeOnclick is false by default for toast.loading//no close btn
 //use toast("Registering...", {type: 'loading'});//has autoclose, closeonclick, close btn=default behavior
 //do something else
 toast.update(id, {
   render: "All is good",
   type: "success",
   isLoading: false,
   autoClose: 5000,
   closeOnClick: true 
 });

 //update current toast with new info//option two using useRef
 //define id/ref for toast// assign toast with toast.current =, the update as toast.update(toast.current)
 const toastId = React.useRef(null);
//display toast
 toastId.current = toast("Hello", { autoClose: false }); //or toast.error, .success . warn . info
 //then update
 //check if the toast is displayed i case user close while in progress
 toast.update(toastId.current, { type: toast.TYPE.INFO, autoClose: 5000 });

 //passing progress bar for uploading files

   // we need to keep a reference of the toastId to be able to update it
  const toastId = React.useRef(null);

  onUploadProgress: (p) => {
    const progress = p.loaded / p.total;

    // check if we already displayed a toast
    if (toastId.current === null) {
      toastId.current = toast("Upload in Progress", { progress });
    } else {
      toast.update(toastId.current, { progress });
    }
  };

  //then use your isLoading is false state to close as//you you can update with a success
  toast.done(toastId.current);
//you you can update with a success
  toast.update(id, {
    render: "All is good",
    type: "success",
    isLoading: false,
    autoClose: 5000,
  });

  //or use dismiss
  toast.dismiss(toastId.current);//dismisses specific toast
  toast.dismiss(); //all toasts

  //prevent duplicate on re-render//check if toast already displayed//duplicate

//  1. //using toast.isActive(id).//NOT WORKING
 const toastId = React.useRef(null);
 if (!toast.isActive(toastId.current)) {
   toastId.current = toast("I cannot be duplicated!");
 }
//  2. give id//reco/ simple// WORKING
 const customId = "custom-id-yes";
 toast("I cannot be duplicated!", {
      toastId: customId
    });