import axios from "axios";
import Register from "./pages/Register"
import RegisterVerification from "./pages/RegisterVerification"
import LoginPage from "./pages/Login"
import Home from "./pages/Home"

import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";

import { axiosInstance } from "./api";
import { login } from "./redux/features/authSlice";
import { attach } from "./redux/features/resetSlice";

//route
import ResetPassword from "./pages/resetpassword";
import ResetConfirm from "./pages/resetconfirm";

//route admin
import NavbarAdmin from "./components/navbaradmin";
import Dashboard from "./pages/admin/dashboard";
import ManageUser from "./pages/admin/manageuser";
import ManageAdmin from "./pages/admin/manageadmin";

import NotFound from "./components/404Page";
// roles route
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/adminroute";

function App() {
  const [message, setMessage] = useState("");
  const authSelector = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);

  const [authCheck, setAuthCheck] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const keepUserLoggedIn = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token");

      if (!auth_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get("/auth/refresh-token");

      dispatch(login(response.data.data));

      localStorage.setItem("auth_token", response.data.token);
      setAuthCheck(true);
    } catch (err) {
      console.log(err);
      setAuthCheck(true);
    } finally {
      setAuthCheck(true);
    }
  };

  const userResetData = async () => {
    try {
      const reset_token = localStorage.getItem("reset_token");

      if (!reset_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get("/auth/refresh-token");

      dispatch(attach(response.data.data));

      localStorage.setItem("reset_token", response.data.token);
      setAuthCheck(true);
    } catch (err) {
      console.log(err);
      setAuthCheck(true);
    } finally {
      setAuthCheck(true);
    }
  };

  useEffect(() => {
    keepUserLoggedIn();
    userResetData();
  }, []);

  return (
    <>
      {authSelector.RoleId === 3 || authSelector.RoleId === 2 ? (
        <NavbarAdmin />
      ) : null}
      {/* <NavbarAdmin /> */}
      {/* {location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/reset-password" ||
      location.pathname === "/reset-confirm" ||
      authSelector.RoleId === 3 ||
      authSelector.RoleId === 2 ? null : (
        <Box>
          <Navbar />
        </Box>
      )} */}
      <Routes>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route
              path="/login"
              element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
              }
          />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verification" element={<RegisterVerification />}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-confirm"
          element={
            <GuestRoute>
              <ResetConfirm />
            </GuestRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-user-data"
          element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-admin-data"
          element={
            <AdminRoute>
              <ManageAdmin />
            </AdminRoute>
          }
        />
      </Routes>
      {/* {location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/reset-password" ||
      location.pathname === "/reset-confirm" |||
      authSelector.RoleId === 3 ||
      authSelector.RoleId === 2 ? null : (
        <Box>
          <Footer />
        </Box> 
      )} */}
    </>
  );
}

export default App;
