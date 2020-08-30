import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';

import List from './Players/List';
import Form from './Players/Form';

const Players = () => {
  const [error, setError] = useState(false);
  const [individualQuizPlayers, setIndividualQuizPlayers] = useState();

  const [initialEditData, setInitialEditData] = useState();

  const [playerToDelete, setPlayerToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState('list');

  useEffect(() => {
    if (page === 'list') {
      setIndividualQuizPlayers();
      ApiRequest.get('individual-quiz-players')
        .then(({ data }) => {
          setIndividualQuizPlayers(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [page]);

  const editPlayer = (player) => {
    setInitialEditData(player);
    setPage('edit');
  };

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

  if (error) {
    return <Error status={error} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Jogadores</Trans>} />
      <div className="section content">
        {!individualQuizPlayers ? (
          <Loading />
        ) : (
          <>
            {
              {
                list: (
                  <List
                    individualQuizPlayers={individualQuizPlayers}
                    setPage={setPage}
                    editPlayer={editPlayer}
                    setPlayerToDelete={setPlayerToDelete}
                  />
                ),
                add: (
                  <Form
                    setPage={setPage}
                    individualQuizPlayers={individualQuizPlayers}
                  />
                ),
                edit: (
                  <Form
                    setPage={setPage}
                    individualQuizPlayers={individualQuizPlayers}
                    initialEditData={initialEditData}
                  />
                ),
              }[page]
            }
          </>
        )}
      </div>
      <Modal
        type="danger"
        open={playerToDelete}
        title={<Trans>Apagar jogador</Trans>}
        body={<Trans>Tens a certeza que queres apagar este jogador?</Trans>}
        action={() => deletePlayer(playerToDelete)}
        doingAction={deleting}
        onClose={() => setPlayerToDelete()}
      />
    </>
  );
};

export default Players;
