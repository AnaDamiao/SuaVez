export interface EstimativaEspera {
  segundos: number;
  minimoMinutos: number;
  maximoMinutos: number;
  amostras: number;
  atrasada: boolean;
}

export function calcularEstimativa(
  intervalos: number[],
  posicao: number | null,
  ultimaChamadaEm: number,
  agora: number,
): EstimativaEspera | null {
  const amostras = intervalos.filter((valor) => Number.isFinite(valor) && valor > 0).slice(-20);
  if (!amostras.length || posicao === null || !ultimaChamadaEm) return null;

  const media = amostras.reduce((soma, valor) => soma + valor, 0) / amostras.length;
  const variancia = amostras.length > 1
    ? amostras.reduce((soma, valor) => soma + (valor - media) ** 2, 0) / (amostras.length - 1)
    : 0;
  // Inclui o atendimento atual, mesmo quando o cliente é o próximo.
  const chamadas = Math.max(0, posicao) + 1;
  const decorrido = Math.max(0, agora - ultimaChamadaEm);
  // Desconta da espera total para manter a contagem entre chamadas.
  const previsaoTotal = media * chamadas;
  const restante = Math.max(0, previsaoTotal - decorrido);
  // Faixa indicativa: dispersão observada e margem mínima de 25%.
  // Não representa um intervalo de confiança nem uma promessa de atendimento.
  const margem = Math.max(Math.sqrt(variancia * chamadas), media * chamadas * 0.25);

  return {
    segundos: Math.ceil(restante / 1000),
    minimoMinutos: Math.floor(Math.max(0, restante - margem) / 60000),
    maximoMinutos: Math.max(1, Math.ceil((restante + margem) / 60000)),
    amostras: amostras.length,
    atrasada: decorrido >= previsaoTotal,
  };
}
