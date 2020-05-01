import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import Loading from 'utils/Loading';
import Error from 'utils/Error';
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

const NationalRanking = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState();
  const [ranking, setRanking] = useState();

  useEffect(() => {
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        if (data.data.length) {
          ApiRequest.get(`national-rankings?month=${data.data[0]}`)
            .then(({ data }) => {
              setQuizzes(data.data.quizzes);
              setRanking(data.data.ranking);
              setLoading(false);
            })
            .catch(() => {
              setError(true);
            });
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <article className="message">
      <div className="message-header">
        <h1>Ranking de Março de 2020</h1>
      </div>
      <div className="message-body">
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
                  <td>name</td>
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
        <h2 className="has-text-weight-bold">Legenda</h2>
        <dl>
          <dt>WQC</dt> <dd>Resultado no Campeonato Mundial</dd>
          <dt>EQC</dt> <dd>Resultado no Campeonato Europeu</dd>
          <dt>CNQ</dt> <dd>Resultado no Campeonato Nacional</dd>
          <dt>INQxx</dt> <dd>Resultado da Inquizição do mês xx</dd>
          <dt>HOTxx</dt> <dd>Resultado do Hot100 do mês xx</dd>
          <dt>SQxx</dt> <dd>Resultado do Squizzed do mês xx</dd>
        </dl>
        <p>
          Para mais pormenores de como o ranking é calculado deve ser consultado
          este artigo:
          <a
            href="https://quizportugal.pt/blog/ranking-nacional-de-quiz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ranking Nacional de Quiz
          </a>
        </p>
        <hr />
        <h2 className="has-text-weight-bold">Arquivo</h2>
        <ul>
          <li>
            <a href="https://ligaquiz.pt/ranking-nacional/2020/3">
              Março de 2020
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default NationalRanking;
