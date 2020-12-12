import React from 'react';
import { Trans } from '@lingui/macro';

import PageHeader from 'components/PageHeader';

const Home = () => (
  <>
    <PageHeader title={process.env.REACT_APP_NAME} />
    <div className="section content">
      <Trans>
        <p>
          A {process.env.REACT_APP_NAME} é um jogo de cultura geral onde a confiança na honestidade
          dos jogadores é crucial.
        </p>
        <p>
          <strong>
            É expressamente proibido usar qualquer fonte externa para obter
            respostas às perguntas.
          </strong>{' '}
          Isto inclui:
        </p>
        <ul>
          <li>Pedir pistas/respostas a outras pessoas.</li>
          <li>
            Usar a Internet, livros ou outro material de consulta para pesquisa
            de pistas/respostas.
          </li>
          <li>
            Usar calculadoras, instrumentos musicais ou outros equipamentos para
            ajudar à resposta.
          </li>
        </ul>
        <p>Apenas papel e caneta/lápis são permitidos.</p>
        <p>
          <strong>
            Pede-se também a todos os jogadores que joguem todos os dias.
          </strong>{' '}
          As faltas adulteram a veracidade da classificação final e podem levar
          à descida de divisão ao incumpridor.
        </p>
      </Trans>
    </div>
  </>
);

export default Home;
