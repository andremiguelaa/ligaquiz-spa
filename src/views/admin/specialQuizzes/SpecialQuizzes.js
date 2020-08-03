import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import PaginatedTable from 'components/PaginatedTable';

import classes from './SpecialQuizzes.module.scss';

const SpecialQuizzes = () => {
  const { page } = useParams();
  let history = useHistory();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [quizzes, setQuizzes] = useState();

  useEffect(() => {
    getQuizzes();
  }, []);

  const getQuizzes = () => {
    ApiRequest.get('special-quizzes')
      .then(({ data }) => {
        setQuizzes(data);
      })
      .catch(() => {
        setError(true);
      });
  };

  const deleteQuiz = (id) => {
    setQuizzes();
    ApiRequest.delete('special-quizzes', { data: { id } })
      .then(() => {
        toast.success(<Trans>Quiz especial apagado com sucesso.</Trans>);
        getQuizzes();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar o quiz especial.</Trans>);
        getQuizzes();
      });
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader title={<Trans>Quizzes Especiais</Trans>} />
      <div className="section">
        {!quizzes ? (
          <Loading />
        ) : (
          <>
            <Link className="button is-primary" to="/admin/special-quiz/create">
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Criar quiz especial</Trans>
              </span>
            </Link>
            <br />
            <br />
            {quizzes.length ? (
              <PaginatedTable
                array={quizzes}
                initialPage={page ? page : 1}
                hideHeader
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
                    className: classnames(
                      'is-vertical-middle',
                      classes.subject
                    ),
                  },
                  {
                    id: 'date',
                    className: 'is-vertical-middle',
                    render: (item) => convertToLongDate(item.date, language),
                    className: classnames('is-vertical-middle', classes.date),
                  },
                  {
                    id: 'actions',
                    render: (item) => (
                      <>
                        <div className="buttons has-addons is-pulled-right">
                          {item.date <= moment().format('YYYY-MM-DD') && (
                            <Link
                              className="button"
                              to={`/admin/special-quiz/${item.date}/correct`}
                            >
                              <span className="icon">
                                <i className="fa fa-check"></i>
                              </span>
                            </Link>
                          )}
                          {item.date > moment().format('YYYY-MM-DD') && (
                            <>
                              <Link
                                className="button"
                                to={`/admin/special-quiz/${item.date}/edit`}
                              >
                                <span className="icon">
                                  <i className="fa fa-edit"></i>
                                </span>
                              </Link>
                              <button
                                className="button is-danger"
                                onClick={() => {
                                  deleteQuiz(item.id);
                                }}
                              >
                                <span className="icon">
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    ),
                  },
                ]}
                onChange={(newPage) => {
                  history.push(`/admin/special-quizzes/${newPage}`);
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
        )}
      </div>
    </>
  );
};

export default SpecialQuizzes;
