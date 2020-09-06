import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import getLocaleMonth from 'utils/getLocaleMonth';
import { useStateValue } from 'state/State';
import EmptyState from 'components/EmptyState';
import Error from 'components/Error';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import Modal from 'components/Modal';

const List = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();

  const [error, setError] = useState(false);
  const [monthList, setMonthList] = useState();
  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
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
  }, []);

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

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin && !user.valid_roles.national_ranking_manager) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!monthList) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title={<Trans>Provas mensais</Trans>} />
      <div className="section content">
        <Link
          to="/admin/national-ranking/events/create"
          className="button is-primary"
        >
          <span className="icon">
            <i className="fa fa-plus"></i>
          </span>
          <span>
            <Trans>Adicionar provas mensais</Trans>
          </span>
        </Link>
        <br />
        <br />
        {monthList.length ? (
          <>
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>
                    <Trans>Mês</Trans>
                  </th>
                  <th className="has-text-right">
                    <Trans>Acções</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthList.map((entry) => {
                  return (
                    <tr key={entry}>
                      <td className="is-vertical-middle">
                        <Trans>
                          {getLocaleMonth(
                            language,
                            parseInt(entry.substring(5, 7))
                          )}{' '}
                          de {entry.substring(0, 4)}
                        </Trans>
                      </td>
                      <td>
                        <div className="buttons has-addons is-pulled-right">
                          <Link
                            to={`/admin/national-ranking/events/${entry}/edit`}
                            className="button"
                          >
                            <span className="icon">
                              <i className="fa fa-edit"></i>
                            </span>
                          </Link>
                          <button
                            className="button is-danger"
                            onClick={() => setMonthToDelete(entry)}
                          >
                            <span className="icon">
                              <i className="fa fa-trash"></i>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Modal
              type="danger"
              open={monthToDelete}
              title={<Trans>Apagar provas mensais</Trans>}
              body={
                <Trans>
                  Tens a certeza que queres apagar as provas deste mês e os
                  resultados associados?
                </Trans>
              }
              action={() => deleteRanking(monthToDelete)}
              doingAction={deleting}
              onClose={() => setMonthToDelete()}
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
