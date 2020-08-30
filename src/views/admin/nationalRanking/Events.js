import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';

import List from './Events/List';
import Form from './Events/Form';

const Events = () => {
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
        setIndividualQuizTypes(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setIndividualQuizPlayers(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  useEffect(() => {
    if (page === 'list') {
      setMonthList();
      ApiRequest.get('individual-quizzes')
        .then(({ data }) => {
          const list = [
            ...new Set(data.map((event) => event.month)),
          ].sort((a, b) => b.localeCompare(a));
          setMonthList(list);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [page]);

  const editMonth = (date) => {
    setLoadingMonthData(true);
    ApiRequest.get(`individual-quizzes?results&month[]=${date}`)
      .then(({ data }) => {
        setInitialEditData(data);
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
    ApiRequest.delete('individual-quizzes', { data: { month: date } })
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
    return <Error status={error} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Provas mensais</Trans>} />
      <div className="section content">
        {!monthList ||
        !individualQuizTypes ||
        !individualQuizPlayers ||
        loadingMonthData ? (
          <Loading />
        ) : (
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
          </>
        )}
      </div>
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

export default Events;
