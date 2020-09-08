import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import { omit } from 'lodash';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

const Form = () => {
  const [{ user }] = useStateValue();
  const { id } = useParams();
  const history = useHistory();
  const [error, setError] = useState();
  const [individualQuizPlayers, setIndividualQuizPlayers] = useState();
  const [loading, setLoading] = useState({
    individualQuizPlayers: false,
    users: false,
  });

  const [users, setUsers] = useState();
  const [validUsers, setValidUsers] = useState();
  const [formData, setFormData] = useState({
    player: {
      name: '',
      surname: '',
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIndividualQuizPlayers();
  }, [id]);

  useEffect(() => {
    if (!individualQuizPlayers && !loading.individualQuizPlayers) {
      setLoading((prev) => ({ ...prev, individualQuizPlayers: true }));
      ApiRequest.get('individual-quiz-players')
        .then(({ data }) => {
          setIndividualQuizPlayers(data);
          setLoading((prev) => ({ ...prev, individualQuizPlayers: false }));
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    } else if (individualQuizPlayers && id) {
      const userToEdit = individualQuizPlayers.find(
        (item) => item.id === parseInt(id)
      );
      setFormData({
        player: {
          id,
          name: userToEdit?.name,
          surname: userToEdit?.surname,
          user_id: userToEdit?.info.id,
        },
      });
    }
  }, [individualQuizPlayers, id, loading.individualQuizPlayers]);

  useEffect(() => {
    if (!users && !loading.users) {
      setLoading((prev) => ({ ...prev, users: true }));
      ApiRequest.get('users')
        .then(({ data }) => {
          setUsers(data);
          setLoading((prev) => ({ ...prev, users: false }));
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    } else if (individualQuizPlayers && users) {
      const individualQuizPlayersUserIds = individualQuizPlayers.reduce(
        (acc, player) => {
          if (player.info) {
            acc.push(player.info.id);
          }
          return acc;
        },
        []
      );
      const sortedValidUsers = users
        .reduce((acc, user) => {
          if (
            !individualQuizPlayersUserIds.includes(user.id) ||
            formData?.player.user_id === user.id
          ) {
            acc.push(user);
          }
          return acc;
        }, [])
        .sort((a, b) =>
          `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
        );
      setValidUsers(sortedValidUsers);
    }
  }, [individualQuizPlayers, formData, users, loading.users]);

  const savePlayer = () => {
    setSaving(true);
    if (!id) {
      ApiRequest.post('individual-quiz-players', [formData.player])
        .then(({ data }) => {
          toast.success(<Trans>Jogador criado com sucesso.</Trans>);
          history.push(`/admin/national-ranking/players/${data[0].id}/edit`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o jogador.</Trans>);
          setSaving(false);
        })
        .then(() => {
          setSaving(false);
        });
    } else {
      ApiRequest.patch('individual-quiz-players', [formData.player])
        .then(() => {
          toast.success(<Trans>Jogador actualizado com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o jogador.</Trans>);
        })
        .then(() => {
          setSaving(false);
        });
    }
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin && !user.valid_roles.national_ranking_manager) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (
    !individualQuizPlayers ||
    !validUsers ||
    (id && !formData.player.user_id)
  ) {
    return <Loading />;
  }

  const saveDisabled = !formData.player.name || !formData.player.surname;

  return (
    <>
      <PageHeader
        title={
          !id ? <Trans>Adicionar jogador</Trans> : <Trans>Editar jogador</Trans>
        }
      />
      <div className="section content">
        <form>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">
                  <Trans>Nome</Trans>
                </label>
                <div className="control has-icons-left">
                  <input
                    type="text"
                    required
                    maxLength={255}
                    className="input"
                    defaultValue={formData.player.name}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        player: {
                          ...formData.player,
                          name: event.target.value,
                        },
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
                    defaultValue={formData.player.surname}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        player: {
                          ...formData.player,
                          surname: event.target.value,
                        },
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
                  <Trans>Jogador da liga</Trans>
                </label>
                <div className="control has-icons-left">
                  <div className="select">
                    <select
                      value={formData.player.user_id}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          player: {
                            ...omit(formData.player, ['user_id']),
                            ...(parseInt(event.target.value) && {
                              user_id: event.target.value,
                            }),
                          },
                        });
                      }}
                    >
                      <Trans render={<option value={0} />}>Nenhum</Trans>
                      {validUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} {user.surname} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fa fa-user"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <button
                type="button"
                className={`button is-primary ${saving ? 'is-loading' : ''}`}
                onClick={savePlayer}
                disabled={saveDisabled || saving}
              >
                <span>
                  <Trans>Gravar</Trans>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
