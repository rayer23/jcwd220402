import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const authSelector = useSelector((state) => state.auth);
  console.log(authSelector);
  const navigate = useNavigate();

  if (authSelector.RoleId === 1) {
    navigate("/");
  }
  return children;
};

export default AdminRoute;
