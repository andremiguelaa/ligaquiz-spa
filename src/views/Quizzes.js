import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import PaginatedTable from 'components/PaginatedTable';

const Quizzes = () => {
  const { page } = useParams();
  const history = useHistory();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState();

  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  useEffect(() => {
    ApiRequest.get(`quizzes?past`)
      .then(({ data }) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (error) {
    return <Error status={error} />;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader title={<Trans>Arquivo de quizzes</Trans>} />
          <section className="section">
            <>
              {quizzes && quizzes.length > 0 ? (
                <PaginatedTable
                  array={quizzes}
                  initialPage={page ? page : 1}
                  hideHeader
                  columns={[
                    {
                      id: 'date',
                      render: (item) => (
                        <Link to={`/quiz/${item.date}`}>
                          {convertToLongDate(item.date, language)}
                        </Link>
                      ),
                    },
                  ]}
                  onChange={(newPage) => {
                    history.push(`/quizzes/${newPage}`);
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

export default Quizzes;
