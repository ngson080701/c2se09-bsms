import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import "../../styles/booking.css";
import "../../styles/staff.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableUser from "../../components/table/table-custom/TableUser";
import axios from "axios";
import { MdDeleteOutline, MdViewHeadline, MdSaveAlt } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { Link } from "react-router-dom";
import ChartAppointment from "../../components/Charts/ChartAppointment";
import { AuthContext } from "../../context/AuthContext";
import { useReactToPrint } from "react-to-print";

export default function Booking() {
  const { user: currentUser } = useContext(AuthContext);
  const [rowId, setRowId] = useState("");
  const [showBill, setShowBill] = useState(false);
  const [bill, setBill] = useState();

  const [dataDayCurrent, setDataDayCurrent] = useState([]);
  console.log(dataDayCurrent);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const FetchDataAfterDelete = async () => {
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
  };

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

  const Delete = ({ params }) => {
    const DeleteHandle = async (id) => {
      try {
        const res = await axios.delete(
          `http://localhost:8800/api/appointment/delete-booking?id=${id}`
        );
        toast.success("Successful cancellation of appointment");
        FetchDataAfterDelete();
      } catch (error) {
        toast.error("Cancellation of appointment failed");
      }
    };
    return (
      <div className="delete">
        <button
          className="button-delete"
          onClick={() => {
            if (window.confirm("Are you sure to cancel this appointment?"))
              DeleteHandle(params.row._id);
          }}
        >
          <MdDeleteOutline className="icon-delete" />
        </button>
      </div>
    );
  };
  const Edit = ({ params }) => {
    const DeleteHandle = async (id) => {
      try {
        const res = await axios.put(
          `http://localhost:8800/api/appointment/update-booking?id=${id}`
        );
        toast.success("Successful done of appointment");
        FetchDataAfterDelete();
      } catch (error) {
        toast.error("Cancellation of appointment failed");
      }
    };
    return (
      <div className="view">
        <button
          className="button-view"
          onClick={() => {
            if (window.confirm("Are you sure to cancel this appointment?"))
              DeleteHandle(params.row._id);
          }}
        >
          <MdViewHeadline className="icon-view" />
        </button>
      </div>
    );
  };
  const Export = ({ params }) => {
    const exportHandle = (param) => {
      setBill(param);
      setShowBill(true);
    };
    return (
      <div className="view">
        <button
          className="button-view"
          onClick={() => {
            exportHandle(params.row);
          }}
        >
          <MdSaveAlt className="icon-view" />
        </button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        field: "NameCustomer",
        headerName: "Name",
        width: 120,
        editable: true,
      },
      {
        field: "TelephoneCustomer",
        headerName: "Telephone",
        width: 90,
        editable: true,
      },
      {
        field: "Email",
        headerName: "Email",
        width: 160,
        editable: true,
      },
      {
        field: "Status",
        headerName: "Status",
        width: 90,
      },
      {
        field: "date",
        headerName: "Date",
        width: 100,
      },
      {
        field: "slotTime",
        headerName: "Time",
        width: 80,
        editable: true,
      },
      {
        field: "Name_Service",
        headerName: "Services",
        width: 130,
        editable: true,
      },
      {
        field: "Staff",
        headerName: "Staff",
        width: 100,
      },
      {
        field: "Cancel",
        width: 80,
        headerName: "Delete",
        type: "actions",
        renderCell: (params) => <Delete {...{ params, rowId, setRowId }} />,
        editable: true,
      },
      {
        field: "Confirm",
        width: 80,
        headerName: "Confirm",
        type: "actions",
        renderCell: (params) => <Edit {...{ params, rowId, setRowId }} />,
        editable: true,
      },
      {
        field: "Export",
        width: 80,
        headerName: "Export",
        type: "actions",
        renderCell: (params) => <Export {...{ params, rowId, setRowId }} />,
        editable: true,
      },
    ],
    [rowId]
  );

  return (
    <div className="container">
      <div className="left-container">
        <Sidebar />
      </div>
      <div className="right-container">
        <div className="top-container">
          <TopBar />
        </div>
        <div className="bottom-container">
          <ToastContainer />

          <div className="revenue-container">
            <div className="choose-chart">
              <div className="header-revenue">
                <span> Table of booking</span>
              </div>
              <div className="button-revenue">
                <React.Fragment>
                  <Link to={`/appointment`} style={{ textDecoration: "none" }}>
                    <button className="button-action">add appointment</button>
                  </Link>
                </React.Fragment>
              </div>
            </div>
            <div className="charts-container">
              <TableUser
                column={columns}
                row={dataDayCurrent}
                rowId={rowId}
                setRowId={setRowId}
              />
            </div>
          </div>
          {showBill && (
            <>
              <div
                style={{
                  paddingBottom: "20px",
                  transform: "translate(50%, -120%)",
                  background: "white",
                  width: "400px",
                }}
                className="container-bill"
              >
                <div className="show-bill" ref={componentRef}>
                  <div className="exit" onClick={() => setShowBill(false)}>
                    <IoIosCloseCircleOutline />
                  </div>
                  <div className="header-bill">
                    Welcome to {bill?.Name_Store}
                  </div>
                  <div div className="items-bill">
                    <div className="item-bill">
                      <span className="title-bill">Name : </span>
                      <span className="value-bill">{bill?.NameCustomer}</span>
                    </div>
                    <div className="item-bill">
                      <span className="title-bill">Telephone: </span>
                      <span className="value-bill">
                        {bill?.TelephoneCustomer}
                      </span>
                    </div>
                    <div className="item-bill">
                      <span className="title-bill"> Email: </span>
                      <span className="value-bill">{bill?.Email} </span>
                    </div>
                    <div className="item-bill">
                      <span className="title-bill">Staff:</span>
                      <span className="value-bill">{bill?.Staff}</span>
                    </div>
                    <div className="item-bill">
                      <span className="title-bill"> Sum price:</span>
                      <span className="value-bill">{bill?.Price}đ </span>
                    </div>
                    <div className="item-bill">
                      <span className="title-bill">Date: </span>
                      <span className="value-bill">
                        {moment(bill.createdAt).format("DD-MM-yyyy")}
                      </span>
                    </div>
                    <span
                      style={{ marginBottom: "30px" }}
                      className="thank-bill"
                    >
                      Thank you for using our service
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePrint}
                style={{
                  position: "absolute",
                  top: "150px",
                  left: "470px",
                  border: "1px solid ",
                  borderRadius: "4px",
                  backgroundColor: "#bf925b",
                  color: "white",
                  padding: "10px",
                  textTransform: "uppercase",
                  fontFamily: "Barlow Condensed, Arial, sans-serif",
                  letterSpacing: "2px",
                }}
              >
                Print
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
