import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

import League from './League';
import Cup from './Cup';

const SeasonForm = () => {
  const { season } = useParams();
  const [{ user }] = useStateValue();
  const [error, setError] = useState(false);
  const [users, setUsers] = useState();
  const [validUsers, setValidUsers] = useState();

  useEffect(() => {
    if (!users) {
      ApiRequest.get(`users`)
        .then(({ data }) => {
          const usersObject = data.reduce(
            (acc, user) => {
              acc.users[user.id] = user;
              if (user.valid_roles.admin || user.valid_roles.regular_player) {
                acc.validUsers.push(user);
              }
              return acc;
            },
            {
              users: [],
              validUsers: [],
            }
          );
          setUsers(usersObject.users);
          setValidUsers(usersObject.validUsers);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [users]);

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!users || !validUsers) {
    return <Loading />;
  }

  const editMode = Boolean(season);

  return (
    <>
      <PageHeader
        title={
          !editMode ? (
            <Trans>Criar temporada</Trans>
          ) : (
            <Trans>Editar temporada {season}</Trans>
          )
        }
      />
      <League
        season={season}
        users={users}
        validUsers={validUsers}
        setError={setError}
      />
      {editMode && (
        <Cup
          season={season}
          users={users}
          validUsers={validUsers}
          setError={setError}
        />
      )}
    </>
  );
};

export default SeasonForm;
