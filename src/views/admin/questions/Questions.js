import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import useDeepCompareEffect from 'use-deep-compare-effect';

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

const Questions = () => {
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
  const [searchField, setSearchField] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSubgenre, setSelectedSubgenre] = useState('');
  const [page, setPage] = useState();
  const [historyParams, setHistoryParams] = useState({
    search: '',
    searchField: '',
    genre: undefined,
    page: undefined,
  });

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
        setHistoryParams((prev) => ({ ...prev, genre: params.get('genre') }));
      } else {
        setSelectedGenre('');
        setSelectedSubgenre('');
      }
      if (params.get('search')) {
        setQuery(params.get('search'));
        setHistoryParams((prev) => ({ ...prev, search: params.get('search') }));
      } else {
        setQuery('');
      }
      if (params.get('search_field')) {
        setSearchField(params.get('search_field'));
        setHistoryParams((prev) => ({
          ...prev,
          searchField: params.get('search_field'),
        }));
      } else {
        setSearchField('');
      }
      if (params.get('page')) {
        setPage(params.get('page'));
        setHistoryParams((prev) => ({ ...prev, page: params.get('page') }));
      } else {
        setPage(1);
      }
    }
  }, [location.search, genres]);

  useEffect(() => {
    if (genres && location.search) {
      setQuestions();
      ApiRequest.get(`questions${location.search}`)
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [genres, location.search]);

  useDeepCompareEffect(() => {
    history.push(
      `/admin/questions?search=${historyParams.search || ''}&search_field=${
        historyParams.searchField || ''
      }${historyParams.genre ? `&genre=${historyParams.genre}` : ''}${
        historyParams.page ? `&page=${historyParams.page}` : ''
      }`
    );
  }, [history, historyParams]);

  if (!user) {
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
            setHistoryParams((prev) => ({
              ...prev,
              search: query,
              searchField: searchField,
              genre: selectedSubgenre || selectedGenre,
              page: '1',
            }));
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
            <div className={classnames('control', classes.radios)}>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value=""
                  checked={searchField === ''}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Tudo</Trans>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value="content"
                  checked={searchField === 'content'}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Enunciado</Trans>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value="answer"
                  checked={searchField === 'answer'}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Resposta</Trans>
              </label>
            </div>
          </div>
          <div className={classnames('field', 'is-grouped', classes.fields)}>
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
                className: `${classes.question} ${
                  user.valid_roles.admin ? classes.admin : ''
                }`,
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
            ]}
            onChange={(newPage) => {
              setHistoryParams((prev) => ({
                ...prev,
                page: newPage,
              }));
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

export default Questions;
