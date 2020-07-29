import React, { Fragment, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';
import { Radar } from 'react-chartjs-2';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import { individualQuizTypeOptions } from 'views/admin/nationalRanking/utils/options';
import { quizTypeAbbr } from 'views/NationalRanking/consts';
import { getGenreTranslation } from './Statistics/getGenreTranslation';

import classes from './Statistics/Statistics.module.scss';

const Statistics = () => {
  const { id: userId } = useParams();
  const [
    {
      user: authUser,
      settings: { language },
    },
  ] = useStateValue();
  const [user, setUser] = useState();
  const [error, setError] = useState(false);
  const [individualQuizzes, setIndividualQuizzes] = useState();
  const [genres, setGenres] = useState();
  const [statistics, setStatistics] = useState();
  const [chartSeries, setChartSeries] = useState();

  useEffect(() => {
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    setUser();
    setIndividualQuizzes();
    setStatistics();
    setChartSeries();
    ApiRequest.get(`users?id[]=${userId || authUser.id}&statistics=true`)
      .then(({ data }) => {
        setUser(data[0]);
      })
      .catch(() => {
        setError(true);
      });
  }, [userId, authUser]);

  useEffect(() => {
    if (user && user.individual_quiz_player_id) {
      ApiRequest.get(
        `individual-quizzes?results&individual_quiz_player_id[]=${user.individual_quiz_player_id}`
      ).then(({ data }) => {
        setIndividualQuizzes(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && genres) {
      const computedStatistics = genres.map((genre) => {
        let genreStatistics = {
          id: genre.id,
          slug: genre.slug,
          total: 0,
          correct: 0,
          percentage: 0,
          subgenres: [],
        };
        genre.subgenres.forEach((subgenre) => {
          genreStatistics.total += user.statistics[subgenre.id]?.total || 0;
          genreStatistics.correct += user.statistics[subgenre.id]?.correct || 0;
          genreStatistics.subgenres.push({
            id: subgenre.id,
            slug: subgenre.slug,
            total: user.statistics[subgenre.id]?.total || 0,
            correct: user.statistics[subgenre.id]?.correct || 0,
            percentage:
              ((user.statistics[subgenre.id]?.correct || 0) /
                (user.statistics[subgenre.id]?.total || 1)) *
              100,
          });
        });
        genreStatistics.percentage =
          ((genreStatistics?.correct || 0) / (genreStatistics?.total || 1)) *
          100;
        return genreStatistics;
      });
      setStatistics(computedStatistics);
      setChartSeries(
        computedStatistics.map((genre) => Math.round(genre.percentage))
      );
    }
  }, [user, genres]);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!user || !genres || !statistics) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          userId ? (
            <Trans>
              Estatísticas de {user.name} {user.surname}
            </Trans>
          ) : (
            <Trans>As minhas estatísticas</Trans>
          )
        }
      />
      <section className="section content">
        <div className={classes.info}>
          {user.avatar ? (
            <div className={classes.avatarWrapper}>
              <img
                className={classes.avatar}
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
              />
            </div>
          ) : (
            <i className={classnames('fa', 'fa-user', classes.icon)} />
          )}
          {user.email && (
            <div className={classes.emailWrapper}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
          )}
        </div>
      </section>
      <section className="section content">
        <h1 className="has-text-weight-bold is-size-4">
          <Trans>Liga Quiz</Trans>
        </h1>
        <div className={classes.chart}>
          <Radar
            data={{
              labels: genres.map((genre) =>
                getGenreTranslation(genre.slug, language)
              ),
              datasets: [
                {
                  data: chartSeries,
                  backgroundColor: 'hsla(204, 86%, 53%, 0.3)',
                  borderColor: 'hsl(204, 86%, 53%)',
                  pointRadius: 0,
                  tension: 0.2,
                },
              ],
            }}
            options={{
              scale: {
                ticks: {
                  beginAtZero: true,
                  max: 100,
                  display: false,
                },
                pointLabels: {
                  fontSize: 12,
                },
              },
              legend: {
                display: false,
              },
            }}
          />
        </div>
        {userId && userId !== authUser.id && (
          <div className={classnames('has-text-centered', classes.compare)}>
            <Link to={`/statistics-comparison/${userId}/${authUser.id}`}>
              <Trans>Comparar comigo</Trans>
            </Link>
          </div>
        )}
        <table
          className={classnames(
            'table is-fullwidth is-hoverable is-striped',
            classes.genresTable
          )}
        >
          <thead>
            <tr>
              <th>
                <Trans>Tema</Trans>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom"
                      data-tooltip={i18n._(t`Respostas correctas`)}
                    >
                      <Trans>C</Trans>
                    </span>
                  )}
                </I18n>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom"
                      data-tooltip={i18n._(t`Total de respostas`)}
                    >
                      <Trans>T</Trans>
                    </span>
                  )}
                </I18n>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom has-tooltip-left"
                      data-tooltip={i18n._(t`Percentagem de acerto`)}
                    >
                      %
                    </span>
                  )}
                </I18n>
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{getGenreTranslation(genre.slug, language)}</th>
                  <td>{genre.correct}</td>
                  <td>{genre.total}</td>
                  <td>{Math.round(genre.percentage)}%</td>
                </tr>
                {genre.subgenres.length > 1 && (
                  <>
                    {genre.subgenres.map((subgenre) => (
                      <tr key={subgenre.id} className={classes.subgenre}>
                        <th>{getGenreTranslation(subgenre.slug, language)}</th>
                        <td>{subgenre.correct}</td>
                        <td>{subgenre.total}</td>
                        <td>{Math.round(subgenre.percentage)}%</td>
                      </tr>
                    ))}
                  </>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
      {individualQuizzes && individualQuizzes.length && (
        <section className="section content">
          <h1 className="has-text-weight-bold is-size-4">
            <Trans>Provas individuais</Trans>
          </h1>
          <table className="table is-fullwidth is-hoverable is-striped">
            <thead>
              <tr>
                <th>
                  <Trans>Prova</Trans>
                </th>
                <th>
                  <Trans>Mês</Trans>
                </th>
                <th>
                  <Trans>Resultado</Trans>
                </th>
                <th>
                  <span className="is-hidden-mobile">
                    <Trans>Pontos</Trans>
                  </span>
                  <span className="is-hidden-tablet">
                    <Trans>Pts</Trans>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {individualQuizzes.map((individualQuiz) => {
                const playerResult = individualQuiz.results.filter(
                  (result) =>
                    result.individual_quiz_player_id ===
                    user.individual_quiz_player_id
                )[0];
                return (
                  <tr
                    key={`${individualQuiz.individual_quiz_type}-${individualQuiz.month}`}
                  >
                    <th>
                      <span className="is-hidden-mobile">
                        {individualQuizTypeOptions(
                          individualQuiz.individual_quiz_type
                        )}
                      </span>
                      <abbr className="is-hidden-tablet">
                        {quizTypeAbbr[individualQuiz.individual_quiz_type].abbr}
                      </abbr>
                    </th>
                    <td>{individualQuiz.month}</td>
                    <td>{playerResult.result}</td>
                    <td>{Math.round(playerResult.score)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default Statistics;
