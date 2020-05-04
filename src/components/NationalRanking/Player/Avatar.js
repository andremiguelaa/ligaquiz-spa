import React from 'react';
import classes from '../NationalRanking.module.scss';

const Avatar = ({ player }) => (
  <>
    {player.info && player.info.avatar ? (
      <img
        className={classes.userAvatar}
        alt={`${player.name} ${player.surname}`}
        src={player.info.avatar}
      />
    ) : (
      <i className={`${classes.userAvatar} fa fa-user`} />
    )}
  </>
);

export default Avatar;
