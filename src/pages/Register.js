import React from "react";
import { Trans } from "@lingui/macro";

const Register = () => (
  <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
    <article className="message">
      <div className="message-header">
        <Trans>Registo</Trans>
      </div>
      <div className="message-body">
        <form>
          <div className="field">
            <label className="label">
              <Trans>Nome</Trans>
            </label>
            <div className="control has-icons-left">
              <input type="name" name="name" className="input " />
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
              <input type="surname" name="surname" className="input " />
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
              <input type="email" name="email" className="input " />
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
              <input type="password" name="password" className="input " />
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
                className="input "
              />
              <span className="icon is-small is-left">
                <i className="fa fa-key" />
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary">
                <Trans>Registar</Trans>
              </button>
            </div>
          </div>
        </form>
      </div>
    </article>
  </div>
);

export default Register;
