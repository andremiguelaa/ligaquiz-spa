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
  const [loadingMonthData, setLoadingMonthData] = useState(false);
  const [initialEditData, setInitialEditData] = useState();

  useEffect(() => {
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

  useEffect(() => {
    if (page === 'list') {
      setMonthList();
      ApiRequest.get('national-rankings')
        .then(({ data }) => {
          setMonthList(data.data);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [page]);

  const editMonth = (date) => {
    setLoadingMonthData(true);
    ApiRequest.get(`individual-quizzes?results&month[]=${date}`)
      .then(({ data }) => {
        setInitialEditData(data.data);
        setPage('edit');
      })
      .catch(() => {
        toast.error(
          <Trans>Não foi possível abrir a edição das provas mensais.</Trans>
        );
      })
      .then(() => {
        setLoadingMonthData(false);
      });
  };

  const deleteRanking = (date) => {
    setDeleting(true);
    ApiRequest.delete('national-rankings', { data: { month: date } })
      .then(() => {
        setMonthList(monthList.filter((item) => item !== date));
        toast.success(<Trans>Provas mensais apagadas com sucesso.</Trans>);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar as provas mensais.</Trans>);
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

  if (
    !monthList ||
    !individualQuizTypes ||
    !individualQuizPlayers ||
    loadingMonthData
  ) {
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
              editMonth={editMonth}
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
          edit: (
            <Form
              monthList={monthList}
              individualQuizTypes={individualQuizTypes}
              individualQuizPlayers={individualQuizPlayers}
              setPage={setPage}
              initialEditData={initialEditData}
            />
          ),
        }[page]
      }
      <Modal
        type="danger"
        open={monthToDelete}
        title={<Trans>Apagar provas mensais</Trans>}
        body={
          <Trans>
            Tens a certeza que queres apagar as provas deste mês e os resultados
            associados?
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
