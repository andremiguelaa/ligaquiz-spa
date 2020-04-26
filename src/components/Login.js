import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import { setLoginData } from 'utils/Auth';
import Forbidden from './Forbidden';

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [{ user }, dispatch] = useStateValue();

  if (user) {
    return <Forbidden />;
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.post('session', formData)
      .then(({ data: { data } }) => {
        setLoginData(data, dispatch);
        history.push('/');
      })
      .catch(error => {
        try {
          setErrorMessage(error.response.data.message);
        } catch (error) {
          setErrorMessage('server_error');
        }
        setSubmitting(false);
      });
  };

  return (
    <div className="columns">
      <div className="column is-6-widescreen is-offset-3-widescreen is-8-tablet is-offset-2-tablet">
        <article className="message">
          <div className="message-header">
            <h1>
              <Trans>Entrar</Trans>
            </h1>
          </div>
          <div className="message-body">
            <div className="content">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">
                    <Trans>E-Mail</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      required
                      onChange={event => {
                        setFormData({
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
                  <label className="label">
                    <Trans>Palavra-passe</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      name="password"
                      required
                      onChange={event => {
                        setFormData({
                          ...formData,
                          password: event.target.value
                        });
                      }}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-key" />
                    </span>
                  </div>
                </div>
                {errorMessage && (
                  <div className="field">
                    <p className="help is-danger">
                      {{
                        wrong_credentials: <Trans>Credenciais erradas.</Trans>
                      }[errorMessage] || (
                        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
                      )}
                    </p>
                  </div>
                )}
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className={`button is-primary ${submitting &&
                        'is-loading'}`}
                      disabled={submitting}
                    >
                      <Trans>Entrar</Trans>
                    </button>
                  </div>
                  <div className="control">
                    <Link to="/recover-password" className="button is-link">
                      <Trans>Recuperar palavra-passe</Trans>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Login;
