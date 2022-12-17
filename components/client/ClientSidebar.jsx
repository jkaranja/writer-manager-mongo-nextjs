import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaRandom,
} from "react-icons/fa";

const ClientSidebar = () => {
  //collapse active
  const [collapse, setCollapse] = useState("show");
  const collapseActive = () =>
    collapse === "show" ? setCollapse("hide") : setCollapse("show");

    const { pathname } = useRouter();

  return (
    <nav id="sidebar">
      <ul className="list-unstyled components">
        <li className="">
          <a
            href="#homeSubmenu"
            data-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle"
            onClick={collapseActive}
          >
            <FaTasks size={17} className="me-2" />
            Manage Tasks
          </a>

          <ul className={`collapse list-unstyled ${collapse}`}>
            <li
              className={
                pathname === "/client/tasks/assign" && "sidebar-active2"
              }
            >
              <Link href="/client/tasks/assign">
                Assign tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>

            <li
              className={
                pathname === "/client/tasks/current" && "sidebar-active2"
              }
            >
              <Link href="/client/tasks/current">
                Current tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>

            <li
              className={
                pathname === "/client/tasks/invoices" && "sidebar-active2"
              }
            >
              <Link href="/client/tasks/invoices">
                Invoices
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
            <li
              className={
                pathname === "/client/tasks/completed" && "sidebar-active2"
              }
            >
              <Link href="/client/tasks/completed">
                Completed tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
            <li
              className={
                pathname === "/client/tasks/archive" && "sidebar-active2"
              }
            >
              <Link href="/client/tasks/archive">
                Archived tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
          </ul>
        </li>

        <li className={pathname === "/assign" && "sidebar-active2"}>
          <Link href="/client/writers">
            Manage writers
            <FaRandom size={14} className="float-end" />
          </Link>
        </li>

        <li className={pathname === "/assign" && "sidebar-active2"}>
          <a href="report.php">
            <span className="fa fa-bar-chart mr-2"></span>Reports
          </a>
        </li>

        <li className={pathname === "/assign" && "sidebar-active2"}>
          <a href="messages.php">
            <span className="fa fa-comments mr-2"></span>Messages
          </a>
        </li>

        <li className={pathname === "/assign" && "sidebar-active2"}>
          <a href="noticeboard.php">
            <span className="fa fa-envelope mr-2"></span>Noticeboard{" "}
          </a>
        </li>
      </ul>
    </nav>
  );
};
export default ClientSidebar;
