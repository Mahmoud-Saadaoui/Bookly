import { Link } from "react-router-dom";
import { BsColumnsGap, BsHouseDoor } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { BiSolidBookAdd } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";

const AdminSidebar = ({ setCurrentTab, currentTab }) => {
  const menuItems = [
    {
      id: 1,
      icon: <GiBookshelf />,
      label: "Books",
      description: "Manage library books"
    },
    {
      id: 2,
      icon: <BiSolidBookAdd />,
      label: "Create",
      description: "Add new books"
    }
  ];

  return (
    <aside className="admin-sidebar">
      <Link to="/" className="admin-sidebar-logo">
        <div className="sidebar-logo-icon">
          <BsColumnsGap />
        </div>
        <div className="sidebar-logo-text">
          <span className="logo-title">Bookly</span>
          <span className="logo-subtitle">Admin Panel</span>
        </div>
      </Link>

      <nav className="admin-sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Management</span>
          <ul className="admin-dashboard-list">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={currentTab === item.id ? "admin-sidebar-link active-tab" : "admin-sidebar-link"}
                onClick={() => setCurrentTab(item.id)}
                title={item.description}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">
                  <span className="sidebar-label">{item.label}</span>
                  <span className="sidebar-desc">{item.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Quick Links</span>
          <ul className="admin-dashboard-list">
            <li className="admin-sidebar-link">
              <Link to="/" className="sidebar-link-content">
                <span className="sidebar-icon"><BsHouseDoor /></span>
                <span className="sidebar-text">
                  <span className="sidebar-label">Back to Home</span>
                </span>
              </Link>
            </li>
            <li className="admin-sidebar-link">
              <Link to="/favorites" className="sidebar-link-content">
                <span className="sidebar-icon"><FaHeart /></span>
                <span className="sidebar-text">
                  <span className="sidebar-label">My Favorites</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="user-avatar">A</div>
          <div className="user-details">
            <span className="user-name">Administrator</span>
            <span className="user-role">Admin Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;