import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PaginatedTable from 'components/PaginatedTable';
import Markdown from 'components/Markdown';

const ExternalQuestionPick = ({ genre, grabQuestion }) => {
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuestions();
    ApiRequest.get(`external-questions?used=0&genre=${genre}&page=${page}`)
      .then(({ data }) => {
        setQuestions(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [genre, page]);

  if (error) {
    return <Error status={error} />;
  }

  if (!questions) {
    return <Loading />;
  }

  return (
    <>
      {questions.data?.length > 0 && (
        <PaginatedTable
          array={questions.data}
          totalRows={questions.total}
          itemsPerPage={10}
          initialPage={page}
          columns={[
            {
              id: 'formulation',
              label: <Trans>Enunciado</Trans>,
              render: (item) => (
                <div className="content">
                  <Markdown content={item.formulation} />
                </div>
              ),
            },
            {
              id: 'answer',
              label: <Trans>Resposta</Trans>,
              render: (item) => (
                <div className="content">
                  <Markdown content={item.answer} />
                </div>
              ),
            },
            {
              id: 'actions',
              label: <Trans>Usar</Trans>,
              render: (item) => (
                <button
                  className="button"
                  type="button"
                  onClick={() => grabQuestion(item)}
                >
                  <span className="icon">
                    <i className="fa fa-thumbs-up"></i>
                  </span>
                </button>
              ),
            },
          ].filter(Boolean)}
          onChange={(newPage) => {
            setPage(newPage);
          }}
          onError={(code) => {
            setError(code);
          }}
        />
      )}
    </>
  );
};

export default ExternalQuestionPick;
