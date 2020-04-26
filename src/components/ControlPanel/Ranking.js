import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'utils/Loading';
import Error from 'utils/Error';
import Modal from 'utils/Modal';

import List from './Ranking/List';
import Form from './Ranking/Form';

const Ranking = () => {
  const [error, setError] = useState(false);
  const [monthList, setMonthList] = useState();
  const [individualQuizTypes, setIndividualQuizTypes] = useState();
  const [individualQuizPlayers, setIndividualQuizPlayers] = useState();

  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState('list');

  useEffect(() => {
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setMonthList(data.data);
      })
      .catch(() => {
        setError(true);
      });
    ApiRequest.get('individual-quiz-types')
      .then(({ data }) => {
        setIndividualQuizTypes(data.data);
      })
      .catch(() => {
        setError(true);
      });
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setIndividualQuizPlayers(data.data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const deleteRanking = (date) => {
    setDeleting(true);
    ApiRequest.delete('national-rankings', { data: { month: date } })
      .then(() => {
        setMonthList(monthList.filter((item) => item !== date));
        toast.success(<Trans>Ranking mensal apagado com sucesso.</Trans>);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar o ranking mensal.</Trans>);
      })
      .then(() => {
        setMonthToDelete();
        setDeleting(false);
      });
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!monthList || !individualQuizTypes || !individualQuizPlayers) {
    return <Loading />;
  }

  return (
    <>
      {
        {
          list: (
            <List
              monthList={monthList}
              setPage={setPage}
              setMonthToDelete={setMonthToDelete}
            />
          ),
          add: (
            <Form
              monthList={monthList}
              individualQuizTypes={individualQuizTypes}
              individualQuizPlayers={individualQuizPlayers}
              setPage={setPage}
            />
          ),
        }[page]
      }
      <Modal
        type="danger"
        open={monthToDelete}
        title={<Trans>Apagar ranking mensal</Trans>}
        body={
          <Trans>
            Tens a certeza que queres apagar este ranking mensal e todos os
            quizzes associados?
          </Trans>
        }
        action={() => deleteRanking(monthToDelete)}
        doingAction={deleting}
        onClose={() => setMonthToDelete()}
      />
    </>
  );
};

export default Ranking;
