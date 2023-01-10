import React, { useState, useEffect } from "react";
import facade from "../facades/apiFacade";
import Unauthorized from "../components/Unauthorized";
import { useRef } from "react";
import { getAge } from "../components/DatePicker";
import { Button } from "react-bootstrap";

const Profile = ({ loggedIn, setLoggedIn, editedProfile, setEditedProfile }) => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const ageRef = useRef();

  const [dataFromServer, setDataFromServer] = useState("Loading...");

  const [editingUsername, setEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(false); //only used for the useeffect

  const [editingEmail, setEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState(false); //only used for the useeffect

  const [editingAge, setEditingAge] = useState(false);
  const [editedAge, setEditedAge] = useState(false); //only used for the useeffect

  useEffect(() => {
    const role = facade.getRole().then((result) => {
      console.log(result);
      return result;
    });
    let isLoggedIn = facade.loggedIn();
    if (isLoggedIn) {
      setLoggedIn(true);
      facade.fetchData().then((data) => {
        setDataFromServer(data);
        console.log(data);
      });
    }
  }, [editedUsername, editedEmail, editedAge]);

  const handleUsernameUpdate = async () => {
    if (
      dataFromServer?.username === usernameRef.current.value ||
      usernameRef.current.value === ""
    ) {
      setEditingUsername(false);
      return;
    }

    let confirmation = confirm(
      `Are you sure you want to change your username from ${dataFromServer?.username} to ${usernameRef.current.value}`
    );
    if (confirmation) {
      await facade
        .updateUser({ username: usernameRef.current.value })
        .then(() => {
          setEditedUsername(!editedUsername);
          facade.setUsername(usernameRef.current.value);
          setEditedProfile(!editedProfile);
        })
        .catch(() => {
          setEditingUsername(false);
          return;
        });
      setEditingUsername(false);
    } else {
      setEditingUsername(false);
    }
  };

  const handleEmailUpdate = () => {
    if (dataFromServer?.email === emailRef.current.value || emailRef.current.value === "") {
      setEditingEmail(false);
      return;
    }
    let confirmation = confirm(
      `Are you sure you want to change your email from ${dataFromServer?.email} to ${emailRef.current.value}`
    );
    if (confirmation) {
      facade.updateUser({ email: emailRef.current.value }).then(() => setEditedEmail(!editedEmail));
      setEditingEmail(false);
    } else {
      setEditingEmail(false);
    }
  };

  const handleAgeUpdate = () => {
    let calculatedAge = getAge(ageRef.current.value);
    if (calculatedAge < 18 || calculatedAge > 80) {
      setEditingAge(false);
      return;
    }

    if (isNaN(calculatedAge) || dataFromServer?.age === calculatedAge) {
      setEditingAge(false);
      return;
    }
    let confirmation = confirm(
      `Are you sure you want to change your age from ${dataFromServer?.age} to ${calculatedAge}`
    );
    if (confirmation) {
      facade.updateUser({ age: calculatedAge }).then(() => setEditedAge(!editedAge));
      setEditingAge(false);
    } else {
      setEditingAge(false);
    }
  };

  return (
    <>
      {!loggedIn ? (
        <Unauthorized />
      ) : (
        <>
          <div className="profile-page">
            <div className="nine">
              <h1>
                Profile <span style={{ color: "white" }}>Change your personal information</span>{" "}
              </h1>
            </div>

            <div className="profile-container">
              <div className="profile-inner-container">
                <h3 className="text-center mb-4">Trip History</h3>
              </div>

              <div className="profile-inner-container">
                <h3 className="text-center mb-4">Your Information</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  {editingUsername ? (
                    <>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Username: </span>
                        <input
                          type="text"
                          ref={usernameRef}
                          placeholder={dataFromServer?.username}
                        />
                      </p>
                      <p
                        onClick={() => {
                          handleUsernameUpdate();
                        }}
                      >
                        <i className="fas fa-save"></i>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Username: </span>
                        {dataFromServer?.username}
                      </p>
                      <p onClick={() => setEditingUsername(true)}>
                        <i className="fas fa-pen"></i>
                      </p>
                    </>
                  )}
                </div>
                {editingUsername}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  {editingEmail ? (
                    <>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email: </span>
                        <input type="email" ref={emailRef} placeholder={dataFromServer?.email} />
                      </p>
                      <p
                        onClick={() => {
                          handleEmailUpdate();
                        }}
                      >
                        <i className="fas fa-save"></i>
                      </p>
                    </>
                  ) : (
                    <>
                      {" "}
                      <p>
                        <span style={{ fontWeight: "bold" }}>Email: </span>
                        {dataFromServer?.email}
                      </p>
                      <p onClick={() => setEditingEmail(true)}>
                        <i className="fas fa-pen"></i>
                      </p>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {editingAge ? (
                    <>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Age: </span>
                        <input type="date" ref={ageRef} />
                      </p>
                      <p onClick={() => handleAgeUpdate()}>
                        <i className="fas fa-save"></i>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Age: </span>
                        {dataFromServer?.age}
                      </p>
                      <p onClick={() => setEditingAge(true)}>
                        <i className="fas fa-pen"></i>
                      </p>
                    </>
                  )}
                </div>
                <div className="text-center">
                  <Button className="mauto">Request password change</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="overlay-about"></div>
        </>
      )}
    </>
  );
};

export default Profile;
