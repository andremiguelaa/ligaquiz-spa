import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';

import List from '../IndividualPlayers/List';
import Form from '../IndividualPlayers/Form';

const IndividualPlayers = () => {
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
          setIndividualQuizPlayers(data.data);
        })
        .catch(() => {
          setError(true);
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
        console.log();
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

  if (!individualQuizPlayers) {
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

export default IndividualPlayers;
