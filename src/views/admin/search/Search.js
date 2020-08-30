import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import Markdown from 'components/Markdown';
import PaginatedTable from 'components/PaginatedTable';

import classes from './Search.module.scss';

const Search = () => {
  const { string, page } = useParams();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState();
  const [search, setSearch] = useState(string || '');

  useEffect(() => {
    setQuestions();
    if (string) {
      ApiRequest.get(`questions?search=${string}`)
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    } else {
      setQuestions([]);
    }
  }, [string]);

  if(!user){
    return <Error status={401} />;
  }

  if (!(user.valid_roles.admin || user.valid_roles.quiz_editor)) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!questions) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title={<Trans>Pesquisa de perguntas</Trans>} />
      <section className="section">
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              defaultValue={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  history.push(`/admin/search/${search}`);
                }
              }}
            />
          </div>
          <div className="control">
            <Link to={`/admin/search/${search}`} className="button is-primary">
              <Trans>Pesquisar</Trans>
            </Link>
          </div>
        </div>
        {questions.length > 0 && (
          <PaginatedTable
            array={questions}
            initialPage={page ? page : 1}
            columns={[
              {
                id: 'content',
                label: <Trans>Enunciado</Trans>,
                render: (item) => (
                  <div className="content">
                    <Markdown content={item.content} />
                  </div>
                ),
                className: classes.question,
              },
              {
                id: 'answer',
                label: <Trans>Resposta</Trans>,
                render: (item) => <Markdown content={item.answer} />,
                className: classes.answer,
              },
            ]}
            onChange={(newPage) => {
              history.push(`/admin/search/${search}/${newPage}`);
            }}
            onError={(code) => {
              setError(code);
            }}
          />
        )}
        {!questions.length && string && (
          <EmptyState>
            <Trans>Sem registos</Trans>
          </EmptyState>
        )}
      </section>
    </>
  );
};

export default Search;
