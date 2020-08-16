import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import PaginatedTable from 'components/PaginatedTable';
import NoMatch from 'views/NoMatch';

import classes from './SpecialQuizzes.module.scss';

const SpecialQuizzes = () => {
  const { page } = useParams();
  const history = useHistory();
  const [
    {
      settings: { language },
      user,
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [quizzes, setQuizzes] = useState();
  const [quizToDelete, setQuizToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getQuizzes();
  }, []);

  const getQuizzes = () => {
    setQuizzes();
    ApiRequest.get('special-quizzes')
      .then(({ data }) => {
        setQuizzes(data);
      })
      .catch(() => {
        setError(true);
      });
  };

  const deleteQuiz = (id) => {
    setDeleting(true);
    ApiRequest.delete('special-quizzes', { data: { id } })
      .then(() => {
        toast.success(<Trans>Quiz especial apagado com sucesso.</Trans>);
        getQuizzes();
        setQuizToDelete();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar o quiz especial.</Trans>);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (
    !(
      user.roles.admin ||
      user.roles.special_quiz_editor ||
      user.roles.answer_reviewer
    )
  ) {
    return <NoMatch />;
  }

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
      <PageHeader title={<Trans>Quizzes Especiais</Trans>} />
      <section className="section">
        {!quizzes ? (
          <Loading />
        ) : (
          <>
            {(user.roles.admin || user.roles.special_quiz_editor) && (
              <>
                <Link
                  className="button is-primary"
                  to="/admin/special-quiz/create"
                >
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Criar quiz especial</Trans>
                  </span>
                </Link>
                <br />
                <br />
              </>
            )}
            {quizzes.length ? (
              <PaginatedTable
                array={quizzes}
                initialPage={page ? page : 1}
                hideHeader
                rowClassName={(item) => {
                  if (!item.past && !item.completed) {
                    return 'has-background-danger';
                  }
                }}
                columns={[
                  {
                    id: 'subject',
                    label: <Trans>Tema</Trans>,
                    render: (item) => (
                      <Link
                        to={`/special-quiz/${item.date}`}
                        className={classes.subjectContent}
                      >
                        {item.subject} ({convertToLongDate(item.date, language)}
                        )
                        {!item.past && !item.completed && (
                          <>
                            {' '}
                            - <Trans>Incompleto</Trans>
                          </>
                        )}
                      </Link>
                    ),
                    className: classnames(
                      'is-vertical-middle',
                      classes.subject
                    ),
                  },
                  {
                    id: 'actions',
                    render: (item) => (
                      <>
                        <div className="buttons has-addons is-pulled-right">
                          {!item.past &&
                            (user.roles.admin ||
                              user.roles.special_quiz_editor) && (
                              <Link
                                className="button"
                                to={`/admin/special-quiz/${item.date}/edit`}
                              >
                                <span className="icon">
                                  <i className="fa fa-edit"></i>
                                </span>
                              </Link>
                            )}
                          {!item.past &&
                            !item.today &&
                            (user.roles.admin ||
                              user.roles.special_quiz_editor) && (
                              <button
                                className="button is-danger"
                                onClick={() => {
                                  setQuizToDelete(item.id);
                                }}
                              >
                                <span className="icon">
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            )}
                          {(item.past || item.today) &&
                            (user.roles.admin ||
                              user.roles.answer_reviewer) && (
                              <Link
                                className="button"
                                to={`/admin/special-quiz/${item.date}/correct`}
                              >
                                <span className="icon">
                                  <i className="fa fa-check"></i>
                                </span>
                              </Link>
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
      </section>
      {quizToDelete && (
        <Modal
          type="danger"
          open
          title={<Trans>Apagar quiz especial</Trans>}
          body={
            <Trans>Tens a certeza que queres apagar este quiz especial?</Trans>
          }
          action={() => deleteQuiz(quizToDelete)}
          doingAction={deleting}
          onClose={() => setQuizToDelete()}
        />
      )}
    </>
  );
};

export default SpecialQuizzes;
