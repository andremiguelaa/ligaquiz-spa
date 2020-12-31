import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';

import EmptyState from 'components/EmptyState';
import ConditionalWrapper from 'components/ConditionalWrapper';

import classes from '../NationalRanking.module.scss';

const List = () => {
  const [{ user }] = useStateValue();
  const [error, setError] = useState(false);
  const [individualQuizPlayers, setIndividualQuizPlayers] = useState();
  const [playerToDelete, setPlayerToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIndividualQuizPlayers();
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setIndividualQuizPlayers(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  const deletePlayer = (player) => {
    setDeleting(true);
    ApiRequest.delete('individual-quiz-players', { data: { id: player } })
      .then(() => {
        setIndividualQuizPlayers(
          individualQuizPlayers.filter((item) => item.id !== player)
        );
        toast.success(<Trans>Jogador apagado com sucesso.</Trans>);
      })
      .catch((error) => {
        try {
          if (error.response.data.message === 'player_with_results') {
            toast.error(
              <Trans>
                Não foi possível apagar ao jogador.
                <br />O jogador tem resultados associados.
              </Trans>
            );
          } else {
            toast.error(<Trans>Não foi possível apagar ao jogador.</Trans>);
          }
        } catch (error) {
          toast.error(<Trans>Não foi possível apagar ao jogador.</Trans>);
        }
      })
      .then(() => {
        setPlayerToDelete();
        setDeleting(false);
      });
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

  if (!individualQuizPlayers) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title={<Trans>Jogadores</Trans>} />
      <div className="section content">
        <Link
          to="/admin/national-ranking/players/create"
          className="button is-primary"
        >
          <span className="icon">
            <i className="fa fa-plus"></i>
          </span>
          <span>
            <Trans>Adicionar jogador</Trans>
          </span>
        </Link>
        <br />
        <br />
        {individualQuizPlayers.length ? (
          <>
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>
                    <Trans>Jogador</Trans>
                  </th>
                  <th className="has-text-right">
                    <Trans>Acções</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {individualQuizPlayers.map((player) => (
                  <tr key={player.id}>
                    <td className="is-vertical-middle">
                      <ConditionalWrapper
                        condition={player.info}
                        wrapper={(children) => (
                          <Link to={`/profile/${player.info.id}`}>
                            {children}
                          </Link>
                        )}
                      >
                        <span className={classes.username}>
                          {player.name} {player.surname}
                        </span>
                      </ConditionalWrapper>
                    </td>
                    <td>
                      <div className="buttons has-addons is-pulled-right">
                        <Link
                          className="button"
                          to={`/admin/national-ranking/players/${player.id}/edit`}
                        >
                          <span className="icon">
                            <i className="fa fa-edit"></i>
                          </span>
                        </Link>
                        <button
                          className="button is-danger"
                          type="button"
                          onClick={() => setPlayerToDelete(player.id)}
                        >
                          <span className="icon">
                            <i className="fa fa-trash"></i>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Modal
              type="danger"
              open={playerToDelete}
              title={<Trans>Apagar jogador</Trans>}
              body={
                <Trans>Tens a certeza que queres apagar este jogador?</Trans>
              }
              action={() => deletePlayer(playerToDelete)}
              doingAction={deleting}
              onClose={() => setPlayerToDelete()}
            />
          </>
        ) : (
          <EmptyState>
            <Trans>Sem registos</Trans>
          </EmptyState>
        )}
      </div>
    </>
  );
};

export default List;
