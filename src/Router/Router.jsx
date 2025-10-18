import { Routes, Route } from "react-router-dom";
import RegisterAdmin from "../pages/RegisterAdmin";
import RegisterTeacher from "../pages/RegisterTeacher";
import RegisterStudent from "../pages/RegisterStudent";
import Login from "../pages/Login";
import Class from "../pages/Class";
import LandingPage from "../pages/LandingPage";
import Session from "../pages/Session";
import useAuth from "../Hooks/UseAuth";

const Router = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <LandingPage /> : <RegisterStudent />} />

      <Route path="/register/admin" element={!isLoggedIn && <RegisterAdmin />} />

      <Route path="/register/teacher" element={!isLoggedIn && <RegisterTeacher />} />

      <Route path="/register/student" element={!isLoggedIn && <RegisterStudent />} />

      <Route path="/login" element={!isLoggedIn && <Login />} />

      <Route path="/class/:classCode" element={isLoggedIn ? <Class /> : <Login />} />

      <Route
        path="/class/:classCode/session"
        element={isLoggedIn ? <Session /> : <Login />}
      />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default Router;
