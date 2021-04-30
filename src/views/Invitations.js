import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import { convertToLongDate } from 'utils/formatDate';

const Invitations = () => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [invitations, setInvitations] = useState();

  useEffect(() => {
    ApiRequest.get(`invitations`)
      .then(({ data }) => {
        setInvitations(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (error) {
    return <Error status={error} />;
  }

  if (!invitations) {
    return <Loading />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.target);
    formData.set('language', language);
    ApiRequest.post('invitations', formData)
      .then(({ data }) => {
        setInvitations((prev) => {
          prev.push(data);
          return prev;
        });
        toast.success(<Trans>Convite enviado com sucesso.</Trans>);
      })
      .catch(({ response }) => {
        if (response?.data?.data?.email?.[0] === 'validation.unique') {
          toast.error(
            <Trans>
              Não foi possível enviar o convite.
              <br />
              Já existe um jogador com este e-mail ou já foi enviado um convite
              para este e-mail.
            </Trans>
          );
        } else {
          toast.error(
            <Trans>Não foi possível enviar o convite. Tenta mais tarde.</Trans>
          );
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <PageHeader
        title={<Trans>Convites</Trans>}
        subtitle={
          <>
            <Trans>
              Nesta página podes convidar outros jogadores a participar na{' '}
              {process.env.REACT_APP_NAME}. Por cada jogador que convidares e se
              tornar um subscritor pago, ganhas um mês grátis.
            </Trans>
          </>
        }
      />
      <div className="section content">
        <div className="columns">
          <div className="column is-4-widescreen is-6-tablet">
            <form
              onSubmit={(event) => {
                event.persist();
                handleSubmit(event);
              }}
            >
              <div className="field">
                <label className="label">
                  <Trans>E-Mail</Trans>
                </label>
                <div className="control has-icons-left">
                  <input className="input" type="email" name="email" required />
                  <span className="icon is-small is-left">
                    <i className="fa fa-envelope" />
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary ${
                      submitting && 'is-loading'
                    }`}
                    disabled={submitting}
                  >
                    <Trans>Enviar convite</Trans>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {invitations.length > 0 && (
          <>
            <h2 className="has-text-weight-bold is-size-4">
              <Trans>Convites já enviados</Trans>
            </h2>
            <ul>
              {[...invitations].reverse().map((invitation) => (
                <li key={invitation.id}>
                  {invitation.email} ({convertToLongDate(invitation.updated_at)}
                  )
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Invitations;
