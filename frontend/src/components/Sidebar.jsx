
import {
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  ClipboardList,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Content Review", icon: FileCheck2, path: "/reviews" },
  { label: "Submissions", icon: ClipboardList, path: "/submissions" },
  { label: "Brand Guidelines", icon: BookOpen, path: "/guidelines" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2>VINSYREX</h2>
          <span>BRAND GOVERNANCE</span>
        </div>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <div className="sidebar-profile">
          <div className="profile-avatar">BR</div>
          <div>
            <strong>Brand Reviewer</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
