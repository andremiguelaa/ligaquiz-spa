import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

const RecoverPassword = () => {
  const [{ user, settings }] = useStateValue();
  const [formData, setformData] = useState({
    email: '',
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
    ApiRequest.post('password-reset', {
      ...formData,
      language: settings.language,
    })
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
      <PageHeader title={<Trans>Recuperar palavra-passe</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-4-widescreen is-6-tablet">
            {!success ? (
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
                </div>
                {errorMessage && (
                  <div className="field">
                    <p className="help is-danger">
                      {{
                        mail_not_found: (
                          <Trans>
                            Não existe nenhum registo com este e-mail.
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
                      disabled={submitting}
                    >
                      <Trans>Submeter</Trans>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <Trans>
                Enviámos-te um e-mail, segue as instruções para definir uma nova
                palavra-passe.
              </Trans>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecoverPassword;
