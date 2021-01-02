import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import Loading from 'components/Loading';

const Cup = ({ season, users, validUsers, setError }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addCupPlayersModal, setAddCupPlayersModal] = useState(false);
  const [cupPlayers, setCupPlayers] = useState([]);
  const [tempCupPlayers, setTempCupPlayers] = useState([]);
  const [cupRounds, setCupRounds] = useState([]);
  const [cupId, setCupId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiRequest.get(`cups?season=${season}`)
      .then(({ data }) => {
        setCupId(data.id);
        setCupRounds(data.rounds.map((round) => round.leagueRound));
        const players = data.rounds[0].games.reduce((acc, game) => {
          acc.push(game.user_id_1);
          if (game.user_id_2) {
            acc.push(game.user_id_2);
          }
          return acc;
        }, []);
        setCupPlayers(players);
        setTempCupPlayers(players);
        setLoading(false);
      })
      .catch(({ response }) => {
        if (!(response?.status === 404)) {
          setError(response?.status);
        } else {
          setLoading(false);
        }
      });
  }, [season, setError]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    if (cupId) {
      ApiRequest.patch('cups', {
        id: cupId,
        season,
        user_ids: cupPlayers,
        rounds: cupRounds,
      })
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Taça gravada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar a taça.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('cups', {
        season,
        user_ids: cupPlayers,
        rounds: cupRounds,
      })
        .then(({ data }) => {
          setSubmitting(false);
          setCupId(data.id);
          toast.success(<Trans>Taça criada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar a taça.</Trans>);
          setSubmitting(false);
        });
    }
  };

  const deleteCup = () => {
    ApiRequest.delete('cups', {
      data: { id: cupId },
    })
      .then(() => {
        setCupId();
        setCupPlayers([]);
        setTempCupPlayers([]);
        setCupRounds([]);
        setDeleteModal(false);
        toast.success(<Trans>Taça apagada com sucesso.</Trans>);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar a taça.</Trans>);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  const roundsNeeded = Math.ceil(Math.log2(cupPlayers.length));

  return (
    <div className="section">
      <form onSubmit={handleSubmit}>
        <h2 className="subtitle has-text-weight-bold">
          <Trans>Taça</Trans>
        </h2>
        {cupId && (
          <div className="field">
            <button
              type="button"
              disabled={submitting}
              className="button is-danger"
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              <span className="icon">
                <i className="fa fa-trash"></i>
              </span>
              <span>
                <Trans>Remover taça</Trans>
              </span>
            </button>
          </div>
        )}
        <fieldset className="fieldset">
          <legend className="legend">
            <Trans>Jogadores</Trans>
          </legend>
          {cupPlayers.length > 0 && (
            <div className="field">
              {cupPlayers.map((id) => (
                <div key={id}>
                  {users[id].name} {users[id].surname}
                </div>
              ))}
            </div>
          )}
          <div className="field">
            <button
              type="button"
              disabled={submitting}
              className="button"
              onClick={() => {
                setAddCupPlayersModal(true);
              }}
            >
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Editar jogadores</Trans>
              </span>
            </button>
          </div>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="legend">
            <Trans>Jornadas</Trans>
          </legend>
          <div className="field">
            {[...Array(20).keys()].map((item) => (
              <div key={item}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={cupRounds.includes(item + 1)}
                    value={item + 1}
                    disabled={
                      !cupPlayers.length ||
                      cupRounds.includes(item) ||
                      cupRounds.includes(item + 2) ||
                      (cupRounds.length >= roundsNeeded &&
                        !cupRounds.includes(item + 1))
                    }
                    onChange={(event) => {
                      const newCupRounds = [...cupRounds];
                      if (event.target.checked) {
                        newCupRounds.push(parseInt(event.target.value));
                        setCupRounds(newCupRounds);
                      } else {
                        setCupRounds(
                          newCupRounds.filter(
                            (round) => round !== parseInt(event.target.value)
                          )
                        );
                      }
                    }}
                  />{' '}
                  <Trans>Jornada {item + 1}</Trans>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <Modal
          type="info"
          open={addCupPlayersModal}
          title={<Trans>Editar jogadores</Trans>}
          body={
            <>
              <Trans>
                Selecciona os jogadores que farão parte desta edição da taça:
              </Trans>
              <br />
              <br />
              <div className="field">
                <button
                  type="button"
                  className="button is-primary"
                  onClick={() => {
                    setTempCupPlayers(validUsers.map((item) => item.id));
                  }}
                >
                  <Trans>Seleccionar todos</Trans>
                </button>
              </div>
              {validUsers
                .sort((a, b) =>
                  `${a.name} ${a.surname}`.localeCompare(
                    `${b.name} ${b.surname}`
                  )
                )
                .map((user) => (
                  <div key={user.id}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={tempCupPlayers.includes(user.id)}
                        value={user.id}
                        onChange={(event) => {
                          const newPlayersToAdd = [...tempCupPlayers];
                          if (event.target.checked) {
                            newPlayersToAdd.push(parseInt(event.target.value));
                            setTempCupPlayers(newPlayersToAdd);
                          } else {
                            setTempCupPlayers(
                              newPlayersToAdd.filter(
                                (playerToAdd) =>
                                  playerToAdd !== parseInt(event.target.value)
                              )
                            );
                          }
                        }}
                      />{' '}
                      {user.name} {user.surname} ({user.email})
                    </label>
                  </div>
                ))}
            </>
          }
          action={() => {
            setCupPlayers(tempCupPlayers);
            setAddCupPlayersModal(false);
          }}
          onClose={() => {
            setTempCupPlayers(cupPlayers);
            setAddCupPlayersModal(false);
          }}
        />
        <div className="field">
          <div className="control">
            <button
              className="button is-primary"
              disabled={
                submitting ||
                !cupPlayers.length ||
                cupRounds.length !== roundsNeeded
              }
            >
              <Trans>Gravar taça</Trans>
            </button>
          </div>
        </div>
      </form>
      {deleteModal && (
        <Modal
          type="danger"
          open
          title={<Trans>Apagar taça</Trans>}
          body={<Trans>Tens a certeza que queres apagar a taça?</Trans>}
          doingAction={deleting}
          action={() => deleteCup()}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Cup;
