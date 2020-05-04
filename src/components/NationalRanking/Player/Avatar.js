import React from 'react';
import classes from '../NationalRanking.module.scss';

const Avatar = ({ player }) => (
  <>
    {player.info && player.info.avatar ? (
      <img
        className={classes.avatar}
        alt={`${player.name} ${player.surname}`}
        src={player.info.avatar}
      />
    ) : (
      <i className={`${classes.avatar} fa fa-user`} />
    )}
  </>
);

export default Avatar;
