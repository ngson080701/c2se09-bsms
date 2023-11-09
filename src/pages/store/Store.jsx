import React, { useState, useEffect, useContext } from "react";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/Sidebar";
import "../../styles/store.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";

export default function Store() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState("");
  const [datas, setDatas] = useState([]);
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [idStore, setIdStore] = useState(null);
  const handleStep1 = () => {
    setIdStore(null);
    setStep1(true);
    setStep2(false);
  };
  const handleStep2 = (id) => {
    setIdStore(id);
    setStep2(true);
    setStep1(false);
  };
  useEffect(() => {
    if (!user.isAdmin) {
      const fetchData = async () => {
        const res = await axios.get(
          `http://localhost:8800/api/store/get?q=${user.store}`
        );
        setData(res.data);
      };
      fetchData();
    }

    if (user.isAdmin) {
      const fetchData = async () => {
        const res = await axios.get(`http://localhost:8800/api/store/get`);
        setDatas(res.data);
      };
      fetchData();
    }
  }, []);

  const ShowHandle = ({ item }) => {
    return (
      <div className="container-store">
        <div className="info-store">
          <div className="item-store">
            <h3 className="header-store">Information</h3>
          </div>
          <div className="item-store">
            <span className="title-store">NAME:</span>
            <span className="name-store">
              {item ? item.Name_Store : data.Name_Store ?? ""}
            </span>
          </div>
          <div className="item-store">
            <span className="title-store">Telephone:</span>
            <span className="name-store">
              {item ? item.Telephone : data.Telephone ?? ""}
            </span>
          </div>
          <div className="item-store">
            <span className="title-store">Description:</span>
            <span className="name-store">
              {item ? item.Description : data.Description ?? ""}
            </span>
          </div>
        </div>
        <div className="location-store">
          <div className="item-store">
            <h3 className="header-store">Location</h3>
          </div>
          <div className="item-store">
            <span className="title-store">Number:</span>
            <span className="name-store">
              {item ? item.Number : data.Number ?? ""}
            </span>
          </div>
          <div className="item-store">
            <span className="title-store">Street:</span>
            <span className="name-store">
              {item ? item.Street : data.Street ?? ""}
            </span>
          </div>
          <div className="item-store">
            <span className="title-store">District:</span>
            <span className="name-store">
              {item ? item.District : data.District ?? ""}
            </span>
          </div>
          <div className="item-store">
            <span className="title-store">City:</span>
            <span className="name-store">
              {item ? item.City : data.City ?? ""}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const Update = ({ item }) => {
    const [inputField, setInputField] = useState({
      id: item._id || data._id,
      Name_Store: item.Name_Store || data.Name_Store,
      Telephone: item.Telephone || data.Telephone,
      Description: item.Description || data.Description,
      Number: item.Number || data.Number,
      Street: item.Street || data.Street,
      District: item.District || data.District,
      City: item.City || data.City,
    });

    const InputHandler = (e) => {
      setInputField({ ...inputField, [e.target.name]: e.target.value });
    };

    const submitHandle = async (e) => {
      e.preventDefault();
      const data = {
        id: inputField.id,
        Name_Store: inputField.Name_Store,
        Telephone: inputField.Telephone,
        Description: inputField.Description,
        Number: inputField.Number,
        Street: inputField.Street,
        District: inputField.District,
        City: inputField.City,
      };
      try {
        const res = await axios.put(
          "http://localhost:8800/api/store/update",
          data
        );
        toast.success(res.data.message);
        setData(res.data.value);
      } catch (error) {
        toast.error("Update information failed");
      }
    };
    return (
      <div className="container-store">
        <div className="info-store">
          <div className="item-store">
            <h3 className="header-store">Information</h3>
          </div>
          <div className="item-store">
            <span className="title-store">NAME:</span>
            <input
              className="input-store"
              type="text"
              name="Name_Store"
              value={inputField.Name_Store}
              onChange={InputHandler}
            />
          </div>
          <div className="item-store">
            <span className="title-store">Telephone:</span>
            <input
              className="input-store"
              type="text"
              name="Telephone"
              value={inputField.Telephone}
              onChange={InputHandler}
            />
          </div>
          <div className="item-store">
            <span className="title-store">Description:</span>
            <textarea
              className="textarea-store"
              type="text"
              name="Description"
              value={inputField.Description}
              onChange={InputHandler}
            />
          </div>
          <div className="button-receipt">
            <button className="button-action padding" onClick={submitHandle}>
              save
            </button>
          </div>
        </div>
        <div className="location-store">
          <div className="item-store">
            <h3 className="header-store">Location</h3>
          </div>
          <div className="item-store">
            <span className="title-store">Number:</span>
            <input
              className="input-store"
              type="text"
              name="Number"
              value={inputField.Number}
              onChange={InputHandler}
            />
          </div>
          <div className="item-store">
            <span className="title-store">Street:</span>
            <input
              className="input-store"
              type="text"
              name="Street"
              value={inputField.Street}
              onChange={InputHandler}
            />
          </div>
          <div className="item-store">
            <span className="title-store">District:</span>
            <input
              className="input-store"
              type="text"
              name="District"
              value={inputField.District}
              onChange={InputHandler}
            />
          </div>
          <div className="item-store">
            <span className="title-store">City:</span>
            <input
              className="input-store"
              type="text"
              name="City"
              value={inputField.City}
              onChange={InputHandler}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* container for sidebar */}
      <div className="left-container">
        <Sidebar />
      </div>
      {/* container for topBar and mainBar */}
      <div className="right-container">
        <div className="top-container">
          <TopBar />
        </div>
        {user.isAdmin ? (
          <div>
            {datas.map((item) => (
              <div
                key={item._id}
                className="revenue-container"
                style={{ marginBottom: 20 }}
              >
                <ToastContainer />
                <div className="choose-chart">
                  <div className="header-revenue">
                    <span>Store Information </span>
                  </div>
                  <div className="button-revenue">
                    {step1 ? (
                      <React.Fragment>
                        <button
                          className="button-action"
                          onClick={handleStep1}
                          style={{ backgroundColor: "#bf925b", color: "white" }}
                        >
                          information
                        </button>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <button className="button-action" onClick={handleStep1}>
                          information
                        </button>
                      </React.Fragment>
                    )}
                    {step2 && idStore === item._id ? (
                      <React.Fragment>
                        <button
                          className="button-action"
                          onClick={() => handleStep2(item._id)}
                          style={{ backgroundColor: "#bf925b", color: "white" }}
                        >
                          update
                        </button>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <button
                          onClick={() => handleStep2(item._id)}
                          className="button-action"
                        >
                          update
                        </button>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="charts-container">
                  {step1 ? <ShowHandle item={item} /> : null}
                  {step2 && idStore === item._id ? (
                    <Update item={item} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="revenue-container">
            <ToastContainer />
            <div className="choose-chart">
              <div className="header-revenue">
                <span>Store Information </span>
              </div>
              <div className="button-revenue">
                {step1 ? (
                  <React.Fragment>
                    <button
                      className="button-action"
                      onClick={handleStep1}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    >
                      information
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button className="button-action" onClick={handleStep1}>
                      information
                    </button>
                  </React.Fragment>
                )}
                {step2 ? (
                  <React.Fragment>
                    <button
                      className="button-action"
                      onClick={handleStep2}
                      style={{ backgroundColor: "#bf925b", color: "white" }}
                    >
                      update
                    </button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button onClick={handleStep2} className="button-action">
                      update
                    </button>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="charts-container">
              {step1 ? <ShowHandle item={data} /> : null}
              {step2 ? <Update item={data} /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
