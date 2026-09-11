import { useEffect, useState } from "react";
import {
  gerarSenha,
  cancelarSenha,
  escutarFila,
  escutarPosicaoNaFila,
  escutarSenha
} from "../../services/filaService";

import { FilaDados, Senha, SenhaDados } from "./Clientes.types";

export function useCliente(codigo: string | undefined) {
    const [senha, setSenha] = useState<Senha | null>(null);
    const [senhaAtual, setSenhaAtual] = useState(0);
    const [posicao, setPosicao] = useState<number | null>(null);
    const [cancelada, setCancelada] = useState(false);
    const [filaAtiva, setFilaAtiva] = useState(true);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [confirmando, setConfirmando] = useState(false);
    const [chamado, setChamado] = useState(false);
    const [tempoEstimado, setTempoEstimado] = useState(0);

    const chaveSenha = codigo ? `fila-digital:senha:${codigo}` : null;

    useEffect(() => {
        setSenha(null);
        setCancelada(false);
        setChamado(false);
        setPosicao(null);
        setTempoEstimado(0);

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

            setFilaAtiva(dados.ativa);
            setSenhaAtual(dados.senhaAtual || 0);

            if (senha && dados.senhaAtual > senha.numero) {
                if (chaveSenha) localStorage.removeItem(chaveSenha);
                setSenha(null);
                setCancelada(false);
                setChamado(false);
                setConfirmando(false);
                setPosicao(null);
                setTempoEstimado(0);
                return;
            }

            if (senha) {
                const pessoasNaFrente = Math.max(
                    senha.numero - (dados.senhaAtual || 0) - 1,
                    0
                );

                setPosicao(pessoasNaFrente);

                // 5 minutos por pessoa
                setTempoEstimado(pessoasNaFrente * 5);
            }

            setChamado(Boolean(senha && dados.senhaAtual === senha.numero));
        });

        return () => unsub();
    }, [codigo, chaveSenha, senha]);

    useEffect(() => {
        if (!codigo || !senha) return;

        const unsubPosicao = escutarPosicaoNaFila(codigo, senha.numero, (pessoasNaFrente: number) => {
            setPosicao(pessoasNaFrente);
            setTempoEstimado(pessoasNaFrente * 5);
        });
        const unsubSenha = escutarSenha(codigo, senha.senhaDocId, (dados: SenhaDados | null) => {
            if (dados?.cancelada) setCancelada(true);
        });

    return () => {
        unsubPosicao();
        unsubSenha();
    };
    }, [codigo, senha]);

    async function pegarSenha(telefone: string) {
        if (!codigo || loading) return;

        setLoading(true);
        setErro("");
        try {
            const resultado = await gerarSenha(codigo, telefone);
            setSenha(resultado);
            if (chaveSenha) {
                try { localStorage.setItem(chaveSenha, JSON.stringify(resultado)); }
                catch { /* A senha continua disponível se o armazenamento estiver bloqueado. */ }
            }
        } catch (error) {
            setErro(error instanceof Error && !('code' in error)
                ? error.message : "Não foi possível retirar sua senha. Tente novamente.");
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
        erro,
        confirmando,
        chamado,
        tempoEstimado,
        pegarSenha,
        handleCancelar,
        setConfirmando,
        resetar
    };
}
