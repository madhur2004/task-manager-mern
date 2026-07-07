import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LiaLinkedinIn } from "react-icons/lia";
import { FaMailBulk } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-12">
        {/* Grid - changes from 1 to 2 to 4 columns */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-lg shrink-0">
                <FiCheckCircle size={18} />
              </span>
              <span className="text-lg font-semibold text-gray-900">
                Task Manager
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-500">
              Organize your tasks, boost productivity, and achieve more every
              day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks/new"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Add Task
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Support
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-blue-600"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Connect
            </h3>
            <div className="mt-3 space-y-3">
              <div className="flex gap-3">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="GitHub"
                >
                  <FaGithub size={18} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="Twitter"
                >
                  <FaXTwitter size={18} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="LinkedIn"
                >
                  <LiaLinkedinIn size={18} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="Email"
                >
                  <FaMailBulk size={18} />
                </a>
              </div>
              <p className="text-sm text-gray-500 break-all">
                <a
                  href="mailto:support@taskmanager.com"
                  className="transition-colors hover:text-blue-600"
                >
                  support@taskmanager.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 mt-6 border-t border-gray-200 sm:pt-8 sm:mt-8">
          <p className="text-sm text-center text-gray-500">
            &copy; {currentYear} Task Manager. Built with React, Vite &amp;
            Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
