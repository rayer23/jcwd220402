import axios from 'axios';
import Register from './pages/Register';
import RegisterVerification from './pages/RegisterVerification';
import LoginPage from './pages/Login';

import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';

import { axiosInstance } from './api';
import { login } from './redux/features/authSlice';
import { attach } from './redux/features/resetSlice';

//route
import Navbar from './components/navbar/navbar';
import HomePage from './pages/Home';
import Footer from './components/footer';
import Product from './pages/product/product';
import ProductDetail from './pages/product/productDetail';

import ResetPassword from './pages/resetpassword';
import ResetConfirm from './pages/resetconfirm';

//route admin
import NavbarAdmin from './components/navbaradmin';
import Dashboard from './pages/admin/dashboard';
import ManageUser from './pages/admin/manageuser';
import ManageAdmin from './pages/admin/manageadmin';
import ManageWarehouse from './pages/admin/warehousemanagement';
import ManageCategory from './pages/admin/managecategory';
import ManageProduct from './pages/admin/manageproduct';
import ManageProductDetail from './pages/admin/manageproductdetail';
import ManageStock from './pages/admin/managestock';
import ManageStockWarehouse from './pages/admin/managestockwarehouse';
import ManageMutation from './pages/admin/managemutation';
import OrderHistory from './pages/admin/orderhistory';
import ManageOrder from './pages/admin/manageorder';

import NotFound from './components/404Page';
// roles route
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/admin/adminroute';

function App() {
  const [message, setMessage] = useState('');
  const authSelector = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/greetings`,
      );
      setMessage(data?.message || '');
    })();
  }, []);

  const [authCheck, setAuthCheck] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const keepUserLoggedIn = async () => {
    try {
      const auth_token = localStorage.getItem('auth_token');

      if (!auth_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get('/auth/refresh-token');

      dispatch(login(response.data.data));

      localStorage.setItem('auth_token', response.data.token);
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
      const reset_token = localStorage.getItem('reset_token');

      if (!reset_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get('/auth/refresh-token');

      dispatch(attach(response.data.data));

      localStorage.setItem('reset_token', response.data.token);
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
      {location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/register/verification' ||
      location.pathname === '/reset-password' ||
      location.pathname === '/reset-confirm' ||
      location.pathname === '/cart/shipment' ||
      authSelector.RoleId === 3 ||
      authSelector.RoleId === 2 ? null : (
        <Box>
          <Navbar />
        </Box>
      )}
      <Routes>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/register/verification"
          element={<RegisterVerification />}
        />

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
        {/* Product Route */}
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id/:product_name" element={<ProductDetail />} />
        <Route
          path="/admin/warehouse-management"
          element={
            <AdminRoute>
              <ManageWarehouse />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <AdminRoute>
              <ManageCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product"
          element={
            <AdminRoute>
              <ManageProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/detail/:id"
          element={
            <AdminRoute>
              <ManageProductDetail />
            </AdminRoute>
          }
        />
        <Route
          path={authSelector.RoleId === 3 ? '/admin/update-stock' : null}
          element={
            <AdminRoute>
              <ManageStock />
            </AdminRoute>
          }
        />
        <Route
          path={
            authSelector.RoleId === 2
              ? '/admin/update-stock'
              : '/admin/update-stock/:id'
          }
          element={
            <AdminRoute>
              <ManageStockWarehouse />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock-mutation"
          element={
            <AdminRoute>
              <ManageMutation />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/order-history"
          element={
            <AdminRoute>
              <OrderHistory />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/order"
          element={
            <AdminRoute>
              <ManageOrder />
            </AdminRoute>
          }
        />
      </Routes>
      {location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/register/verification' ||
      location.pathname === '/reset-password' ||
      location.pathname === '/reset-confirm' ||
      location.pathname === '/cart/shipment' ||
      authSelector.RoleId === 3 ||
      authSelector.RoleId === 2 ? null : (
        <Box>
          <Footer />
        </Box>
      )}
    </>
  );
}

export default App;
