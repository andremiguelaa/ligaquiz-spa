import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';

const ResetPassword = ({
  match: {
    params: { token }
  }
}) => {
  const [formData, setformData] = useState({
    password: '',
    password2: '',
    token: token
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.patch('password-reset', formData)
      .then(() => {
        setSuccess(true);
      })
      .catch(error => {
        try {
          setErrorMessage(error.response.data.message);
        } catch (error) {
          setErrorMessage('server_error');
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="columns">
      <div className="column is-6-widescreen is-offset-3-widescreen is-8-tablet is-offset-2-tablet">
        <article className={`message ${success && `is-success`}`}>
          <div className="message-header">
            <h1>
              <Trans>Redefinir palavra-passe</Trans>
            </h1>
          </div>
          <div className="message-body">
            {!success ? (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">
                    <Trans>Palavra-passe</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      name="password"
                      className="input"
                      required
                      minLength={6}
                      maxLength={255}
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
                      name="password_confirmation"
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
                        expired_token: (
                          <Trans>
                            O pedido de redefinição de palavra-passe expirou
                          </Trans>
                        ),
                        invalid_token: (
                          <Trans>
                            O pedido de redefinição de palavra-passe é inválido
                          </Trans>
                        )
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
                      disabled={
                        submitting || formData.password !== formData.password2
                      }
                    >
                      <Trans>Submeter</Trans>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <Trans>
                Palavra-passe alterada com sucesso.
                <br />
                Clica em "Entrar" e usa as novas credenciais.
              </Trans>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ResetPassword;
