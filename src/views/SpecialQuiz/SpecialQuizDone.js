import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import renderMedia from 'utils/renderMedia';
import Markdown from 'components/Markdown';

import classes from './SpecialQuiz.module.scss';

const SpecialQuizDone = ({ data, userAnswers }) => (
  <>
    {data.quiz.questions.map((question, index) => (
      <div key={question.id} className={classes.question}>
        {question.content && (
          <div className={classes.questionText}>
            <Markdown content={question.content} />
          </div>
        )}
        {question.answer && (
          <div>
            <strong>
              <Trans>Resposta correcta</Trans>:
            </strong>{' '}
            {question.answer}
          </div>
        )}
        {userAnswers?.[question.id]?.[0] && (
          <>
            <div>
              <strong>
                <Trans>Resposta dada</Trans>:
              </strong>{' '}
              {userAnswers[question.id][0].text
                ? userAnswers[question.id][0].text
                : '-'}
            </div>
            <div>
              <strong>
                <Trans>Joker usado</Trans>:
              </strong>{' '}
              {userAnswers[question.id][0].points ? (
                <Trans>Sim</Trans>
              ) : (
                <Trans>Não</Trans>
              )}
            </div>
          </>
        )}
        {question.hasOwnProperty('percentage') && (
          <div>
            <strong>
              <Trans>Percentagem de acerto</Trans>:
            </strong>{' '}
            <Link to={`/question/${question.id}`}>
              {Math.round(question.percentage)}%
            </Link>
          </div>
        )}
        {question.media_id && (
          <div className={classes.media}>
            {renderMedia(
              data.media[question.media_id].type,
              data.media[question.media_id].url,
              index
            )}
          </div>
        )}
      </div>
    ))}
  </>
);

export default SpecialQuizDone;
