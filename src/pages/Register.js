import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';

const Register = ({ history }) => {
  const [formData, setformData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    password2: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [{ user }] = useStateValue();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  });

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.post('users', formData)
      .then(() => {
        setSuccess(true);
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
        <article className={`message ${success && `is-success`}`}>
          <div className="message-header">
            <h1>
              <Trans>Registo</Trans>
            </h1>
          </div>
          <div className="message-body">
            {!success ? (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">
                    <Trans>Nome</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="name"
                      required
                      maxLength={255}
                      className="input"
                      onChange={event => {
                        setformData({
                          ...formData,
                          name: event.target.value
                        });
                      }}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    <Trans>Apelido</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="surname"
                      required
                      maxLength={255}
                      className="input"
                      onChange={event => {
                        setformData({
                          ...formData,
                          surname: event.target.value
                        });
                      }}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    <Trans>E-Mail</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="email"
                      required
                      className="input"
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
                  <label className="label">
                    <Trans>Palavra-passe</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      required
                      minLength={6}
                      maxLength={255}
                      className="input"
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
                </div>
                <div className="field">
                  <label className="label">
                    <Trans>Confirmação da palavra-passe</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      required
                      minLength={6}
                      maxLength={255}
                      className={`input ${formData.password2.length &&
                        formData.password !== formData.password2 &&
                        'is-danger'}`}
                      onChange={event => {
                        setformData({
                          ...formData,
                          password2: event.target.value
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
                        mail_not_found: (
                          <Trans>
                            Não existe nenhum registo com este e-mail.
                          </Trans>
                        )
                      }[errorMessage] || (
                        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
                      )}
                    </p>
                  </div>
                )}
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-primary ${submitting &&
                        'is-loading'}`}
                      disabled={
                        submitting || formData.password !== formData.password2
                      }
                    >
                      <Trans>Registar</Trans>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <Trans>
                Utilizador registado com sucesso.
                <br />
                Clica em "Entrar" e usa as tuas credenciais.
              </Trans>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Register;
