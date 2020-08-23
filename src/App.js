import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";

function App({ db }) {
  // On Sign up, push the data to db
  const onSignUp = (user) => {
    addUserToDb(user);
    displayCollecton();
  };

  // On Login
  const onLogIn = (user) => {
    db.collection("users")
      .where("email", "==", user.email)
      .get()
      .then((snapshots) => {
        const found = snapshots.docs[0];
        const errMsg = "Please check your email or password!";

        // If the user is not found
        if (!found) {
          alertMsg(errMsg, "danger");
          return false;
        }

        const data = found.data();
        const id = found.id;

        // Checking password
        if (user.password !== data.password) {
          // alertMsg("Please check your email or password!", "danger");
          alertMsg("Please check your email or password!", "danger");
          return false;
        }

        alertMsg("Login Successfully!", "success");

        // Save the user to the sessionStorage
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id,
            name: data.name,
            email: data.email,
            friends: data.friends,
          })
        );
      });
  };

  // Add User to Database
  const addUserToDb = (user) => {
    db.collection("users")
      .add(user)
      .then(() => alertMsg("Sign up sucessfully!", "success"));
  };

  // Display the collection on the console for checking errors
  const displayCollecton = () => {
    db.collection("users")
      .get()
      .then((snapshots) => {
        snapshots.docs.forEach((snapshot) => {
          console.log(snapshot.data());
        });
      })
      .catch((err) => console.error(err));
  };

  // Alert Message
  const alertMsg = (msg, type) => {
    const container = document.querySelector(".alert-box");

    container.innerHTML = `
      <div class="alert alert-${type} text-center">${msg}!</div>
    `;

    // Displaying off the alert after 2 seconds
    setTimeout(() => (container.innerHTML = ""), 2000);
  };

  return (
    <Router>
      <div className="App">
        <Route
          exact
          path="/"
          render={() => (
            <React.Fragment>
              <a href="/login">Login here</a>
            </React.Fragment>
          )}
        />
        <Route path="/login" render={(props) => <Login onLogIn={onLogIn} />} />
        <Route
          path="/signup"
          render={(props) => <Signup onSignUp={onSignUp} alertMsg={alertMsg} />}
        />
        <Route path="/chat" render={(props) => <Chat db={db} />} />
      </div>
    </Router>
  );
}

export default App;
