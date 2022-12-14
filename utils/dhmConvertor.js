//create function to

//convert milliseconds to d h m //for time allocated
const dhmConvertor = (ms) => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  //exclude days if zero
  if (!days && !hours && minutes) {
    return minutes + "mins "; //ignore seconds
  }
  if (!days && hours && !minutes) {
    return hours + "hrs "; //ignore seconds
  }
  if (!days && hours && minutes) {
    return hours + "hrs " + minutes + "mins "; //ignore seconds
  }
  if (days && !hours && !minutes) {
    return days + "days "; //ignore seconds
  }
  if (days && hours && !minutes) {
    return days + "days " + hours + "hrs "; //ignore seconds
  }
  if (days && !hours && minutes) {
    return days + "days " + minutes + "mins "; //ignore seconds
  }
  
  return days + "days " + hours + "hrs " + minutes + "mins "; //ignore seconds
};

export default dhmConvertor;
