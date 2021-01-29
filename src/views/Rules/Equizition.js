import React from 'react';
import { Link } from 'react-router-dom';

const Equizition = () => (
  <>
    <h2 className="subtitle">{process.env.REACT_APP_NAME}</h2>
    <ol className="rules">
      <li>
        {process.env.REACT_APP_NAME} is a general knowledge game in which trust
        in players' honesty is essential. It's completely forbidden the use of
        external sources to get answers.
      </li>
      <li>
        The organization reserves the right to ban any player who does not meet
        this criterion.
      </li>
      <li>All rookies will be placed in the lowest tier.</li>
      <li>
        If a player leaves {process.env.REACT_APP_NAME} and rejoins later, that
        player will be placed in the lowest available tier.
      </li>
      <li>Each tier will have a maximum of 10 players.</li>
      <li>
        Each player will play 20 games from the first Monday of each month and
        in the following 19 working days: twice against each other player of the
        same tier and twice without an opponent (on the 10th and 20th rounds).
      </li>
      <li>
        Each game will have eight questions, each one about a different theme.
      </li>
      <li>
        Players will be able to submit answers to a game from 0 a.m. until
        midnight (Lisbon time) of the respective day.
      </li>
      <li>
        Misspelled answers will be accepted as long as the answer's phonetics
        are not significantly changed and it's not stated in the question that
        spelling correction is mandatory.
      </li>
      <li>
        When the answer is a person's name, the surname or name by which that
        person is best known will suffice unless the question explicitly states
        that more is required.
        <br />
        However, if a player answers with a correct surname but the first name
        is wrong, the answer will be considered wrong.
      </li>
      <li>
        If a player gives several answers, if any is wrong, it will be marked
        wrong.
      </li>
      <li>
        Answers will be accepted in English or in the original language (in the
        case of a book/film/etc.) unless stated otherwise.
        <br />
        If the answer is not in one of these languages, you must indicate in
        parentheses which language is your answer, otherwise the answer may be
        marked as wrong.
      </li>
      <li>
        In addition to answering the questions, each player must assign a score
        to the question (with the exception of rounds 10 and 20). This score
        will correspond to the points that the opponent will earn if he answers
        the question correctly.
      </li>
      <li>
        <span>
          In a game, a player must distribute the score to the questions as
          follows:
        </span>
        <ul>
          <li>3 points for 1 question</li>
          <li>2 points for 3 questions</li>
          <li>1 point for 3 questions</li>
          <li>0 points for 1 question</li>
        </ul>
      </li>
      <li>
        The player who gets the most points in a game is declared the winner and
        will earn 3 points in the ranking.
      </li>
      <li>
        In the event of a draw, both players will be awarded 2 points in the
        ranking.
      </li>
      <li>In case of defeat, the player will be awarded 1 point.</li>
      <li>
        <span>
          If a player has not submitted answers to a game, that player will not
          have awarded any points in the ranking and the opponent will be
          declared the winner. The winner will have awarded in this game the
          following total points:
        </span>
        <ul>
          <li>12 points for 8 correct answers</li>
          <li>10 points for 7 correct answers</li>
          <li>9 points for 6 correct answers</li>
          <li>8 points for 5 correct answers</li>
          <li>6 points for 4 correct answers</li>
          <li>5 points for 3 correct answers</li>
          <li>3 points for 2 correct answers</li>
          <li>2 points for 1 correct answer</li>
          <li>0 points for 0 correct answers</li>
        </ul>
      </li>
      <li>
        On the 10th and 20th round, the games will have no opponent and the
        score for the ranking is attributed as follows: half a point for each
        correct answer and one point for participating in the round, that is, a
        maximum of 5 points.
      </li>
      <li>
        At the end of the 20 games, the 2 worst classified players will be
        relegated to the next lowest tier (if any) and the 2 best classified
        players will be promoted to the immediately above tier (if any).
      </li>
      <li>
        Additionally, if one (or more) of the other eight players has more than
        3 forfeits at the end of the 20 games, they will be relegated to the
        next lowest tier (if any). In their place, players from the tier below
        will be promoted.
      </li>
      <li>
        The first-placed player in the first tier at the end of the 20 games is
        declared {process.env.REACT_APP_NAME} monthly champion.
      </li>
      <li>
        <span>
          If there are ties in the ranking, the tiebreaker criteria will be
          applied in this order:
        </span>
        <ol>
          <li>
            Highest differential of points obtained in the games of each round
          </li>
          <li>Highest total points obtained in the games of each round</li>
          <li>Highest total wins</li>
          <li>Highest total of questions answered correctly</li>
        </ol>
        <span>
          If, after applying the tiebreaker criteria, a tie persists, the two
          players will be awarded the same place.
        </span>
      </li>
    </ol>
    <h2 className="subtitle">Cup</h2>
    <ol className="rules">
      <li>
        Alongside the league, there is a cup each season using the same quizzes
        that are played for the league.
      </li>
      <li>
        The cup will have the number of rounds necessary to make possible the
        participation of all players.
      </li>
      <li>
        In each round, a player will have an opponent or will be directly
        qualified for the next round if there are not enough players.
      </li>
      <li>The opponents of each round are defined through a draw.</li>
      <li>
        On days in which a player has a cup game, he must assign also points to
        the cup opponent.
      </li>
      <li>
        <span>
          If there are ties in cup games, the tiebreaker criteria will be
          applied in this order:
        </span>
        <ol>
          <li>The player in the lower tier wins</li>
          <li>The player with the lowest rank in the previous season wins</li>
        </ol>
        <span>
          If the previous criteria cannot be applied (because the player is not
          in any tier or did not play in the previous season), the most recent
          player in {process.env.REACT_APP_NAME} wins.
        </span>
      </li>
    </ol>
    <h2 className="subtitle">Special Quizzes</h2>
    <ol className="rules">
      <li>
        As in the other games, it is strictly forbidden to use any external
        source to obtain answers to questions.
      </li>
      <li>Special quizzes consist of 12 questions.</li>
      <li>For each correct answer in a special quiz, you get 20 points.</li>
      <li>You can use up to 5 jokers in each special quiz.</li>
      <li>
        When you use a joker in a question and get it right, you earn extra
        points depending on the percentage of players who got that question
        wrong.
        <br /> <strong>Example:</strong> If you get a question right with a
        joker and 60% of the players failed to give the correct answer you get
        80 points (20+60).
      </li>
      <li>
        But if you use a joker and miss the correct answer, you get 20 negative
        points!
      </li>
    </ol>
    <h2 className="subtitle" id="subscription">
      Subscription
    </h2>
    <p>
      New players have a one-month free trial.
      <br />
      After that, the price will be according to the following table:
    </p>
    <table className="table is-not-fullwidth">
      <thead>
        <tr>
          <th>Duration</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1 month</td>
          <td>€ 4.99/month</td>
        </tr>
        <tr>
          <td>3 months</td>
          <td>€ 4.66/month</td>
        </tr>
        <tr>
          <td>6 months</td>
          <td>€ 4.33/month</td>
        </tr>
        <tr>
          <td>12 months</td>
          <td>€ 3.99/month</td>
        </tr>
      </tbody>
    </table>
    <p>
      Players will be entitled to play at least 20 games of 8 questions per
      month for a total of 160 questions.
    </p>
    <p>In addition, there will be some special quizzes with 12 questions.</p>
    <p>
      Payment for the subscription can be made via Paypal on your{' '}
      <Link to="/account/">account page</Link>.
    </p>
    <p>
      The payment deadline for a given season will be the end of Saturday before
      the season begins. Each monthly season begins on the first Monday of each
      month.
    </p>
  </>
);

export default Equizition;
