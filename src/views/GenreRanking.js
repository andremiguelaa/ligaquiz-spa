import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import { getGenreTranslation } from 'utils/getGenreTranslation';
import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import NoMatch from 'views/NoMatch';

import Table from './GenreRanking/Table';

const GenreRanking = () => {
  const { season } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [statistics, setStatistics] = useState();
  const [error, setError] = useState();
  const [users, setUsers] = useState();
  const [genres, setGenres] = useState();
  const [seasonNumber, setSeasonNumber] = useState();

  const getStatistics = (season) => {
    setStatistics();
    ApiRequest.get(`answers?season=${season}&submitted=1`)
      .then(({ data: answers }) => {
        const params = Object.keys(answers).reduce((acc, item) => {
          if (acc) {
            return `${acc}&id[]=${item}`;
          } else {
            return `?id[]=${item}`;
          }
        }, '');
        ApiRequest.get(`questions${params}`)
          .then(({ data: questions }) => {
            ApiRequest.get(`genres`)
              .then(({ data: genres }) => {
                setGenres(genres);
                const mappedGenres = genres.reduce((acc, genre) => {
                  const subgenresMap = genre.subgenres.reduce(
                    (innerAcc, subgenre) => {
                      innerAcc[subgenre.id] = genre.id;
                      return innerAcc;
                    },
                    {}
                  );
                  return {
                    ...acc,
                    ...subgenresMap,
                  };
                }, {});
                const mapppedQuestionsGenres = questions.reduce(
                  (acc, question) => {
                    acc[question.id] = question.genre_id;
                    return acc;
                  },
                  {}
                );
                const computedStatistics = []
                  .concat(...Object.values(answers))
                  .reduce((acc, answer) => {
                    if (!acc[answer.user_id]) {
                      acc[answer.user_id] = {
                        user: answer.user_id,
                        total: 0,
                        correct: 0,
                        genres: {},
                      };
                    }
                    const genre =
                      mappedGenres[mapppedQuestionsGenres[answer.question_id]];
                    if (!acc[answer.user_id].genres[genre]) {
                      acc[answer.user_id].genres[genre] = {
                        total: 0,
                        correct: 0,
                      };
                    }
                    acc[answer.user_id].total++;
                    acc[answer.user_id].genres[genre].total++;
                    if (answer.correct) {
                      acc[answer.user_id].correct++;
                      acc[answer.user_id].genres[genre].correct++;
                    }
                    return acc;
                  }, {});
                setStatistics(computedStatistics);
              })
              .catch(({ response }) => {
                setError(response?.status);
              });
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  };

  useEffect(() => {
    if (season) {
      getStatistics(season);
      setSeasonNumber(parseInt(season));
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data }) => {
          if (data.length) {
            let lastSeason = data.find((season) => season.past);
            if (!lastSeason) {
              lastSeason = data[data.length - 1];
            }
            setSeasonNumber(lastSeason.season);
            getStatistics(lastSeason.season);
          }
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [season]);

  useEffect(() => {
    ApiRequest.get(`users`)
      .then(({ data }) => {
        setUsers(
          data.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {})
        );
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (error) {
    if (error === 404 || error === 400 || error === 401 || error === 403) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!statistics || !users) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={<Trans>Rankings temáticos</Trans>}
        subtitle={<Trans>Temporada {seasonNumber}</Trans>}
      />
      <div className="section content">
        {Object.keys(statistics).length > 0 ? (
          <>
            <h2>
              <Trans>Ranking global</Trans>
            </h2>
            <Table
              data={Object.values(statistics).sort(
                (a, b) => b.correct - a.correct
              )}
              users={users}
            />
            {genres.map((genre) => (
              <Fragment key={genre.id}>
                <h2>{getGenreTranslation(genre.slug, language)}</h2>
                <Table
                  data={Object.values(statistics).sort(
                    (a, b) =>
                      (b.genres[genre.id]?.correct || 0) -
                      (a.genres[genre.id]?.correct || 0)
                  )}
                  genre={genre.id}
                  users={users}
                />
              </Fragment>
            ))}
          </>
        ) : (
          <EmptyState>
            <Trans>Sem registos</Trans>
          </EmptyState>
        )}
      </div>
    </>
  );
};

export default GenreRanking;
