import React from 'react';

const Register = () => (
  <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
    <article className="message">
      <div className="message-header">Registo</div>
      <div className="message-body">
        <form>
          <div className="field">
            <label className="label">Nome</label>
            <div className="control has-icons-left">
              <input type="name" name="name" className="input " />
              <span className="icon is-small is-left">
                <i className="fa fa-user"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Apelido</label>
            <div className="control has-icons-left">
              <input type="surname" name="surname" className="input " />
              <span className="icon is-small is-left">
                <i className="fa fa-user"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">E-Mail</label>
            <div className="control has-icons-left">
              <input type="email" name="email" className="input " />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Palavra-passe</label>
            <div className="control has-icons-left">
              <input type="password" name="password" className="input " />
              <span className="icon is-small is-left">
                <i className="fa fa-key"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Confirmação da palavra-passe</label>
            <div className="control has-icons-left">
              <input type="password" name="password_confirmation" className="input " />
              <span className="icon is-small is-left">
                <i className="fa fa-key"></i>
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary">Registar</button>
            </div>
          </div>
        </form>
      </div>
    </article>
  </div>
);

export default Register;
