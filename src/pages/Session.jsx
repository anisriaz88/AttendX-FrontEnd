import QRCode from "react-qr-code";
import { useSelector, useDispatch } from "react-redux";
import { FiClock, FiActivity, FiStopCircle } from "react-icons/fi";
import LightDarkTheme from "../Components/Navbar/LightDarkTheme";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getActiveSessionByClassId,
  createSession,
  endSession,
} from "../features/session/sessionSlice.js";
import { getClassByCode } from "../features/class/classSlice.js";
export const Session = () => {

  const { colors } = useSelector((state) => state.color);

  const dispatch = useDispatch();
  const { classCode } = useParams();


  const { session, isSessionActive, isLoading, isError, message } = useSelector(
    (state) => state.session
  );
  // `classDetails` is stored under state.class.classDetails in the class slice
  const classDetails = useSelector((state) => state.class.classDetails);

  const [qrValue, setQrValue] = useState("");

  const [timer, setTimer] = useState(30);

  const [sessionTimer, setSessionTimer] = useState(300);

  // const [notifications, setNotifications] = useState([])

  const teacher = classDetails?.teacher


  useEffect(() => {
    if(classCode){
      dispatch(getClassByCode(classCode));
    }
  }, [dispatch, classCode]);

useEffect(() => {
  if (classDetails?._id) {
    dispatch(getActiveSessionByClassId(classDetails._id))
      .unwrap()
      .then((res) => {
        if (!res?.session) {
          // If no active session, create one
          dispatch(createSession(classDetails._id));
        }
      });
  }
}, [dispatch, classDetails?._id]);


useEffect(() => {
  if (!isSessionActive) return;

  const generateQr = () => {
    const newQrValue = `AttendX-Session-${session?._id || "local"}-${Date.now()}`;
    setQrValue(newQrValue);
    setTimer(30);
  };

  generateQr();

  const qrInterval = setInterval(() => generateQr(), 30000); 
  const qrCountdown = setInterval(() => {
    setTimer((prev) => (prev > 0 ? prev - 1 : 0));
  }, 1000);

  return () => {
    clearInterval(qrInterval);
    clearInterval(qrCountdown);
  };
}, [isSessionActive, session?._id]);



  useEffect(() => {
  const autoEnd = setTimeout(() => {
    if (classDetails?._id) dispatch(endSession(classDetails._id));
  }, 5 * 60 * 1000);

  return () => {
    clearTimeout(autoEnd);
  };
}, [isSessionActive, session?._id]);

  return (
    <>
      {/* Logo */}
      <h1
        className="fixed top-4 left-6 text-3xl font-bold flex z-50"
        style={{
          color: colors.Text.Primary,
        }}
      >
        Attend{" "}
        <span className="" style={{ color: colors.Primary }}>
          X
        </span>
      </h1>

      {/* Right Side Icons */}
      <div className="fixed top-4 right-6 z-50">
        <LightDarkTheme iconSize={32} />
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-between p-6"
        style={{ backgroundColor: colors.Secondary }}
      >
        {/* Session Info */}
        <div
          className="w-full max-w-4xl text-center mb-8 relative rounded-3xl p-8 shadow-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.Primary} 0%, ${colors.Background} 85%)`,
            color: colors.Text.Primary,
          }}
        >
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              { classDetails?.className || "_"}
            </h1>
            <p className="text-base md:text-lg opacity-80 font-medium mb-2">
              {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm md:text-base opacity-70 mb-4">
              Instructor: {teacher?.name || "_"}
            </p>
            
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full backdrop-blur-md shadow border ${
                isSessionActive ? "text-green-600 border-green-500" : "text-red-500 border-red-400"
              }`}
              style={{ backgroundColor: colors.Background + "CC" }}
            >
              <FiActivity />
              {isSessionActive ? "Ongoing Session" : "No Active Session"}
            </span>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />
        </div>

        {/* QR Code */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div
            className="p-2 md:p-4 rounded-3xl shadow-xl border flex flex-col items-center max-w-md w-full"
            style={{
              backgroundColor: colors.Background,
              borderColor: colors.Secondary,
              color: colors.Text.Primary,
            }}
          >   {isSessionActive ? (
              <>
                <h2 className="text-xl font-bold mb-6">Attendance QR Code</h2>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <QRCode value={qrValue || "Loading..."} size={220} />
                </div>
                <p className="mt-6 text-center text-sm opacity-70">
                  Scan this QR Code with AttendX app to mark attendance
                </p>

                {/* Countdown */}
                <div className="mt-6 text-center">
                  <p className="text-xs mb-2 opacity-70">QR Code expires in:</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg bg-red-100 text-red-600">
                    <FiClock />
                    {timer}s
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">No Active Session</h2>
                <p className="text-sm opacity-70">
                  Please start a session to generate a QR code.
                </p>
              </>
            )}  
          </div>
        </div>

        {/* Floating Notification (Demo) */}
        <div
          className="fixed bottom-4 right-6 p-4 rounded-2xl shadow-xl border max-w-sm z-50"
          style={{
            backgroundColor: colors.Background,
            borderColor: colors.Primary,
            color: colors.Text.Primary,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: colors.Primary,
                color: colors.Text.Primary,
              }}
            >
              ✓
            </div>
            <div>
              <p className="font-semibold text-sm">New Attendance!</p>
              <p className="text-sm opacity-70">
                Mahnoor Zafar just marked attendance
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Session;
