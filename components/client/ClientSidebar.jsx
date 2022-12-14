import Link from "next/link";
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
            <li>
              <Link href="/client/tasks/assign">
                Assign tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>

            <li>
              <Link href="/client/tasks/current">
                Current tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>

            <li>
              <Link href="/client/tasks/invoices">
                Invoices
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
            <li>
              <Link href="/client/tasks/completed">
                Completed tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
            <li>
              <Link href="/client/tasks/archive">
                Archived tasks
                <FaRandom size={14} className="float-end" />
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link href="/client/writers">
            Manage writers
            <FaRandom size={14} className="float-end" />
          </Link>
        </li>

        <li className=" ">
          <a href="report.php">
            <span className="fa fa-bar-chart mr-2"></span>Reports
          </a>
        </li>

        <li className="">
          <a href="messages.php">
            <span className="fa fa-comments mr-2"></span>Messages
          </a>
        </li>

        <li className="">
          <a href="noticeboard.php">
            <span className="fa fa-envelope mr-2"></span>Noticeboard{" "}
          </a>
        </li>
      </ul>
    </nav>
  );
};
export default ClientSidebar;
