import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { omit } from 'lodash';
import classNames from 'classnames';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';

const ControlPanelProfile = () => {
  const [{ user }, dispatch] = useStateValue();

  const [formData, setformData] = useState({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: '',
    password2: ''
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    let newFormData = formData;
    if (!formData.password.length) {
      newFormData = omit(formData, ['password', 'password2']);
    }
    ApiRequest.patch('users', newFormData)
      .then(() => {
        setSubmitting(false);
        toast.success(<Trans>Conta actualizada com sucesso.</Trans>, {
          hideProgressBar: true,
          closeButton: false
        });
        dispatch({
          type: 'user.patch',
          payload: newFormData
        });
      })
      .catch(error => {
        try {
          setError(error.response.data);
        } catch (error) {
          setError({ message: 'server_error' });
        }
        setSubmitting(false);
      });
  };

  return (
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
            defaultValue={user.name}
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
            defaultValue={user.surname}
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
            className={classNames('input', {
              'is-danger': error && error.data && error.data.email
            })}
            defaultValue={user.email}
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
          <Trans>Palavra-passe (deixa em branco para não alterar)</Trans>
        </label>
        <div className="control has-icons-left">
          <input
            type="password"
            minLength={6}
            maxLength={255}
            className="input"
            autoComplete="new-password"
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
            className={`button is-primary ${submitting && 'is-loading'}`}
            disabled={submitting || formData.password !== formData.password2}
          >
            <Trans>Gravar</Trans>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ControlPanelProfile;
