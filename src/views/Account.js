import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { omit } from 'lodash';
import classames from 'classnames';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import Forbidden from './Forbidden';
import PageHeader from 'components/PageHeader';
import ApiRequest from 'utils/ApiRequest';
import ProfileAvatar from './Account/Avatar';

const Account = () => {
  const [{ user }, dispatch] = useStateValue();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: '',
    password2: '',
  });

  if (!user) {
    return <Forbidden />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    let newFormData = formData;
    if (!formData.password.length) {
      newFormData = omit(formData, ['password', 'password2']);
    }
    ApiRequest.patch('users', newFormData)
      .then(
        ({
          data: {
            data: { user },
          },
        }) => {
          setSubmitting(false);
          toast.success(<Trans>Perfil actualizado com sucesso.</Trans>);
          dispatch({
            type: 'user.patch',
            payload: user,
          });
        }
      )
      .catch((error) => {
        try {
          setError(error.response.data);
        } catch (error) {
          setError({ message: 'server_error' });
        }
        toast.error(<Trans>Não foi possível actualizar o perfil.</Trans>);
        setSubmitting(false);
      });
  };

  return (
    <>
      <PageHeader title={<Trans>Conta</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-6">
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
                    onChange={(event) => {
                      setFormData({
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
                    type="text"
                    required
                    maxLength={255}
                    className="input"
                    defaultValue={user.surname}
                    onChange={(event) => {
                      setFormData({
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
                    className={classames('input', {
                      'is-danger': error && error.data && error.data.email,
                    })}
                    defaultValue={user.email}
                    onChange={(event) => {
                      setFormData({
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
                  <Trans>Palavra-passe</Trans> (
                  <Trans>deixa em branco para não alterar</Trans>)
                </label>
                <div className="control has-icons-left">
                  <input
                    type="password"
                    minLength={6}
                    maxLength={255}
                    className="input"
                    autoComplete="new-password"
                    onChange={(event) => {
                      setFormData({
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
                    minLength={6}
                    maxLength={255}
                    className={`input ${
                      formData.password2.length &&
                      formData.password !== formData.password2 &&
                      'is-danger'
                    }`}
                    onChange={(event) => {
                      setFormData({
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
                    <Trans>Gravar</Trans>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="column is-6">
            <ProfileAvatar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
