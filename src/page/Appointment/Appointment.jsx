import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import TopBar from "../../components/Topbar/TopBar";
import "../../styles/appointment.css";
import { BsPersonFill } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import ModalLogin from "../../components/Modal/ModalLogin";
import { MdContentCut } from "react-icons/md";
import moment from "moment";
import Scroll from "../../components/ScrollToTop/Scroll";
import ModalBooking from "../../components/ModalBooking/ModalBooking";

export default function Appointment() {
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(currentUser);
  const [isModalOpen, setModalOpen] = useState(false);
  const [booking, setBooking] = useState();
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [service, setService] = useState([]);
  const [slotArray, setSlotArray] = useState([]);
  const [date, setDate] = useState(moment().format("yyyy-MM-DD"));
  const [openStore, setOpenStore] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [nameService, setNameService] = useState("");
  const [price, setPrice] = useState("");
  const [idService, setIdervice] = useState("");
  const [staffId, setStaffId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [check, setCheck] = useState(-1);
  const [dateId, setDateId] = useState("");
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [store, setStore] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [slotText, setSlotText] = useState("");
  const currentTime = new Date();

  useEffect(() => {
    if (storeId) {
      const fetchService = async () => {
        const res = await axios.post(
          "http://localhost:8800/api/service/get-all",
          {
            storeId: storeId,
          }
        );
        setService(res.data);
      };
      fetchService();
      const fetchStaff = async () => {
        try {
          const res = await axios.post(
            "http://localhost:8800/api/staff/staff",
            {
              staffId: storeId,
            }
          );
          setStaff(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchStaff();
    }
  }, [storeId]);
  useEffect(() => {
    const fetchStore = async () => {
      const res = await axios.get("http://localhost:8800/api/store/get");
      setStore(res.data);
    };
    fetchStore();
  }, []);

  const handleServices = async (id, name ,price ) => {
    setNameService(name);
    setPrice(price);
    setIdervice(id);
    setOpenService(false);
    setStep1(true);
  };

  const handleStore = (id) => {
    setStoreId(id);
    setShowForm(true);
  };

  const handleStaff = async (e) => {
    setStaffName(e.target.options[e.target.selectedIndex].text);
    setStep2(true);
    setStaffId(e.target.value);
  };
  const handleSlot = async (e, slotid, index) => {
    setSlotText(e.target.textContent);
    setSlotId(slotid);
    setStep4(true);
    setCheck(index);
  };

  const DateHandle = async (e) => {
    const newDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setDate(newDate);
    setStep3(true);
    const data = {
      staffId: staffId,
      date: newDate,
    };

    try {
      const res = await axios.post(
        "http://localhost:8800/api/appointment/get-slots",
        data
      );
      console.log(res.data);
      setSlotArray(res.data.slots);
      setDateId(res.data._id);
    } catch (error) {}
  };
  const history = useNavigate();
  // console.log(nameService);
  const submitBooking = async () => {
    const data = {
      StaffId: staffId,
      DateId: dateId,
      SlotId: slotId,
      CustomerId: user._id,
      NameCustomer: user.Name_Customer,
      TelephoneCustomer: user.Telephone,
      Email: user.Email,
      Services: idService,
      storeId: storeId,
      
    };
  
    setBooking(data);
    setModalOpen(true);
    // try {
    //   const res = await axios.post(
    //     "http://localhost:8800/api/appointment/add",
    //     data
    //   );

    //   toast.success("Appointment successfully!!");
    //   setTimeout(() => {
    //     history("/home");
    //   }, 3000);
    // } catch (error) {
    //   toast.error("Appointment failed");
    // }
  };

  return (
    <div className="container">
      <section className="section1">
        <div className="background-image">
          <div className="container-item">
            <TopBar />
          </div>
        </div>
      </section>
      <ModalLogin
        open={open}
        onClose={() => setOpen(false)}
        setUser={setUser}
      />
      <ToastContainer />
      {user ? (
        <div className="appointment-container">
          {!showForm && (
            <div style={{ minHeight: "500px" }} className="booking-container">
              <div className="header-booking">Choose Store</div>

              <div className="item-booking">
                <span className="icon-booking">
                  <MdContentCut />
                </span>
                <div
                  className="input-booking choose"
                  onClick={() => {
                    setOpenStore(!openStore);
                  }}
                >
                  {step1 ? <span>{nameService} </span> : "View all stores"}
                </div>
                <span className="icon-booking">
                  <IoMdArrowDropright />
                </span>
              </div>
              {openStore ? (
                <div className="show-service-booking">
                  <div className="grid-service">
                    {store.map((store, i) => (
                      <div key={i} className="items-service-booking">
                        <span> {store.Name_Store}</span>
                        <span> {store.City}</span>
                        <span className="desc-booking">
                          {store.Description}
                        </span>
                        <button
                          onClick={() => {
                            handleStore(store._id);
                          }}
                        >
                          {" "}
                          Choose
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
          {showForm && (
            <div className="booking-container">
              <div className="close-button" onClick={() => setShowForm(false)}>
                x
              </div>
              <div className="header-booking">Make a reservation</div>
              <div className="form-booking">
                <span className="title-booking"> 1.Choose Service </span>

                <div className="item-booking">
                  <span className="icon-booking">
                    <MdContentCut />
                  </span>
                  <div
                    className="input-booking choose"
                    onClick={() => {
                      setOpenService(!openService);
                    }}
                  >
                    {step1 ? <span>{nameService} </span> : "View all services"}
                  </div>
                  <span className="icon-booking">
                    <IoMdArrowDropright />
                  </span>
                </div>
                {openService ? (
                  <div className="show-service-booking">
                    <div className="grid-service">
                      {service.map((services, i) => (
                        <div key={i} className="items-service-booking">
                          <img
                            src={services.Image}
                            alt=""
                            className="img-booking"
                          />
                          <span> {services.Name_Service}</span>
                          <span> {services.Price}</span>
                          <span className="desc-booking">
                            {services.Description}
                          </span>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure to choose this appointment?"
                                )
                              )
                                handleServices(
                                  services._id,
                                  services.Name_Service,
                                  services.Price
                                );
                            }}
                          >
                            {" "}
                            Choose
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/*  choose staff */}

                <span className="title-booking"> 2.Choose Staff </span>
                <div className="item-booking">
                  <span className="icon-booking">
                    <BsPersonFill />
                  </span>
                  <select
                    type="text"
                    className="input-booking"
                    placeholder="Staff"
                    name="StaffId"
                    onChange={handleStaff}
                  >
                    {staff.map((value, i) => (
                      <option value={value._id} key={i}>
                        {value.Name}
                      </option>
                    ))}
                  </select>
                  <span className="icon-booking">
                    <IoMdArrowDropright />
                  </span>
                </div>
                <span className="title-booking"> 3.Choose Date </span>
                <div className="item-booking">
                  <span className="icon-booking">
                    <BsPersonFill />
                  </span>
                  <input
                    type="date"
                    name="Date"
                    className="input-booking"
                    value={moment(date).format("yyyy-MM-DD")}
                    onChange={DateHandle}
                  ></input>

                  <span className="icon-booking">
                    <IoMdArrowDropright />
                  </span>
                </div>

                {step3 ? (
                  <React.Fragment>
                    <span className="title-booking">
                      {" "}
                      4.Choose Slot{" "}
                      <span
                        style={{
                          fontSize: "16px",
                          paddingLeft: "10px",
                          fontWeight: "400",
                        }}
                      >
                        {" "}
                        (Please select the available time periods)
                      </span>{" "}
                    </span>
                    <div className="grid-slot">
                      {slotArray?.map((slot, index) => {
                        const Time = new Date(date + "T" + slot.Time);
                        if (Time < currentTime) {
                          return (
                            <button key={index} className="item-false">
                              {slot.Time}
                            </button>
                          );
                        }
                        if (slot.isBooked === true) {
                          return (
                            <button key={index} className="item-false">
                              {slot.Time}
                            </button>
                          );
                        } else {
                          return (
                            <button
                              key={index}
                              className="slot-item"
                              onClick={(e) => {
                                handleSlot(e, slot._id, index);
                              }}
                              style={{
                                backgroundColor:
                                  check === index ? "#bf925b" : "white",
                                color: check === index ? "white" : "black",
                              }}
                            >
                              {slot.Time}
                            </button>
                          );
                        }
                      })}
                    </div>
                  </React.Fragment>
                ) : null}
                {step4 ? (
                  <React.Fragment>
                    <button
                      className="submit-booking true"
                      onClick={submitBooking}
                    >
                      {" "}
                      Next step
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button className="submit-booking false"> Complete</button>
                  </React.Fragment>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="booking-check">
          <span>Please login to continue making appointments</span>
          <button
            className="check-button"
            onClick={() => {
              setOpen(true);
            }}
          >
            Login
          </button>
        </div>
      )}
      <Scroll />
      <ModalBooking
        data={booking}
        onClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
        nameService={nameService}
        staffName={staffName}
        slotText={slotText}
        date={date}
        price={price}
      />
    </div>
  );
}
