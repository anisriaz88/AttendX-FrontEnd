import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import useAuth from "../Hooks/useAuth";

// Lazy load pages (improves initial bundle)
const RegisterAdmin = lazy(() => import("../pages/RegisterAdmin"));
const RegisterTeacher = lazy(() => import("../pages/RegisterTeacher"));
const RegisterStudent = lazy(() => import("../pages/RegisterStudent"));
const Login = lazy(() => import("../pages/Login"));
const Class = lazy(() => import("../pages/Class"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Session = lazy(() => import("../pages/Session"));
const Profile = lazy(() => import("../pages/Profile"));

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center p-8 text-sm opacity-70">
    Loading...
  </div>
);

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const GuestOnlyRoute = ({ isLoggedIn, children }) => {
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

const Router = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <LandingPage />
            ) : (
              <Navigate to="/register/student" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <Login />
            </GuestOnlyRoute>
          }
        />

        <Route
          path="/register/admin"
          element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <RegisterAdmin />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register/teacher"
          element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <RegisterTeacher />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register/student"
          element={
            <GuestOnlyRoute isLoggedIn={isLoggedIn}>
              <RegisterStudent />
            </GuestOnlyRoute>
          }
        />

        <Route
          path="/class/:classCode"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Class />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class/:classCode/session"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Session />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default Router;
