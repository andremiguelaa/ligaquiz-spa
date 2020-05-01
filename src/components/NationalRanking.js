import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import Loading from 'utils/Loading';
import Error from 'utils/Error';
import NoMatch from './NoMatch';
import ApiRequest from 'utils/ApiRequest';

const quizzesOrder = ['wqc', 'eqc', 'cnq', 'hot_100', 'squizzed', 'inquizicao'];

const quizTypeAbbr = {
  wqc: 'WQC',
  eqc: 'EQC',
  cnq: 'CNQ',
  hot_100: 'HOT',
  squizzed: 'SQ',
  inquizicao: 'INQ',
};

const NationalRanking = ({
  match: {
    params: { month },
  },
}) => {
  const [error, setError] = useState(false);
  const [players, setPlayers] = useState();
  const [rankingList, setRankingList] = useState();
  const [quizzes, setQuizzes] = useState();
  const [ranking, setRanking] = useState();

  useEffect(() => {
    setRanking();
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setPlayers(
          data.data.reduce(
            (acc, player) => ({
              ...acc,
              [player.id]: player,
            }),
            {}
          )
        );
      })
      .catch(() => {
        setError(true);
      });

    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setRankingList(data.data);
        if (data.data.length) {
          let monthToLoad = data.data[0];
          if (month && data.data.includes(month)) {
            monthToLoad = month;
          }
          ApiRequest.get(`national-rankings?month=${monthToLoad}`)
            .then(({ data }) => {
              setQuizzes(data.data.quizzes);
              setRanking(data.data.ranking);
            })
            .catch(() => {
              setError(true);
            });
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [month]);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!players || !ranking) {
    return <Loading />;
  }

  if (month && !rankingList.includes(month)) {
    return <NoMatch />;
  }

  return (
    <article className="message">
      <div className="message-header">
        <h1>Ranking de {month || rankingList[0]}</h1>
      </div>
      <div className="message-body">
        <div className="content">
          <div className="table-container">
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Pontos</th>
                  {quizzesOrder.map(
                    (quizType) =>
                      quizzes[quizType] &&
                      quizzes[quizType].map((date) => (
                        <th key={`${quizType}-${date}`}>
                          {quizTypeAbbr[quizType]}
                          {parseInt(date.substring(5, 7))}
                        </th>
                      ))
                  )}
                </tr>
              </thead>
              <tbody>
                {ranking.map((player) => (
                  <tr key={player.individual_quiz_player_id}>
                    <td>{player.rank}</td>
                    <td>
                      {players[player.individual_quiz_player_id].name}{' '}
                      {players[player.individual_quiz_player_id].surname}
                    </td>
                    <td>
                      <strong>{Math.round(player.score)}</strong>
                    </td>
                    {quizzesOrder.map(
                      (quizType) =>
                        quizzes[quizType] &&
                        quizzes[quizType].map((date) => (
                          <td
                            key={`${player.individual_quiz_player_id}-${quizType}-${date}`}
                          >
                            {player.quizzes?.[date]?.[quizType] ? (
                              <>
                                {player.quizzes?.[date]?.[quizType].result}
                                <sup>
                                  {Math.round(
                                    player.quizzes?.[date]?.[quizType].score
                                  )}
                                </sup>
                              </>
                            ) : (
                              '-'
                            )}
                          </td>
                        ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="has-text-weight-bold is-size-5">Legenda</h2>
          <dl className="legend">
            <div>
              <dt className="has-text-weight-bold">WQC</dt>
              <dd>Resultado no Campeonato Mundial</dd>
            </div>
            <div>
              <dt className="has-text-weight-bold">EQC</dt>
              <dd>Resultado no Campeonato Europeu</dd>
            </div>
            <div>
              <dt className="has-text-weight-bold">CNQ</dt>
              <dd>Resultado no Campeonato Nacional</dd>
            </div>
            <div>
              <dt className="has-text-weight-bold">INQxx</dt>
              <dd>Resultado da Inquizição do mês xx</dd>
            </div>
            <div>
              <dt className="has-text-weight-bold">HOTxx</dt>
              <dd>Resultado do Hot100 do mês xx</dd>
            </div>
            <div>
              <dt className="has-text-weight-bold">SQxx</dt>
              <dd>Resultado do Squizzed do mês xx</dd>
            </div>
          </dl>
          <p>
            Para mais pormenores de como o ranking é calculado deve ser
            consultado este artigo:{' '}
            <a
              href="https://quizportugal.pt/blog/ranking-nacional-de-quiz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ranking Nacional de Quiz
            </a>
          </p>
          {rankingList.length && (
            <>
              <h2 className="has-text-weight-bold is-size-5">Arquivo</h2>
              <ol className="links-list">
                {rankingList.map((month) => (
                  <li key={month}>
                    <Link to={`/national-ranking/${month}`}>{month}</Link>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default NationalRanking;
