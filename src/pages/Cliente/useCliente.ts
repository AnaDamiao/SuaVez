import { useEffect, useRef, useState } from "react";
import {
  gerarSenha,
  cancelarSenha,
  escutarFila,
  escutarPosicaoNaFila,
  escutarSenha
} from "../../services/filaService";

import { FilaDados, Senha, SenhaDados, Unsubscribe } from "./Clientes.types";

export function useCliente(codigo: string | undefined) {
    const [senha, setSenha] = useState<Senha | null>(null);
    const [senhaAtual, setSenhaAtual] = useState(0);
    const [posicao, setPosicao] = useState<number | null>(null);
    const [cancelada, setCancelada] = useState(false);
    const [filaAtiva, setFilaAtiva] = useState(true);
    const [loading, setLoading] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [chamado, setChamado] = useState(false);
    const [tempoEstimado, setTempoEstimado] = useState(0);

    const unsubPosicaoRef = useRef<Unsubscribe | null>(null);
    const unsubSenhaRef = useRef<Unsubscribe | null>(null);

    useEffect(() => {
    if (!codigo) return;

    const unsub = escutarFila(codigo, (dados: FilaDados | null) => {
    if (!dados) return;

    setFilaAtiva(dados.ativa);
    setSenhaAtual(dados.senhaAtual || 0);

    if (senha) {
        const pessoasNaFrente = Math.max(
            senha.numero - (dados.senhaAtual || 0) - 1,
            0
        );

        setPosicao(pessoasNaFrente);

        // 5 minutos por pessoa
        setTempoEstimado(pessoasNaFrente * 5);
    }

    if (senha && dados.senhaAtual === senha.numero) {
        setChamado(true);
    }
    });

    return () => unsub();
    }, [codigo, senha]);

    useEffect(() => {
    return () => {
        unsubPosicaoRef.current?.();
        unsubSenhaRef.current?.();
    };
    }, []);

    async function pegarSenha() {
    if (!codigo) return;

    setLoading(true);
    try {
        const resultado = await gerarSenha(codigo);
        setSenha(resultado);

        unsubPosicaoRef.current = escutarPosicaoNaFila(
        codigo,
        resultado.numero,
        setPosicao
        );

        unsubSenhaRef.current = escutarSenha(
        codigo,
        resultado.senhaDocId,
        (dados: SenhaDados | null) => {
            if (dados?.cancelada) setCancelada(true);
        }
        );
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

    unsubPosicaoRef.current?.();
    unsubSenhaRef.current?.();
    }

    function resetar() {
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