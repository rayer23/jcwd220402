import React, { useState } from "react";
import { Button, Text, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { MdTableChart } from "react-icons/md";
import { ImHome } from "react-icons/im";
import { FaChair, FaHouseUser, FaUserCog } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { TbSofa } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { RiAdminFill, RiUser2Fill, RiMoneyDollarBoxFill } from "react-icons/ri";
import "./navbaradmin.css";

const Sidebar = () => {
  const authSelector = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const toast = useToast();

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token");
    dispatch(logout());
    toast({
      title: "User Logout",
      status: "info",
    });
    navigate("/");
  };
  const [show, setShow] = useState(false);

  return (
    <main className={show ? "space-toggle" : null}>
      <header className={`header ${show ? "space-toggle" : null}`}>
        <div className="header-toggle" onClick={() => setShow(!show)}>
          <i className={`fas fa-bars ${show ? "fa-solid fa-xmark" : null}`}></i>
        </div>
      </header>

      <aside className={`sidebar ${show ? "show" : null}`}>
        <nav className="nav">
          <div>
            <div className="nav-logo">
              <i className={`nav-logo-icon`}>
                <FaHouseUser />
              </i>
              <span className="nav-logo-name">{authSelector.RoleId === 3 ? "Super Admin" : "Warehouse Admin"}</span>
            </div>

            <div className="nav-list">
              <Link to="/admin/dashboard" className="nav-link">
                <i className="nav-link-icon">
                  <MdTableChart />
                </i>
                <span className="nav-link-name">Home</span>
              </Link>

              <Link to="/admin/warehouse-management" className="nav-link">
                <i className=" nav-link-icon">
                  <ImHome />
                </i>
                <span className="nav-link-name">Warehouse</span>
              </Link>

              {authSelector.RoleId === 3 ? (
                <>
                  <Link to="/admin/manage-admin-data" className="nav-link">
                    <i className="nav-link-icon">
                      <RiAdminFill />
                    </i>
                    <span className="nav-link-name">Manage Admin Data</span>
                  </Link>

                  <Link to="/admin/manage-user-data" className="nav-link">
                    <i className=" nav-link-icon">
                      <RiUser2Fill />
                    </i>
                    <span className="nav-link-name">Manage User Data</span>
                  </Link>

                  <Link to="/admin/update-stock" className="nav-link">
                    <i className=" nav-link-icon">
                      <TbSofa />
                    </i>
                    <span className="nav-link-name">Update Product Stock</span>
                  </Link>
                </>
               ) : null}

              <Link to="/admin/product" className="nav-link">
                <i className="nav-link-icon">
                  <FaChair />
                </i>
                <span className="nav-link-name">Manage Product</span>
              </Link>

              <Link to="/admin/category" className="nav-link">
                <i className="nav-link-icon">
                  <BiCategoryAlt />
                </i>
                <span className="nav-link-name">Manage Category</span>
              </Link>

              {authSelector.RoleId === 2 ? (
                <Link to="/admin/update-stock" className="nav-link">
                  <i className=" nav-link-icon">
                    <TbSofa />
                  </i>
                  <span className="nav-link-name">Update Product Stock</span>
                </Link>
              ) : null}

              <Link to="/user-data" className="nav-link">
                <i className="nav-link-icon">
                  <FaUserCog />
                </i>
                <span className="nav-link-name">Change Role Status</span>
              </Link>
              <Link to="/sales-report" className="nav-link">
                <i className="nav-link-icon">
                  <RiMoneyDollarBoxFill />
                </i>
                <span className="nav-link-name">Sales Report</span>
              </Link>
            </div>
          </div>

          <div as={Button} onClick={logoutBtnHandler} className="nav-link">
            <i className="nav-link-icon">
              <CgLogOut />
            </i>
            <span className="nav-link-name">Logout</span>
          </div>
        </nav>
      </aside>
    </main>
  );
};

export default Sidebar;
