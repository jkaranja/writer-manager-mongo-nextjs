//get writers api call
export const getWriters = async (clientX) => {
  const { data } = await clientX.get(
    "http://localhost:3000/api/clientAPI/writers/manageWriters"
  );
  //axios will throw error for you based on returned status code so you can catch them  
  return data;
};
