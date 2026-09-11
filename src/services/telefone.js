export function normalizarCelular(valor) {
  const texto = valor.trim();
  if (!texto) return null;
  if (!/^[+\d\s().-]+$/.test(texto)) throw new Error("Informe um celular válido com DDD.");
  let digitos = texto.replace(/\D/g, "");
  if (digitos.length === 13 && digitos.startsWith("55")) digitos = digitos.slice(2);
  if (!/^[1-9]{2}9\d{8}$/.test(digitos)) {
    throw new Error("Informe um celular com DDD, por exemplo: (11) 99999-9999.");
  }
  return `+55${digitos}`;
}
