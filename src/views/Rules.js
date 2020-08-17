import React from 'react';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import NoMatch from './NoMatch';
import PageHeader from 'components/PageHeader';

const Rules = () => {
  const [{ user }] = useStateValue();
  if (!user) {
    return <NoMatch />;
  }
  return (
    <>
      <PageHeader title={<Trans>Regras</Trans>} />
      <div className="section content">
        <Trans>
          <h2 className="subtitle">Liga Quiz</h2>
          <ol className="rules">
            <li>
              <span>
                A Liga Quiz é um jogo de cultura geral onde a confiança na
                honestidade dos jogadores é crucial. É expressamente proibido
                usar qualquer fonte externa para obter respostas às perguntas.
                Isto inclui:
              </span>
              <ul>
                <li>Pedir pistas/respostas a outras pessoas</li>
                <li>
                  Usar a Internet, livros ou outro material de consulta para
                  pesquisa de pistas/respostas
                </li>
                <li>
                  Usar calculadoras, instrumentos musicais ou outros
                  equipamentos para ajudar à resposta
                </li>
              </ul>
              <span>Apenas papel e caneta/lápis são permitidos.</span>
            </li>
            <li>
              A organização reserva-se ao direito de inibir o acesso à Liga Quiz
              a qualquer jogador que não cumpra este critério.
            </li>
            <li>
              Para receber um convite para entrar na Liga Quiz, todos os novos
              jogadores deverão ser referidos por um jogador activo na Liga
              Quiz, que irá atestar da honestidade e integridade do novo membro.
              A Liga Quiz é uma liga por convite.
            </li>
            <li>
              Todos os estreantes na Liga Quiz serão colocados na divisão mais
              baixa. A preferência de entrada numa divisão é a ordem de entrada
              na lista de espera.
            </li>
            <li>
              Caso um jogador saia da Liga Quiz temporariamente sem aviso e
              reentre novamente na Liga Quiz será colocado na divisão mais baixa
              disponível.
              <br />
              Caso um jogador saia da Liga Quiz temporariamente com aviso
              prévio, por um período máximo de 3 meses, será colocado na mesma
              divisão em que estava quando saiu; existindo os naturais ajustes
              de descidas de divisão.
              <br />
              Um jogador perde o privilégio de voltar à mesma divisão, mesmo com
              aviso prévio, caso esteja mais que três meses de fora no último
              período de 12 meses.
            </li>
            <li>
              As várias divisões da Liga Quiz terão, no máximo, 10 jogadores.
            </li>
            <li>
              Cada jogador jogará 20 jogos a partir da primeira segunda-feira de
              cada mês e nos 19 dias úteis seguintes: duas vezes contra cada um
              dos outros membros da mesma divisão e duas vezes sem adversário
              (no 10º dia e no 20º dia).
            </li>
            <li>
              Cada jogo terá oito perguntas, cada uma de um tema diferente.
            </li>
            <li>
              Os jogadores poderão submeter as respostas a um jogo das 0h até às
              24h (hora de Lisboa) do respectivo dia.
            </li>
            <li>
              Respostas com erros ortográficos serão aceites desde que não se
              altere a fonética da resposta e não esteja explícito na pergunta
              que a correcção ortográfica é obrigatória. Este não é um jogo de
              ortografia mas sim de cultural geral.
            </li>
            <li>
              Quando a resposta é o nome de uma pessoa é aceite como certa se
              for respondido apenas o apelido ou nome pelo qual é mais
              conhecido, excepto se na pergunta estiver explícito que é pedido
              mais isso.
              <br />
              Apesar disso, caso um jogador responda com um apelido certo mas o
              primeiro nome esteja errado, a resposta será considerada errada.
            </li>
            <li>
              Caso um jogador coloque no campo da resposta várias respostas,
              caso alguma esteja errada, será marcado errado.
            </li>
            <li>
              As respostas serão aceites na língua portuguesa, inglesa ou na
              original (no caso de um livro/filme/etc.) a não ser que esteja
              indicado o contrário.
              <br />
              Caso a reposta não seja numa destas línguas deverão indicar entre
              parênteses qual a língua da vossa resposta, caso contrário a
              resposta poderá ser marcada como errada.
            </li>
            <li>
              Além de responder às perguntas, cada jogador deverá atribuir uma
              pontuação à pergunta (à excepção das jornadas 10 e 20). Essa
              pontuação corresponderá aos pontos que o adversário ganhará se
              acertar à pergunta.
            </li>
            <li>
              <span>
                Num jogo, um jogador deverá distribuir a pontuação às perguntas
                da seguinte forma:
              </span>
              <ul>
                <li>1 pergunta a valer 3 pontos</li>
                <li>3 perguntas a valer 2 pontos</li>
                <li>3 perguntas a valer 1 ponto</li>
                <li>1 pergunta a valer 0 pontos</li>
              </ul>
            </li>
            <li>
              O jogador que conseguir mais pontos num jogo é declarado vencedor
              e ganhará 3 pontos na classificação.
            </li>
            <li>
              Em caso de empate ambos os jogadores terão 2 pontos atribuídos na
              classificação.
            </li>
            <li>Em caso de derrota, o jogador terá atribuído 1 ponto.</li>
            <li>
              <span>
                Em caso de um jogador não ter submetido respostas a um jogo não
                terá atribuído qualquer ponto na classificação e o adversário
                será declarado vencedor. O vencedor terá atribuído nesse jogo
                (não na classificação) os seguintes pontos totais:
              </span>
              <ul>
                <li>12 pontos caso acerte 8 perguntas</li>
                <li>10 pontos caso acerte 7 perguntas</li>
                <li>9 pontos caso acerte 6 perguntas</li>
                <li>8 pontos caso acerte 5 perguntas</li>
                <li>6 pontos caso acerte 4 perguntas</li>
                <li>5 pontos caso acerte 3 perguntas</li>
                <li>3 pontos caso acerte 2 perguntas</li>
                <li>2 pontos caso acerte 1 pergunta</li>
                <li>0 pontos caso acerte 0 perguntas</li>
              </ul>
            </li>
            <li>
              No 10º e no 20º dia, os jogos não terão adversário e a pontuação
              para a classificação é atribuída da seguinte forma: meio ponto por
              cada resposta correcta e um ponto por participar na ronda, ou
              seja, um máximo de 5 pontos.
            </li>
            <li>
              No final dos 20 jogos os 2 piores classificados serão relegados
              para a divisão imediatamente inferior (caso exista) e os 2
              melhores classificados serão promovidos à divisão imediatamente
              acima (caso exista).
            </li>
            <li>
              Adicionalmente, caso um (ou mais) dos outros oito jogadores tenha
              mais de 3 faltas ao fim dos 20 jogos, será relegado para a divisão
              imediatamente inferior (caso exista). Em sua substituição será
              promovido mais um jogador da divisão abaixo.
            </li>
            <li>
              A divisão Carolina Beatriz Ângelo é de acesso exclusivo a
              jogadores com ranking nacional, ou seja, que tenham um jogo ao
              vivo a contar para o ranking nos últimos 12 meses. Serão feitos os
              ajustes necessários às subidas/descidas para que isso se
              verifique.
            </li>
            <li>
              O primeiro classificado da divisão Carolina Beatriz Ângelo no
              final dos 20 jogos é declarado o campeão mensal da Liga Quiz.
            </li>
            <li>
              <span>
                Se houver empates na classificação, os critérios de desempate
                serão aplicados por esta ordem:
              </span>
              <ol>
                <li>
                  Maior diferencial de pontos obtidos nos jogos de cada dia
                </li>
                <li>Maior total de pontos obtidos nos jogos de cada dia</li>
                <li>Maior total de vitórias</li>
                <li>Maior total de perguntas respondidas acertadamente</li>
              </ol>
              <span>
                Se após a aplicação dos critérios de desempate persistir o
                empate, será atribuída a mesma classificação aos dois jogadores.
              </span>
            </li>
          </ol>
          <h2 className="subtitle">Quizzes Especiais</h2>
          <ol className="rules">
            <li>
              <span>
                Tal como nos jogos da Liga Quiz é expressamente proibido usar
                qualquer fonte externa para obter respostas às perguntas. Isto
                inclui:
              </span>
              <ul>
                <li>Pedir pistas/respostas a outras pessoas</li>
                <li>
                  Usar a Internet, livros ou outro material de consulta para
                  pesquisa de pistas/respostas
                </li>
                <li>
                  Usar calculadoras, instrumentos musicais ou outros
                  equipamentos para ajudar à resposta
                </li>
              </ul>
              <span>Apenas papel e caneta/lápis são permitidos.</span>
            </li>
            <li>Os quizzes especiais são compostos por 12 perguntas.</li>
            <li>Cada pergunta certa num quiz especial vale 20 pontos.</li>
            <li>Em cada quiz especial podes usar até 5 jokers.</li>
            <li>
              Ao usares um joker numa pergunta, caso acertes, ganhas pontos
              adicionais consoante a percentagem de pessoas que erraram essa
              pergunta.
              <br /> <strong>Exemplo:</strong> Se acertares uma pergunta onde
              usaste um joker e 60% dos jogadores falharem ganhas 80 pontos
              (20+60).
            </li>
            <li>Caso uses um joker e falhes a pergunta, perdes 20 pontos!</li>
          </ol>
          <h2 className="subtitle">Subscrição</h2>
          <p>
            Os novos participantes terão sempre um mês de experiência totalmente
            gratuito tal como estão a ter os actuais participantes.
            <br />A partir desse primeiro mês o preço da participação será de
            acordo com a tabela abaixo:
          </p>
          <table className="table is-not-fullwidth">
            <thead>
              <tr>
                <th>Duração</th>
                <th>Preço</th>
                <th>Desconto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 mês</td>
                <td>3 euros</td>
                <td>-</td>
              </tr>
              <tr>
                <td>3 meses</td>
                <td>8.5 euros</td>
                <td>6%</td>
              </tr>
              <tr>
                <td>6 meses</td>
                <td>16 euros</td>
                <td>11%</td>
              </tr>
              <tr>
                <td>12 meses</td>
                <td>30 euros</td>
                <td>17% (dois meses grátis)</td>
              </tr>
            </tbody>
          </table>
          <p>
            Os jogadores terão direito a jogar, pelo menos, 20 jogos de 8
            perguntas por mês perfazendo um total de 160 perguntas.
          </p>
          <p>
            Adicionalmente serão feitos alguns quizzes especiais temáticos de 12
            perguntas que não contarão para a classificação da liga havendo
            apenas uma classificação do respectivo quiz.
          </p>
          <p>
            O pagamento das inscrições poderá ser feito das seguintes formas:
          </p>
          <ul>
            <li>
              Em mão a qualquer elemento da organização:
              <strong>André Ascensão, Sofia Santos ou Paulo Martins</strong>
            </li>
            <li>
              Por transferência bancária para a conta com o seguinte IBAN
              enviando o comprovativo para{' '}
              <a href="mailto:andremiguelaa@gmail.com">
                andremiguelaa@gmail.com
              </a>
              : <strong>PT50 0018 000344544914020 29</strong>
            </li>
            <li>
              Por MB WAY usando o seguinte número: <strong>916682562</strong>
            </li>
          </ul>
          <p>
            O prazo limite de pagamento para uma determinada temporada será o
            final do dia de sábado antes do início da mesma. Cada temporada
            mensal começa na primeira segunda-feira de cada mês.
          </p>
        </Trans>
      </div>
    </>
  );
};

export default Rules;
