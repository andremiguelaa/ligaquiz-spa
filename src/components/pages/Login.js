import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useStateValue } from 'state/State';

const Login = ({ history }) => {
  const [formData, setformData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [state, dispatch] = useStateValue();

  const handleSubmit = () => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    axios
      .post('/api/session', formData)
      .then(({ data: { data } }) => {
        const validity = Math.round(
          (Date.parse(data.expires_at) - Date.now()) / 1000 / 60 / 60 / 24 / 2
        );
        Cookies.set('BEARER-TOKEN', data.access_token, { expires: validity });
        dispatch({
          type: 'user.login',
          payload: data.user
        });
        history.push('/');
      })
      .catch(error => {
        setErrorMessage(error.response.data.message);
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
                  onChange={() => {
                    setformData({
                      ...formData,
                      email: event.target.value
                    });
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
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
                  onChange={() => {
                    setformData({
                      ...formData,
                      password: event.target.value
                    });
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-key"></i>
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
                <a href="#" className="button is-link">
                  Redefinir a palavra-passe
                </a>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
};

export default Login;
