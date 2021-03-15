import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import Markdown from 'components/Markdown';
import Modal from 'components/Modal';
import PaginatedTable from 'components/PaginatedTable';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import classes from './Questions.module.scss';

const Questions = () => {
  const history = useHistory();
  const [params] = useState(new URLSearchParams(useLocation().search));
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
    search: params.get('search') || '',
    searchField: params.get('search_field') || '',
    genre: params.get('genre') || undefined,
    page: params.get('page') || undefined,
  });
  const [questionToEdit, setQuestionToEdit] = useState();
  const [updating, setUpdating] = useState(false);

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
  }, [params, genres]);

  useEffect(() => {
    if (genres) {
      setQuestions();
      setPage(historyParams.page);
      const queryString = `?search=${historyParams.search || ''}&search_field=${
        historyParams.searchField || ''
      }${historyParams.genre ? `&genre=${historyParams.genre}` : ''}${
        historyParams.page ? `&page=${historyParams.page}` : ''
      }${historyParams.genre ? `&type=quiz` : ''}`;
      ApiRequest.get(`questions${queryString}`)
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
      history.push(`/admin/questions${queryString}`);
    }
  }, [history, genres, historyParams]);

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

  const subGenres = genres.reduce((acc, item) => {
    item.subgenres.forEach((subgenre) => {
      acc[subgenre.id] = subgenre.slug;
    });
    return acc;
  }, {});

  const genreSubgenres =
    selectedGenre &&
    selectedGenre !== 'null' &&
    genres.find((genre) => genre.id.toString() === selectedGenre).subgenres;

  const updateQuestion = (question) => {
    setUpdating(true);
    ApiRequest.patch(`questions`, {
      id: question.id,
      genre: question.genre_id,
    })
      .then(({ data }) => {
        setQuestions((prev) => ({
          ...prev,
          data: prev.data.map((item) => {
            if (item.id === data.id) {
              return {
                ...item,
                ...data,
              };
            }
            return item;
          }),
        }));
        toast.success(<Trans>Pergunta actualizada com sucesso.</Trans>);
        setQuestionToEdit();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível actualizar a pergunta.</Trans>);
      })
      .then(() => {
        setUpdating(false);
      });
  };

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
                  <option value="null">
                    {getGenreTranslation('null', language)}
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
              {
                id: 'genre',
                label: <Trans>Tema</Trans>,
                render: (item) => (
                  <>{getGenreTranslation(subGenres[item.genre_id], language)}</>
                ),
                className: classes.genre,
              },
              {
                id: 'actions',
                render: (item) => (
                  <button
                    className="button"
                    type="button"
                    onClick={() => setQuestionToEdit(item)}
                  >
                    <span className="icon">
                      <i className="fa fa-edit"></i>
                    </span>
                  </button>
                ),
                className: classes.action,
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
      {questionToEdit && (
        <Modal
          type="info"
          open
          title={<Trans>Editar pergunta</Trans>}
          body={
            <div className="field">
              <label className="label">
                <Trans>Tema</Trans>
              </label>
              <div className="control has-icons-left">
                <div className="select">
                  <select
                    value={questionToEdit.genre_id}
                    onChange={(event) => {
                      const newValue = event.target.value;
                      setQuestionToEdit((prev) => ({
                        ...prev,
                        genre_id: newValue,
                      }));
                    }}
                  >
                    {Object.entries(subGenres).map(([id, slug]) => (
                      <option value={id} key={id}>
                        {getGenreTranslation(slug, language)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="icon is-small is-left">
                  <i className="fa fa-book"></i>
                </div>
              </div>
            </div>
          }
          action={() => updateQuestion(questionToEdit)}
          doingAction={updating}
          onClose={() => setQuestionToEdit()}
        />
      )}
    </>
  );
};

export default Questions;
