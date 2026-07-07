import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CheckSquare, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAddTask } from "react-icons/md";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { FaRegRegistered } from "react-icons/fa6";
const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "text-blue-700 bg-blue-50"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-gray-900">
              <span className="flex items-center justify-center text-white bg-blue-900 rounded-lg h-9 w-11">
                <img src="../../public/taskManager.webp" />
              </span>
            </Link>
            {user && (
              <nav className="items-center hidden gap-1 ml-6 md:flex">
                <NavLink to="/" className={navLinkClass} end>
                  <RxDashboard size={25} />
                </NavLink>
                <NavLink to="/tasks/new" className={navLinkClass}>
                  <MdOutlineAddTask size={25} />
                </NavLink>
              </nav>
            )}
          </div>

          <div className="items-center hidden gap-3 md:flex">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi,{" "}
                  <span className="font-medium text-gray-800">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                  <AiOutlineLogout size={25} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary">
                  <AiOutlineLogin size={25} />
                </Link>
                <Link to="/register" className="btn-primary">
                  <FaRegRegistered size={25} />
                </Link>
              </>
            )}
          </div>

          <button
            className="p-2 text-gray-600 rounded-md md:hidden hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="pt-3 pb-4 space-y-1 border-t border-gray-100 md:hidden animate-fade-in">
            {user ? (
              <>
                <NavLink
                  to="/"
                  className={navLinkClass}
                  end
                  onClick={() => setOpen(false)}
                >
                  <RxDashboard size={25} />
                </NavLink>
                <NavLink
                  to="/tasks/new"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  <MdOutlineAddTask size={25} />
                </NavLink>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <span className="px-3 text-sm text-gray-600">
                    Hi,{" "}
                    <span className="font-medium text-gray-800">
                      {user.name}
                    </span>
                  </span>
                  <button onClick={handleLogout} className="btn-secondary">
                    <AiOutlineLogout size={25} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  className="btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  <AiOutlineLogin size={25} />
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
