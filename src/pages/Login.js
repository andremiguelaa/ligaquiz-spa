import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useStateValue } from "state/State";
import ApiRequest from "utils/ApiRequest";
import { setLoginData } from "utils/Auth";

const Login = ({ history }) => {
  const [formData, setformData] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  });

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.post("session", formData)
      .then(({ data: { data } }) => {
        setLoginData(data, dispatch);
        history.push("/");
      })
      .catch(error => {
        try {
          setErrorMessage(error.response.data.message);
        } catch (error) {
          setErrorMessage("server error");
        }
        setSubmitting(false);
      });
  };

  return (
    <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
      <article className="message">
        <div className="message-header">Entrar</div>
        <div className="message-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">E-Mail</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  required
                  onChange={event => {
                    setformData({
                      ...formData,
                      email: event.target.value
                    });
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label">Palavra-passe</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  name="password"
                  required
                  onChange={event => {
                    setformData({
                      ...formData,
                      password: event.target.value
                    });
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-key" />
                </span>
              </div>
              {errorMessage && <p className="help is-danger">{errorMessage}</p>}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" disabled={submitting}>
                  Entrar
                </button>
              </div>
              <div className="control">
                <NavLink to="#" className="button is-link">
                  Redefinir a palavra-passe
                </NavLink>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
};

export default Login;
