import React, { useState, useEffect, useRef } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import { omit } from 'lodash';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'utils/Loading';
import Error from 'utils/Error';
import Modal from 'utils/Modal';

const Form = ({ setPage, individualQuizPlayers, initialEditData }) => {
  const [users, setUsers] = useState();
  const [error, setError] = useState(false);
  const [changed, setChanged] = useState(false);
  const [backModal, setBackModal] = useState(false);
  const [formData, setFormData] = useState({
    player: {
      name: '',
      surname: '',
    },
    editing: false,
  });
  const [saving, setSaving] = useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    ApiRequest.get('users')
      .then(({ data }) => {
        const individualQuizPlayersUserIds = individualQuizPlayers.reduce(
          (acc, player) => {
            if (player.info) {
              acc.push(player.info.id);
            }
            return acc;
          },
          []
        );
        const sortedValidUsers = data.data
          .reduce((acc, user) => {
            if (
              !individualQuizPlayersUserIds.includes(user.id) ||
              initialEditData?.user_id === user.id
            ) {
              acc.push(user);
            }
            return acc;
          }, [])
          .sort((a, b) =>
            `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
          );
        setUsers(sortedValidUsers);
      })
      .catch(() => {
        setError(true);
      });
  }, [individualQuizPlayers, initialEditData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setChanged(true);
    }
  }, [formData]);

  useEffect(() => {
    if (initialEditData) {
      setFormData({
        player: initialEditData,
        editing: true,
      });
      setTimeout(() => {
        setChanged(false);
      }, 0);
    }
  }, [initialEditData]);

  const saveDisabled = !formData.player.name || !formData.player.surname;

  const savePlayer = () => {
    setSaving(true);
    if (!formData.editing) {
      ApiRequest.post('individual-quiz-players', [formData.player])
        .then(() => {
          toast.success(<Trans>Jogador criado com sucesso!</Trans>);
          setPage('list');
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o jogador.</Trans>);
          setSaving(false);
        });
    } else {
      ApiRequest.patch('individual-quiz-players', [formData.player])
        .then(() => {
          setChanged(false);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o jogador.</Trans>);
        })
        .then(() => {
          setSaving(false);
        });
    }
  };

  if (!users) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <div className="columns">
        <div className="column">
          <button
            type="button"
            onClick={() => {
              if (changed) {
                setBackModal(true);
              } else {
                setPage('list');
              }
            }}
            className="button"
          >
            <span className="icon">
              <i className="fa fa-chevron-left"></i>
            </span>
            <span>
              <Trans>Voltar à listagem</Trans>
            </span>
          </button>
        </div>
      </div>
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
                    defaultValue={formData.player.user_id}
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
                    {users.map((user) => (
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
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Guardar jogador</Trans>
              </span>
            </button>
          </div>
        </div>
      </form>
      {backModal && (
        <Modal
          type="danger"
          open={backModal}
          title={<Trans>Voltar à listagem</Trans>}
          body={
            <Trans>
              Todos os dados deste formulário serão descartados.
              <br />
              Tens a certeza que queres voltar à listagem?
            </Trans>
          }
          action={() => {
            setPage('list');
          }}
          onClose={() => setBackModal(false)}
        />
      )}
    </>
  );
};

export default Form;
