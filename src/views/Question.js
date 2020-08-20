import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Markdown from 'components/Markdown';
import NoMatch from './NoMatch';

import classes from './Question/Question.module.scss';

const Question = () => {
  const { id } = useParams();
  const [error, setError] = useState();
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [statistics, setStatistics] = useState();
  const [users, setUsers] = useState();

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
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    ApiRequest.get(`questions?id[]=${id}`)
      .then(({ data }) => {
        setQuestion(data);
        setAnswers(data.answers.sort((a, b) => b.correct - a.correct));
        setStatistics(
          data.answers.reduce(
            (acc, answer) => {
              if (answer.corrected) {
                acc.total++;
                if (answer.correct) {
                  acc.correct++;
                }
                switch (answer.points) {
                  case 1:
                    acc.one++;
                    break;
                  case 2:
                    acc.two++;
                    break;
                  case 3:
                    acc.three++;
                    break;
                  default:
                    acc.zero++;
                }
              }
              return acc;
            },
            {
              total: 0,
              correct: 0,
              zero: 0,
              one: 0,
              two: 0,
              three: 0,
            }
          )
        );
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [id]);

  if (error) {
    if (error === 404 || error === 400 || error === 403) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!question || !users || !statistics) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title="Estatísticas de pergunta" />
      <section className="section content">
        <div className={classes.question}>
          <div>
            <Markdown content={question.content} />
          </div>
          {question.media && (
            <div className={classes.media}>
              {renderMedia(question.media.type, question.media.url)}
            </div>
          )}
          <dl>
            <div>
              <dt>
                <Trans>Resposta correcta</Trans>
              </dt>
              <dd>{question.answer}</dd>
            </div>
            {answers.length > 0 && (
              <>
                <div>
                  <dt>
                    <Trans>Percentagem de respostas correctas</Trans>
                  </dt>
                  <dd>
                    {Math.round((statistics.correct / statistics.total) * 100)}%
                  </dd>
                </div>

                {question.type === 'special' && (
                  <div>
                    <dt>
                      <Trans>Percentagem de jogadores que usaram joker</Trans>
                    </dt>
                    <dd>
                      {Math.round((statistics.one / statistics.total) * 100)}%
                    </dd>
                  </div>
                )}
                {question.type === 'versus' && (
                  <>
                    <div>
                      <dt>
                        <Trans>
                          Percentagem de jogadores que atribuíram 0 pontos
                        </Trans>
                      </dt>
                      <dd>
                        {Math.round((statistics.zero / statistics.total) * 100)}
                        %
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Trans>
                          Percentagem de jogadores que atribuíram 1 ponto
                        </Trans>
                      </dt>
                      <dd>
                        {Math.round((statistics.one / statistics.total) * 100)}%
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Trans>
                          Percentagem de jogadores que atribuíram 2 pontos
                        </Trans>
                      </dt>
                      <dd>
                        {Math.round((statistics.two / statistics.total) * 100)}%
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <Trans>
                          Percentagem de jogadores que atribuíram 3 pontos
                        </Trans>
                      </dt>
                      <dd>
                        {Math.round(
                          (statistics.three / statistics.total) * 100
                        )}
                        %
                      </dd>
                    </div>
                  </>
                )}
              </>
            )}
          </dl>
          {answers.length > 0 && (
            <table
              className={classnames(
                'table',
                'is-fullwidth',
                'is-hoverable',
                classes.table
              )}
            >
              <thead>
                <tr>
                  <th>
                    <Trans>Nome</Trans>
                  </th>
                  {question.type === 'versus' && (
                    <th>
                      <Trans>Pontos atribuídos</Trans>
                    </th>
                  )}
                  {question.type === 'special' && (
                    <th>
                      <Trans>Joker</Trans>
                    </th>
                  )}
                  <th>
                    <Trans>Correcção</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {answers.map((answer) => {
                  if (answer.corrected) {
                    return (
                      <tr key={answer.user_id}>
                        <td>
                          {users[answer.user_id].name}{' '}
                          {users[answer.user_id].surname}
                        </td>
                        {question.type === 'versus' && <td>{answer.points}</td>}
                        {question.type === 'special' && (
                          <td>{answer.points ? <Trans>Sim</Trans> : '-'}</td>
                        )}
                        <td>
                          {Boolean(answer.correct) && <Trans>Correcta</Trans>}
                          {Boolean(answer.corrected && !answer.correct) && (
                            <Trans>Errada</Trans>
                          )}
                          {!answer.corrected && '-'}
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default Question;
