import axios from "../../utils/axiosInstance";

const session_EndPoint = "/api/session";

// Create Session Function
const createSession = async (classId, sessionName) => {
  const response = await axios.post(`${session_EndPoint}/create`, {
    classId,
    sessionName,
  });
  return response.data;
};

// Get Sessions by Class ID
const getActiveSessionByClassId = async (classId) => {
  const response = await axios.get(`${session_EndPoint}/active/${classId}`);
  return response.data;
};


// End Session
const endSession = async (classId) => {
  const response = await axios.put(`${session_EndPoint}/end/${classId}`);
  return response.data;
}

export const sessionService = {
  createSession,
  getActiveSessionByClassId,
  endSession
};



