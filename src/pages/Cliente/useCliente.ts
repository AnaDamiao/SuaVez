import { useEffect, useState } from "react";
import {
  gerarSenha,
  cancelarSenha,
  escutarFila,
  escutarPosicaoNaFila,
  escutarSenha
} from "../../services/filaService";

import { calcularEstimativa } from "./estimativaEspera";

import { FilaDados, Senha, SenhaDados } from "./Clientes.types";

export function useCliente(codigo: string | undefined) {
    const [senha, setSenha] = useState<Senha | null>(null);
    const [senhaAtual, setSenhaAtual] = useState(0);
    const [posicao, setPosicao] = useState<number | null>(null);
    const [cancelada, setCancelada] = useState(false);
    const [filaAtiva, setFilaAtiva] = useState(true);
    const [loading, setLoading] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [chamado, setChamado] = useState(false);
    const [dadosEspera, setDadosEspera] = useState<FilaDados | null>(null);
    const [agora, setAgora] = useState(Date.now);
    const tempoEstimado = calcularEstimativa(
        dadosEspera?.intervalosChamadasMs ?? [], posicao,
        dadosEspera?.ultimaChamadaEm ?? 0, agora,
    );

    useEffect(() => {
        if (!senha || cancelada || chamado || !filaAtiva) return;
        setAgora(Date.now());
        const timer = window.setInterval(() => setAgora(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [senha, cancelada, chamado, filaAtiva]);

    const chaveSenha = codigo ? `fila-digital:senha:${codigo}` : null;

    useEffect(() => {
        setSenha(null);
        setCancelada(false);
        setChamado(false);
        setPosicao(null);
        setDadosEspera(null);

        if (!chaveSenha) return;

        try {
            const armazenada = localStorage.getItem(chaveSenha);
            if (!armazenada) return;

            const senhaRestaurada: unknown = JSON.parse(armazenada);
            if (
            typeof senhaRestaurada === "object" && senhaRestaurada !== null
            && typeof (senhaRestaurada as Senha).numero === "number"
            && typeof (senhaRestaurada as Senha).senhaDocId === "string"
            ) {
            setSenha(senhaRestaurada as Senha);
            }
        } catch {
            localStorage.removeItem(chaveSenha);
        }
    }, [chaveSenha]);

    useEffect(() => {
        if (!codigo) return;

        const unsub = escutarFila(codigo, (dados: FilaDados | null) => {
            if (!dados) return;

            setDadosEspera(dados);
            setAgora(Date.now());
            setFilaAtiva(dados.ativa);
            setSenhaAtual(dados.senhaAtual || 0);

            if (senha && dados.senhaAtual > senha.numero) {
                if (chaveSenha) localStorage.removeItem(chaveSenha);
                setSenha(null);
                setCancelada(false);
                setChamado(false);
                setConfirmando(false);
                setPosicao(null);
                setDadosEspera(null);
                return;
            }

            setChamado(Boolean(senha && dados.senhaAtual === senha.numero));
        });

        return () => unsub();
    }, [codigo, chaveSenha, senha]);

    useEffect(() => {
        if (!codigo || !senha) return;

        const unsubPosicao = escutarPosicaoNaFila(codigo, senha.numero, (pessoasNaFrente: number) => {
            setPosicao(pessoasNaFrente);
        });
        const unsubSenha = escutarSenha(codigo, senha.senhaDocId, (dados: SenhaDados | null) => {
            if (dados?.cancelada) setCancelada(true);
        });

    return () => {
        unsubPosicao();
        unsubSenha();
    };
    }, [codigo, senha]);

    async function pegarSenha() {
        if (!codigo) return;

        setLoading(true);
        try {
            const resultado = await gerarSenha(codigo);
            if (chaveSenha) localStorage.setItem(chaveSenha, JSON.stringify(resultado));
            setSenha(resultado);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelar() {
        if (!senha || !codigo) return;

        if (!confirmando) {
            setConfirmando(true);
            return;
        }

        await cancelarSenha(codigo, senha.senhaDocId);

        setCancelada(true);
        setConfirmando(false);
    }

    function resetar() {
        if (chaveSenha) localStorage.removeItem(chaveSenha);
        setSenha(null);
        setCancelada(false);
        setPosicao(null);
        setChamado(false);
    }

    return {
        senha,
        senhaAtual,
        posicao,
        cancelada,
        filaAtiva,
        loading,
        confirmando,
        chamado,
        tempoEstimado,
        pegarSenha,
        handleCancelar,
        setConfirmando,
        resetar
    };
}