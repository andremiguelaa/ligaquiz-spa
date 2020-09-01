import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

const ResetPassword = ({
  match: {
    params: { token },
  },
}) => {
  const [{ user }] = useStateValue();
  const [formData, setformData] = useState({
    password: '',
    password2: '',
    token: token,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Error status={403} />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.patch('password-reset', formData)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
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
    <>
      <PageHeader title={<Trans>Redefinir palavra-passe</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-4-widescreen is-6-tablet">
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
                      name="password_confirmation"
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
                        ),
                      }[errorMessage] || (
                        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
                      )}
                    </p>
                  </div>
                )}
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className={`button is-primary ${
                        submitting && 'is-loading'
                      }`}
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
                Clica <Link to="/login/">aqui</Link> e usa as novas credenciais.
              </Trans>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
