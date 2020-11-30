import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import Markdown from 'components/Markdown';
import PaginatedTable from 'components/PaginatedTable';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import classes from './Questions.module.scss';

const Translate = () => {
  const history = useHistory();
  const location = useLocation();
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState();
  const [questions, setQuestions] = useState();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSubgenre, setSelectedSubgenre] = useState('');
  const [genre, setGenre] = useState();
  const [page, setPage] = useState();

  useEffect(() => {
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  useEffect(() => {
    if (genres) {
      const params = new URLSearchParams(location.search);
      if (params.get('genre')) {
        const paramGenre = genres.find(
          (item) => item.id === parseInt(params.get('genre'))
        );
        if (!paramGenre) {
          genres.forEach((item) => {
            const subgenre = item.subgenres.find(
              (item) => item.id === parseInt(params.get('genre'))
            );
            if (subgenre) {
              setSelectedGenre(item.id.toString());
              setSelectedSubgenre(subgenre.id.toString());
            }
          });
        } else {
          setSelectedGenre(paramGenre.id.toString());
        }
        setGenre(params.get('genre'));
      } else {
        setSelectedGenre('');
        setSelectedSubgenre('');
        setGenre();
      }
      if (params.get('search')) {
        setSearch(params.get('search'));
        setQuery(params.get('search'));
      } else {
        setSearch('');
        setQuery('');
      }
      if (params.get('page')) {
        setPage(params.get('page'));
      } else {
        setPage(1);
      }
    }
  }, [location.search, genres]);

  useEffect(() => {
    if (genres && page) {
      setQuestions();
      ApiRequest.get(
        `questions?search=${search}${genre ? `&genre=${genre}` : ''}${
          page ? `&page=${page}` : ''
        }`
      )
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [genres, search, genre, page]);

  if (!user) {
    return <Error status={401} />;
  }

  if (
    !(
      user.valid_roles.admin ||
      user.valid_roles.quiz_editor ||
      user.valid_roles.translator
    )
  ) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!questions) {
    return <Loading />;
  }

  const setHistory = ({ search, genre, page }) => {
    history.push(
      `/admin/questions?search=${search}${
        genre ? `&genre=${genre}` : ''
      }&page=${page}`
    );
  };

  const genreSubgenres =
    selectedGenre &&
    genres.find((genre) => genre.id.toString() === selectedGenre).subgenres;

  return (
    <>
      <PageHeader title={<Trans>Pesquisa de perguntas</Trans>} />
      <section className={classnames('section', classes.questions)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setHistory({
              search: query,
              genre: selectedSubgenre || selectedGenre,
              page: 1,
            });
          }}
          className={classes.form}
        >
          <div className={classnames('field', 'is-grouped', classes.fields)}>
            <label className={classnames('label', classes.label)}>
              <Trans>Texto</Trans>
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                defaultValue={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <label className={classnames('label', classes.label)}>
              <Trans>Tema</Trans>
            </label>
            <div className="control has-icons-left">
              <div className="select">
                <select
                  value={selectedGenre}
                  onChange={(event) => {
                    setSelectedGenre(event.target.value);
                    setSelectedSubgenre('');
                  }}
                >
                  <option value="">
                    {getGenreTranslation('all', language)}
                  </option>
                  {genres.map((genre) => (
                    <option value={genre.id} key={genre.slug}>
                      {getGenreTranslation(genre.slug, language)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="icon is-small is-left">
                <i className="fa fa-book"></i>
              </div>
            </div>
            {genreSubgenres && genreSubgenres.length > 1 && (
              <>
                <label className={classnames('label', classes.label)}>
                  <Trans>Subtema</Trans>
                </label>
                <div className="control has-icons-left">
                  <div className="select">
                    <select
                      value={selectedSubgenre}
                      onChange={(event) => {
                        setSelectedSubgenre(event.target.value);
                      }}
                    >
                      <option value="">
                        {getGenreTranslation('all', language)}
                      </option>
                      {genreSubgenres &&
                        genreSubgenres.map((subgenre) => (
                          <option value={subgenre.id} key={subgenre.slug}>
                            {getGenreTranslation(subgenre.slug, language)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fa fa-book"></i>
                  </div>
                </div>
              </>
            )}
            <div className={classnames('control', classes.control)}>
              <button className="button is-primary">
                <Trans>Pesquisar</Trans>
              </button>
            </div>
          </div>
        </form>
        {questions.data?.length > 0 && (
          <PaginatedTable
            array={questions.data}
            totalRows={questions.total}
            itemsPerPage={10}
            initialPage={page}
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
              {
                id: 'quiz',
                label: <Trans>Quiz</Trans>,
                render: (item) => (
                  <>
                    {item.quiz?.type === 'quiz' ? (
                      <Link to={`/quiz/${item.quiz?.date}`}>
                        <Trans>Quiz</Trans> {item.quiz?.date}
                      </Link>
                    ) : (
                      <Link to={`/special-quiz/${item.quiz?.date}`}>
                        <Trans>Quiz especial</Trans> ({item.quiz?.date})
                      </Link>
                    )}
                  </>
                ),
                className: classes.quiz,
              },
              (user.valid_roles.admin || user.valid_roles.translator) && {
                id: 'translated',
                label: <Trans>Traduzida</Trans>,
                render: (item) => <>{item.translated}</>,
                className: classes.translated,
              },
              user.valid_roles.admin && {
                id: 'used',
                label: <Trans>Usada</Trans>,
                render: (item) => <>{item.used}</>,
                className: classes.used,
              },
            ].filter(Boolean)}
            onChange={(newPage) => {
              setHistory({
                search,
                genre,
                page: newPage,
              });
            }}
            onError={(code) => {
              setError(code);
            }}
          />
        )}
        {questions.data && !questions.data.length && (
          <EmptyState>
            <Trans>Sem registos</Trans>
          </EmptyState>
        )}
      </section>
    </>
  );
};

export default Translate;
