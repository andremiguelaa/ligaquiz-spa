import React from 'react';
import classNames from 'classnames';

import RankChange from './Player/RankChange';
import Avatar from './Player/Avatar';

import { quizzesOrder } from './consts.js';

import classes from './NationalRanking.module.scss';

const Player = ({ player, quizzes }) => {
  let playerQuizzes = { ...player.quizzes };
  let countingScores = [];
  for (const quizType in playerQuizzes) {
    const orderedEvents = Object.entries(playerQuizzes[quizType])
      .sort(([aKey, aValue], [bKey, bValue]) =>
        `${bValue.score / 100}${bKey}`.localeCompare(
          `${aValue.score / 100}${aKey}`
        )
      )
      .slice(0, 5);
    playerQuizzes[quizType].worstRankingScore =
      orderedEvents[orderedEvents.length - 1][1].score;
    const quizTypeCountingScores = orderedEvents.map((event) => event[1].score);
    countingScores = countingScores.concat(quizTypeCountingScores);
  }

  let lastIterationScore;
  let iterationRank = 1;
  countingScores = countingScores
    .sort((a, b) => b - a)
    .slice(0, 10)
    .reduce((acc, score, index) => {
      if (score) {
        if (score < lastIterationScore) {
          iterationRank = index + 1;
        }
        acc[score] = iterationRank;
        lastIterationScore = score;
      }
      return acc;
    }, {});

  if (player.rank === 26) {
    console.log(player, countingScores);
  }

  return (
    <tr>
      <td className={`${classes.rankCell} has-background-white`}>
        {player.rank}
      </td>
      <td
        className={`${classes.changeCell} has-background-white has-text-centered`}
      >
        <RankChange change={player.change} />
      </td>
      <td className={`${classes.userCell} has-background-white`}>
        <div className={classes.userCellContent}>
          <Avatar player={player.data} />
          <div className={classes.userName}>
            {player.data.name} {player.data.surname}
          </div>
        </div>
      </td>
      <td>
        <strong>{Math.round(player.score)}</strong>
      </td>
      <td>
        <strong>{Math.round(player.sum)}</strong>
      </td>
      {quizzesOrder.map(
        (quizType) =>
          quizzes[quizType] &&
          quizzes[quizType].map((date) => (
            <td
              key={`${player.individual_quiz_player_id}-${quizType}-${date}`}
              className={classNames('has-text-centered', {
                [classes[
                  `top${
                    countingScores[playerQuizzes?.[quizType]?.[date]?.score]
                  }`
                ]]: countingScores[playerQuizzes?.[quizType]?.[date]?.score],
              })}
            >
              {playerQuizzes?.[quizType]?.[date] ? (
                <>
                  {playerQuizzes[quizType][date].result}
                  <sup>{Math.round(playerQuizzes[quizType][date].score)}</sup>
                </>
              ) : (
                '-'
              )}
            </td>
          ))
      )}
    </tr>
  );
};

export default Player;
