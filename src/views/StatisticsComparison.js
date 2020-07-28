import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { Radar } from 'react-chartjs-2';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import { getGenreTranslation } from './Statistics/getGenreTranslation';

import classes from './Statistics/Statistics.module.scss';

const Statistics = () => {
  const { id1: userId1, id2: userId2 } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [users, setUsers] = useState();
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState();
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
    setUsers();
    setChartSeries();
    ApiRequest.get(`users?id[]=${userId1}&id[]=${userId2}&statistics=true`)
      .then(({ data }) => {
        setUsers(data);
      })
      .catch(() => {
        setError(true);
      });
  }, [userId1, userId2]);

  useEffect(() => {
    if (users && genres) {
      const usersComputedStatistics = [];
      for (let userIndex = 0; userIndex < 2; userIndex++) {
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
            genreStatistics.total +=
              users[userIndex].statistics[subgenre.id]?.total || 0;
            genreStatistics.correct +=
              users[userIndex].statistics[subgenre.id]?.correct || 0;
            genreStatistics.subgenres.push({
              id: subgenre.id,
              slug: subgenre.slug,
              total: users[userIndex].statistics[subgenre.id]?.total || 0,
              correct: users[userIndex].statistics[subgenre.id]?.correct || 0,
              percentage:
                ((users[userIndex].statistics[subgenre.id]?.correct || 0) /
                  (users[userIndex].statistics[subgenre.id]?.total || 1)) *
                100,
            });
          });
          genreStatistics.percentage =
            ((genreStatistics?.correct || 0) / (genreStatistics?.total || 1)) *
            100;
          return genreStatistics;
        });
        usersComputedStatistics[userIndex] = computedStatistics;
      }
      setChartSeries([
        usersComputedStatistics[0].map((genre) => Math.round(genre.percentage)),
        usersComputedStatistics[1].map((genre) => Math.round(genre.percentage)),
      ]);
    }
  }, [users, genres]);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!users || !genres || !chartSeries) {
    return <Loading />;
  }

  console.log(chartSeries);

  return (
    <>
      <PageHeader
        title={<Trans>Comparação estatística</Trans>}
        subtitle={
          <Trans>
            {users[0].name} {users[0].surname} e {users[1].name}{' '}
            {users[1].surname}
          </Trans>
        }
      />
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
                  data: chartSeries[0],
                  backgroundColor: 'hsla(204, 86%, 53%, 0.3)',
                  borderColor: 'hsl(204, 86%, 53%)',
                  pointRadius: 0,
                  tension: 0.2,
                },
                {
                  data: chartSeries[1],
                  backgroundColor: 'hsla(171, 100%, 41%, 0.3)',
                  borderColor: 'hsl(171, 100%, 41%)',
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
          <ul className={classes.chartLegend}>
            <li className={classes.user1}>
              {users[0].name} {users[0].surname}
            </li>
            <li className={classes.user2}>
              {users[1].name} {users[1].surname}
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Statistics;
