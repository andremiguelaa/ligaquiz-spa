import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';

import PageHeader from 'components/PageHeader';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Forbidden from './Forbidden';

const Register = () => {
  const [formData, setformData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [{ user }] = useStateValue();

  if (user) {
    return <Forbidden />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    ApiRequest.post('users', formData)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        try {
          setError(error.response.data);
        } catch (error) {
          setError({ message: 'server_error' });
        }
        setSubmitting(false);
      });
  };

  return (
    <>
      <PageHeader title={<Trans>Registo</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-4-widescreen is-6-tablet">
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
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          name: event.target.value,
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
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          surname: event.target.value,
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
                      className={classNames('input', {
                        'is-danger': error && error.data && error.data.email,
                      })}
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          email: event.target.value,
                        });
                      }}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-envelope" />
                    </span>
                  </div>
                  {error &&
                    error.data &&
                    error.data.email &&
                    error.data.email.includes('validation.unique') && (
                      <p className="help is-danger">
                        <Trans>Já existe uma conta com este e-mail.</Trans>
                      </p>
                    )}
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
                      autoComplete="new-password"
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          password: event.target.value,
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
                      className={`input ${
                        formData.password2.length &&
                        formData.password !== formData.password2 &&
                        'is-danger'
                      }`}
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          password2: event.target.value,
                        });
                      }}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-key" />
                    </span>
                  </div>
                </div>
                {error && error.message !== 'validation_error' && (
                  <div className="field">
                    <p className="help is-danger">
                      <Trans>Erro de servidor. Tenta mais tarde.</Trans>
                    </p>
                  </div>
                )}
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-primary ${
                        submitting && 'is-loading'
                      }`}
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
                Clica <Link to="/login/">aqui</Link> e usa as tuas credenciais.
              </Trans>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
