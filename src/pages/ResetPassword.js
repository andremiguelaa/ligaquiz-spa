import React from "react";
import { Trans } from "@lingui/macro";

const RecoverPassword = () => {
  return (
    <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
      <article className="message">
        <div className="message-header">
          <Trans>Recuperar palavra-passe</Trans>
        </div>
        <div className="message-body">
          <form>
            <div className="field">
              <label className="label">
                <Trans>E-Mail</Trans>
              </label>
              <div className="control has-icons-left">
                <input className="input" type="email" required />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope" />
                </span>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary">
                  <Trans>Submeter</Trans>
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
};

export default RecoverPassword;
