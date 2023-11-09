import React, { useState, useContext, useEffect } from "react";
import "../../styles/components/Sidebar.css";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ContactsIcon from "@mui/icons-material/Contacts";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  BsImages,
  BsPeopleFill,
  BsJournalBookmarkFill,
  BsReceipt,
} from "react-icons/bs";
import {
  MdSpaceDashboard,
  MdOutlinePostAdd,
  MdAttachMoney,
} from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import axios from "axios";

export default function Sidebar() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);
  const [dataDayCurrent, setDataDayCurrent] = useState([]);
  const count = dataDayCurrent.filter(
    (item) => item.Status === "pending"
  ).length;

  useEffect(() => {
    //fetch data of current date
    const fetchDayCurrent = async () => {
      const data = {
        storeId: currentUser.store,
      };
      const res = await axios.post(
        "http://localhost:8800/api/appointment/get-booking-by-store",
        data
      );
      setDataDayCurrent(res.data);
    };
    fetchDayCurrent();
  }, []);
  return (
    <div className="Sidebar">
      <div className="top-sidebar">
        <div className="div-logo">
          <span className="logo"> BarberJt</span>
          <span className="burger">
            <GiHamburgerMenu />
          </span>
        </div>
      </div>
      <div className="bottom-sidebar">
        <NavLink to={`/home`} className="Link">
          <div className="items-sidebar">
            <MdSpaceDashboard className="icon" />
            <div className="item-sidebar">Dashboard</div>
          </div>
        </NavLink>
        <NavLink to={`/store`} className="Link">
          <div className="items-sidebar">
            <MdSpaceDashboard className="icon" />
            <div className="item-sidebar">Store</div>
          </div>
        </NavLink>
        <NavLink to={`/customer`} className="Link">
          <div className="items-sidebar">
            <BsPeopleFill className="icon" />
            <div className="item-sidebar">Customers</div>
          </div>
        </NavLink>
        <NavLink to={`/staff`} className="Link">
          <div className="items-sidebar">
            <BsPeopleFill className="icon" />
            <div className="item-sidebar">Staffs</div>
          </div>
        </NavLink>
        {!user?.isAdmin && (
          <NavLink to={`/booking`} className="Link">
            <div className="items-sidebar">
              <BsJournalBookmarkFill className="icon" />
              <div className="item-sidebar booking-wwrap">
                Booking <div className="booking-count">{count}</div>
              </div>
            </div>
          </NavLink>
        )}
        {user?.isAdmin && (
          <NavLink to={`/category`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Category</div>
            </div>
          </NavLink>
        )}
        {!user?.isAdmin && (
          <NavLink to={`/service`} className="Link">
            <div className="items-sidebar">
              <BiCategoryAlt className="icon" />
              <div className="item-sidebar">Services</div>
            </div>
          </NavLink>
        )}
        <NavLink to={`/post`} className="Link">
          <div className="items-sidebar">
            <MdOutlinePostAdd className="icon" />
            <div className="item-sidebar">Posts</div>
          </div>
        </NavLink>

        <NavLink to="/revenue" className="Link">
          <div className="items-sidebar">
            <MdAttachMoney className="icon" />
            <div className="item-sidebar">Revenue</div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
