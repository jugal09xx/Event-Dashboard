import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Nav from "./components/nav";
import "./User.css";
import { useHistory } from "react-router-dom";
import { State } from "./Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPage = (props) => {
  let history = useHistory();
  let { userData, handleChange } = useContext(State);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);

  const notifySuccess = () =>
    toast.success("Login Successful!", {
      position: "top-center",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  // const usernname = userData.user.username;
  useEffect(() => {
    // console.log(userData, isAuth);
    let data = JSON.parse(localStorage.getItem("data"));
    // let data = localStorage.getItem("data");
    setUserName(data.username);
    axios
      .post("/user", {
        // userData: "5f316249bf8263611807b23d",
        data,
        userData,
        // data1: isAuth,
      })
      .then((res) => {
        // console.log(res.data);
        let data = [];
        let startDate;
        let endDate;
        let value;
        setName(res.data.name);
        res.data.events.forEach((item) => {
          startDate = new Date(item.startDate);
          endDate = new Date(item.endDate);
          // console.log(startDate, endDate);
          // console.log(
          //   item.name,
          //   startDate.getTime(),
          //   endDate.getTime(),
          //   Date.now()
          // );
          if (startDate.getTime() > Date.now()) {
            value = 2;
          } else if (
            startDate.getTime() < Date.now() &&
            endDate.getTime() > Date.now()
          ) {
            value = 0; //ongoing
          } else if (
            endDate.getTime() < Date.now()
            // startDate.getTime() < Date.now()
          ) {
            value = 1; //finished
          }
          data.push({
            name: item.name,
            date: `${startDate.getDate()}/${
              startDate.getMonth() + 1
            }/${startDate.getFullYear()}`,
            rawDate: startDate,
            status: value,
          });
        });
        console.log(data);
        setData(data);
      });
  }, []);

  const onClickRedirect = (data, date) => {
    history.push("/user/" + data);
    handleChange(data, date);
    let value = { data, date };
    localStorage.setItem("eventName", data);
    localStorage.setItem("test", JSON.stringify(value));
  };

  return (
    <div onLoad={notifySuccess}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Nav />
      <div className="user-body">
        <div className="user-info">
          <div className="user-box">
            <h1 className="head">My Profile</h1>
            <hr />
            <br />
            <div className="profile-pic">
              <img
                className="user-pic"
                alt="prfile pic"
                src="https://thumbor.forbes.com/thumbor/fit-in/416x416/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5f4ebe0c87612dab4f12a597%2F0x0.jpg%3Fbackground%3D000000%26cropX1%3D292%26cropX2%3D3684%26cropY1%3D592%26cropY2%3D3987"
              ></img>
            </div>
            <br />
            <h1 className="head">{userName}</h1>
            <p className="user-text">Software Developer</p>
            <p className="user-text">billgates@microsoft.com</p>
            <p className="user-text">+91 9435357748</p>
            <button className="edit">Edit</button>
          </div>
        </div>
        <div className="event-info">
          <div className="events">
            <h1 className="head">Events Conducted</h1>
            <hr />
            <div className="search-box">
              <form>
                <input
                  id="search"
                  type="text"
                  placeholder="Search Event"
                ></input>
                <button className="search-button">Search</button>
              </form>
            </div>
            <div className="event-list">
              <table>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
                {data.map((item) => (
                  <tr onClick={() => onClickRedirect(item.name, item.rawDate)}>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    {item.status === 0 && (
                      <td>
                        <p className="yellow">Ongoing</p>
                      </td>
                    )}
                    {item.status === 2 && (
                      <td>
                        <p className="blue">Upcoming</p>
                      </td>
                    )}
                    {item.status === 1 && (
                      <td>
                        <p className="green">Finished</p>
                      </td>
                    )}
                  </tr>
                ))}
                {/* 
                <tr onClick={() => onClickRedirect("hackathon")}>
                  <td>Hackathon</td>
                  <td>13/09/2020</td>
                  <td>
                    <p className="yellow">Ongoing</p>
                  </td>
                </tr>

                <tr onClick={() => onClickRedirect("workshop1")}>
                  <td>Workshop 1</td>
                  <td>13/09/2020</td>
                  <td>
                    <p className="green">Finished</p>
                  </td>
                </tr> */}
              </table>
            </div>
          </div>
          {/* <div className='events'>
            <h2 className='head'>Other data</h2>
            <hr />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
