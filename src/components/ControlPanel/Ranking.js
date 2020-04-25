import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'utils/Loading';
import Error from 'utils/Error';
import Modal from 'utils/Modal';

import List from './Ranking/List';

const Ranking = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setData(data.data);
      })
      .catch(() => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const deleteRanking = (date) => {
    setDeleting(true);
    ApiRequest.delete('national-rankings', { data: { month: date } })
      .then(() => {
        setData(data.filter((item) => item !== date));
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

  if (loading) {
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
      <List data={data} setMonthToDelete={setMonthToDelete} />
      <Modal
        type="danger"
        open={monthToDelete}
        title={<Trans>Apagar ranking mensal</Trans>}
        body={
          <Trans>
            Tens a certeza que queres apagar este ranking mensal (
            {monthToDelete}) e todos os quizzes associados?
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
