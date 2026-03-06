import { Link } from "react-router-dom";
import { BsColumnsGap } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { BiSolidBookAdd } from "react-icons/bi";

const AdminSidebar = ({ setCurrentTab, currentTab }) => {
  return (
    <div className="admin-sidebar">
      <Link to="/admin" className="admin-sidebar-title">
        <BsColumnsGap />
        Dashboard
      </Link>
      <ul className="admin-dashboard-list">
        <li className={currentTab === 1 ? "admin-sidebar-link active-tab" : "admin-sidebar-link"} onClick={()=>setCurrentTab(1)}>
            <GiBookshelf />
            Books
        </li>
        <li className={currentTab === 2 ? "admin-sidebar-link active-tab" : "admin-sidebar-link"} onClick={()=>setCurrentTab(2)}>
            <BiSolidBookAdd />
            Create
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;