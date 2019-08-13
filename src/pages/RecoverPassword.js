import React, { useState } from "react";
import { Trans } from "@lingui/macro";

import ApiRequest from "utils/ApiRequest";

const RecoverPassword = () => {
  const [formData, setformData] = useState({
    email: ""
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    ApiRequest.post("password-reset", formData)
      .then(() => {
        setSuccess(true);
      })
      .catch(error => {
        try {
          setErrorMessage(error.response.data.message);
        } catch (error) {
          setErrorMessage("server error");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
      <article className={`message ${success && `is-success`}`}>
        <div className="message-header">
          <Trans>Recuperar palavra-passe</Trans>
        </div>
        <div className="message-body">
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
                {errorMessage && (
                  <p className="help is-danger">{errorMessage}</p>
                )}
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={`button is-primary ${submitting &&
                      "is-loading"}`}
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
      </article>
    </div>
  );
};

export default RecoverPassword;
