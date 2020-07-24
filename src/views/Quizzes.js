import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { covertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';

const Quizzes = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState();

  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  useEffect(() => {
    ApiRequest.get(`quizzes`)
      .then(({ data }) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader title={<Trans>Arquivo de quizzes</Trans>} />
      <section className="section content">
        {loading ? (
          <Loading />
        ) : (
          <>
            {quizzes && quizzes.length > 0 ? (
              <>
                {quizzes.reverse().map((quiz) => (
                  <div key={quiz.id}>
                    <Link to={`/quiz/${quiz.date}`}>
                      {covertToLongDate(quiz.date, language)}
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <EmptyState>
                <Trans>Sem registos</Trans>
              </EmptyState>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Quizzes;
