import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'utils/Loading';
import Error from 'utils/Error';
import Modal from 'utils/Modal';

import List from './IndividualPlayers/List';
import Form from './IndividualPlayers/Form';

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
        // action={() => deleteRanking(monthToDelete)}
        doingAction={deleting}
        onClose={() => setPlayerToDelete()}
      />
    </>
  );
};

export default IndividualPlayers;
