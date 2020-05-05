import React from 'react';

import RankChange from './Player/RankChange';
import Avatar from './Player/Avatar';

import { quizzesOrder } from './consts.js';

import classes from './NationalRanking.module.scss';

const Player = ({ player, quizzes }) => (
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
          <td key={`${player.individual_quiz_player_id}-${quizType}-${date}`}>
            {player.quizzes?.[date]?.[quizType] ? (
              <>
                {player.quizzes?.[date]?.[quizType].result}
                <sup>
                  {Math.round(player.quizzes?.[date]?.[quizType].score)}
                </sup>
              </>
            ) : (
              '-'
            )}
          </td>
        ))
    )}
  </tr>
);

export default Player;
