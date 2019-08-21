import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';

const Avatar = () => {
  const [{ user }, dispatch] = useStateValue();
  const [formData, setformData] = useState({
    id: user.id,
    avatar: null
  });
  const [avatar, setAvatar] = useState(user.avatar_url);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const avatarChange = event => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatar(reader.result);
        setformData({
          ...formData,
          avatar: reader.result
        });
      };
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    ApiRequest.patch('users', formData)
      .then(() => {
        setSubmitting(false);
        toast.success(
          <Trans>Imagem de perfil actualizada com sucesso.</Trans>,
          {
            hideProgressBar: true,
            closeButton: false
          }
        );
        dispatch({
          type: 'user.patch',
          payload: formData
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
          <Trans>Imagem de perfil</Trans>
        </label>
        <div className="file">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={event => {
                avatarChange(event);
              }}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fa fa-upload" />
              </span>
              <span className="file-label">
                <Trans>Escolhe uma imagem</Trans>*
              </span>
            </span>
          </label>
        </div>
        <p>
          <small>
            * <Trans>Máximo 200 KB</Trans>
          </small>
        </p>
        <figure className="avatar">
          <img src={avatar} alt={user.name} />
        </figure>
      </div>
      {error && (
        <div className="field">
          <p className="help is-danger">
            {error.message === 'validation_error' ? (
              <Trans>Ficheiro inválido.</Trans>
            ) : (
              <Trans>Erro de servidor. Tenta mais tarde.</Trans>
            )}
          </p>
        </div>
      )}
      <div className="field">
        <div className="control">
          <button
            className={`button is-primary ${submitting && 'is-loading'}`}
            disabled={submitting || !formData.avatar}
          >
            <Trans>Gravar</Trans>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Avatar;
