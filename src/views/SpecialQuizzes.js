import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { covertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import PaginatedTable from 'components/PaginatedTable';
import NoMatch from './NoMatch';

import classes from './SpecialQuizzes/SpecialQuizzes.module.scss';

const SpecialQuizzes = () => {
  const { page } = useParams();
  let history = useHistory();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState();
  const [users, setUsers] = useState();

  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  useEffect(() => {
    ApiRequest.get(`special-quizzes`)
      .then(({ data }) => {
        setQuizzes(data.reverse());
        setLoading(false);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });

    ApiRequest.get(`users`)
      .then(({ data }) => {
        setUsers(
          data.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {})
        );
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    if (error === 404) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      {loading || !users ? (
        <Loading />
      ) : (
        <>
          <PageHeader title={<Trans>Arquivo de quizzes especiais</Trans>} />
          <section className="section">
            <>
              {quizzes && quizzes.length > 0 ? (
                <PaginatedTable
                  array={quizzes}
                  initialPage={page ? page : 1}
                  columns={[
                    {
                      id: 'subject',
                      label: <Trans>Tema</Trans>,
                      render: (item) => (
                        <Link
                          to={`/special-quiz/${item.date}`}
                          className={classes.subjectContent}
                        >
                          {item.subject}
                        </Link>
                      ),
                      className: classes.subject,
                    },
                    {
                      id: 'author',
                      label: <Trans>Autor</Trans>,
                      render: (item) => (
                        <>
                          {users[item.user_id] ? (
                            <>
                              {users[item.user_id].name}{' '}
                              {users[item.user_id].surname}
                            </>
                          ) : (
                            '-'
                          )}
                        </>
                      ),
                      className: classes.author,
                    },
                    {
                      id: 'date',
                      label: <Trans>Data</Trans>,
                      render: (item) => (
                        <>{covertToLongDate(item.date, language)}</>
                      ),
                      className: classes.date,
                    },
                  ]}
                  onChange={(newPage) => {
                    history.push(`/special-quizzes/${newPage}`);
                  }}
                  onError={(code) => {
                    setError(code);
                  }}
                />
              ) : (
                <EmptyState>
                  <Trans>Sem registos</Trans>
                </EmptyState>
              )}
            </>
          </section>
        </>
      )}
    </>
  );
};

export default SpecialQuizzes;
