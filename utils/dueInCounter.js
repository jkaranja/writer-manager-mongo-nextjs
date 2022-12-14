//----------------------------------
    //DUE IN COUNTER IN MS
    //----------------------------------
const dueInCounter = ()=>{
    
    const deadlineCounter = [];
    for (let i = 30 * 60000; i <= 80640 * 60000; i += 30 * 60000) {
      //===30min
      if (i === 30 * 60000) { deadlineCounter.push({ ms: i, text: "30 mins" }); }
      // 1 hr
      else if (i === 60 * 60000) { deadlineCounter.push({ ms: i, text: "1 hr" }); }
      //up to 1440
      else if (i < 1440 * 60000) {
        deadlineCounter.push({ ms: i, text: `${i / (60 * 60000)} hrs` });
      }
      //days
      else if (i === 1440 * 60000) {
        for (let index = 1440 * 60000; index <= 8640 * 60000; index += 1440 * 60000) {
          i = index; //inc i
          if (index === 1440 * 60000) {
            deadlineCounter.push({ ms: index, text: `${index / (1440 * 60000)} day` });
          } else {
            deadlineCounter.push({ ms: index, text: `${index / (1440 * 60000)} days` });
          }
        } //weeks
      } else if (i > 8640 * 60000) {
        for (let j = 10080 * 60000; j <= 80640 * 60000; j += 10080 * 60000) {
          i = j; //inc i
          if (j === 10080 * 60000) {
            deadlineCounter.push({ ms: j, text: `${j / (10080 * 60000)} week` });
          } else {
            deadlineCounter.push({ ms: j, text: `${j / (10080 * 60000)} weeks` });
          }
        }
      }
    }

return deadlineCounter;

  }

  export default dueInCounter