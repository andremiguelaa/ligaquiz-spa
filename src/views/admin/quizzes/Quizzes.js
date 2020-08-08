import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { toast } from 'react-toastify';

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

const Quizzes = () => {
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
    ApiRequest.get('quizzes')
      .then(({ data }) => {
        setQuizzes(data);
      })
      .catch(() => {
        setError(true);
      });
  };

  const deleteQuiz = (id) => {
    setDeleting(true);
    ApiRequest.delete('quizzes', { data: { id } })
      .then(() => {
        toast.success(<Trans>Quiz apagado com sucesso.</Trans>);
        getQuizzes();
        setQuizToDelete();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar o quiz.</Trans>);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (
    !(
      user.roles.admin ||
      user.roles.quiz_editor ||
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
      <PageHeader title={<Trans>Quizzes</Trans>} />
      <section className="section">
        {!quizzes ? (
          <Loading />
        ) : (
          <>
            {(user.roles.admin || user.roles.quiz_editor) && (
              <>
                <Link className="button is-primary" to="/admin/quiz/create">
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Criar quiz</Trans>
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
                columns={[
                  {
                    id: 'date',
                    className: 'is-vertical-middle',
                    render: (item) => (
                      <Link to={`/quiz/${item.date}`}>
                        {convertToLongDate(item.date, language)}
                      </Link>
                    ),
                  },
                  {
                    id: 'actions',
                    render: (item) => (
                      <>
                        <div className="buttons has-addons is-pulled-right">
                          {item.date <= moment().format('YYYY-MM-DD') &&
                            (user.roles.admin || user.roles.answer_reviewer) && (
                              <Link
                                className="button"
                                to={`/admin/quiz/${item.date}/correct`}
                              >
                                <span className="icon">
                                  <i className="fa fa-check"></i>
                                </span>
                              </Link>
                            )}
                          {item.date > moment().format('YYYY-MM-DD') &&
                            (user.roles.admin || user.roles.quiz_editor) && (
                              <>
                                <Link
                                  className="button"
                                  to={`/admin/quiz/${item.date}/edit`}
                                >
                                  <span className="icon">
                                    <i className="fa fa-edit"></i>
                                  </span>
                                </Link>
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
                              </>
                            )}
                        </div>
                      </>
                    ),
                  },
                ]}
                onChange={(newPage) => {
                  history.push(`/admin/quizzes/${newPage}`);
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
          title={<Trans>Apagar quiz</Trans>}
          body={<Trans>Tens a certeza que queres apagar este quiz?</Trans>}
          action={() => deleteQuiz(quizToDelete)}
          doingAction={deleting}
          onClose={() => setQuizToDelete()}
        />
      )}
    </>
  );
};

export default Quizzes;
