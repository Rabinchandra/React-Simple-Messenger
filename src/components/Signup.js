import React from "react";
import PropTypes from "prop-types";

function Signup({ onSignUp, alertMsg }) {
  // On sign up form submit
  const onFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    // if form is invalid
    if (!validateForm(form)) {
      return false;
    }

    const newUser = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      friends: [],
    };

    onSignUp(newUser);
  };

  // Form Validation function
  const validateForm = (form) => {
    if (form.password.value !== form.repassword.value) {
      alertMsg("Password does not match!", "danger");
      return false;
    }
    return true;
  };

  return (
    <div className="signup-container container mt-5">
      <h3 className="text-center mb-5">Sign Up</h3>
      <div className="alert-box"></div>
      <form id="signup" onSubmit={onFormSubmit}>
        <label htmlFor="name">Name: </label>
        <input type="text" className="form-control" id="name" placeholder="" />

        <label htmlFor="email">Email: </label>
        <input type="email" className="form-control" id="email" name="email" />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
        />

        <label htmlFor="re-password">Re-enter Password: </label>
        <input
          type="password"
          className="form-control"
          id="re-password"
          name="repassword"
        />

        <button className="btn btn-primary btn-block">Sign up</button>
      </form>
      <small className="text-muted mt-3 d-block text-center">
        Already have an account? <a href="/login">Login here</a>
      </small>
    </div>
  );
}

Signup.propTypes = {
  onSignUp: PropTypes.func.isRequired,
  alertMsg: PropTypes.func.isRequired,
};

export default Signup;
