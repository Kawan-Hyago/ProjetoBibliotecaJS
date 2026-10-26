// emprestimos.js
// Funções de negócio dos empréstimos (sem acesso ao DOM).
// Carregado como script comum (sem type="module"), igual ao appLivro.js.
// Por isso os nomes são diferentes de add/remove/get, que já existem no appLivro.js.

// Cria o objeto de empréstimo
const criarEmprestimo = (livroId, amigo, dataEmprestimo) => ({
    id: Date.now(),
    livroId: Number(livroId),
    amigo: amigo.trim(),
    dataEmprestimo,          // formato "AAAA-MM-DD" (vem do input type="date")
    devolvido: false,
    dataDevolucao: null
});

// Registra um empréstimo (retorna um novo array, sem alterar o original)
const registrarEmprestimo = (emprestimosArray, emprestimo) => {
    return [...emprestimosArray, emprestimo];
};

// Marca como devolvido
const devolverEmprestimo = (emprestimosArray, id, dataDevolucao) => {
    return emprestimosArray.map(emp =>
        emp.id === id ? { ...emp, devolvido: true, dataDevolucao } : emp
    );
};

// Remove um empréstimo do histórico
const removerEmprestimo = (emprestimosArray, id) => {
    return emprestimosArray.filter(emp => emp.id !== id);
};

// Empréstimos que ainda não foram devolvidos
const listarEmprestimosAtivos = (emprestimosArray) => {
    return emprestimosArray.filter(emp => !emp.devolvido);
};

// O livro está emprestado agora?
const livroEstaEmprestado = (emprestimosArray, livroId) => {
    return emprestimosArray.some(emp => emp.livroId === Number(livroId) && !emp.devolvido);
};

// Persistência
function salvarEmprestimos(emprestimosArray) {
    localStorage.setItem("emprestimos", JSON.stringify(emprestimosArray));
}

function carregarEmprestimos() {
    const dados = localStorage.getItem("emprestimos");
    if (!dados) {
        return [];
    }
    return JSON.parse(dados);
}

// Data de hoje no formato "AAAA-MM-DD" (usa a data local, não UTC)
function hojeISO() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${agora.getFullYear()}-${mes}-${dia}`;
}

// "2026-10-26" -> "26/10/2026" (sem usar new Date, para evitar problema de fuso horário)
function formatarData(dataISO) {
    if (!dataISO) {
        return "";
    }
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}
