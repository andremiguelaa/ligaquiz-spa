import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { subDays } from 'date-fns';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';
import Error from 'components/Error';
import formatDate from 'utils/formatDate';

const Logs = ({ logsDays, setError }) => {
  const { id: userId } = useParams();
  const [{ user: authUser }] = useStateValue();
  const [logs, setLogs] = useState();

  useEffect(() => {
    if (authUser?.valid_roles.admin) {
      ApiRequest.get(
        `logs?user_id[]=${userId || authUser.id}&start_date=${formatDate(
          subDays(new Date(), logsDays)
        )}`
      )
        .then(({ data }) => {
          setLogs(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [authUser, userId, logsDays, setError]);

  if (!authUser?.valid_roles.admin) {
    return <Error status={403} />;
  }

  if (!logs) {
    return <Loading />;
  }

  return (
    <>
      {authUser?.valid_roles.admin && (
        <>
          {logs ? (
            <section className="section content">
              {logs.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <Trans>Descrição</Trans>
                        </th>
                        <th>
                          <Trans>Hora</Trans>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            {log.action || (
                              <>
                                Question Id: {log.question_id}
                                <br />
                                Text: {log.text}
                                <br />
                                Points: {log.points}
                                <br />
                                Submitted: {log.submitted}
                                <br />
                                Correct: {log.correct}
                              </>
                            )}
                          </td>
                          <td>{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState>
                  <Trans>Sem registos</Trans>
                </EmptyState>
              )}
            </section>
          ) : (
            <Loading />
          )}
        </>
      )}
    </>
  );
};

export default Logs;
