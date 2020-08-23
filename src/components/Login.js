import React from "react";
import PropTypes from "prop-types";

function Login({ onLogIn }) {
  const onFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const user = {
      email: form.email.value,
      password: form.password.value,
    };

    onLogIn(user);
  };

  return (
    <div className="login-container mt-5 container">
      <h3 className="text-center mb-5">Login</h3>
      <div className="alert-box"></div>
      <form id="login-form" onSubmit={onFormSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          placeholder="Email"
        />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
        />
        <button className="btn btn-primary w-100 mt-3">Submit</button>
      </form>
      <small className="text-muted d-block text-center mt-3">
        Don't have any account? <a href="/signup">Sign up here</a> <br />
        <a href="/chat">Chat</a>
      </small>
    </div>
  );
}

Login.propTypes = {
  onLogIn: PropTypes.func.isRequired,
};

export default Login;
