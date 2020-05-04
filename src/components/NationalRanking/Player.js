import React from 'react';

import RankChange from './Player/RankChange';
import Avatar from './Player/Avatar';

import { quizzesOrder } from './consts.js';

import classes from './NationalRanking.module.scss';

const Player = ({ player, quizzes }) => (
  <tr>
    <td>{player.rank}</td>
    <td>
      <RankChange change={player.change} />
    </td>
    <td>
      <div className={classes.user}>
        <Avatar player={player.data} />
        {player.data.name} {player.data.surname}
      </div>
    </td>
    <td>
      <strong>{Math.round(player.score)}</strong>
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
