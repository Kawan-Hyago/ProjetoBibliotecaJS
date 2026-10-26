// appEmprestimo.js
// Integração dos empréstimos com o DOM.
// Depende de appLivro.js (variável global "livros" e função "get") e de emprestimos.js.
// Ordem no HTML: appLivro.js -> emprestimos.js -> appEmprestimo.js

let emprestimos = carregarEmprestimos();

const formEmprestimo = document.getElementById("formEmprestimo");
const selectLivro = document.getElementById("livroEmprestimo");
const inputAmigo = document.getElementById("amigo");
const inputDataEmprestimo = document.getElementById("dataEmprestimo");
const btnEmprestar = formEmprestimo.querySelector("button[type='submit']");
const sectionEmprestimos = document.getElementById("listaEmprestimos");

// Evita que texto digitado vire HTML na tela
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Preenche o select só com livros que não estão emprestados
function popularSelectLivros() {
    const disponiveis = livros.filter(livro => !livroEstaEmprestado(emprestimos, livro.id));

    if (disponiveis.length === 0) {
        selectLivro.innerHTML = `<option value="">Nenhum livro disponível</option>`;
        selectLivro.disabled = true;
        btnEmprestar.disabled = true;
        return;
    }

    selectLivro.disabled = false;
    btnEmprestar.disabled = false;
    selectLivro.innerHTML = disponiveis
        .map(livro => `<option value="${livro.id}">${escaparHTML(livro.titulo)}</option>`)
        .join("");
}

// Mostra a lista de empréstimos (mais recentes primeiro)
function renderizarEmprestimos() {
    sectionEmprestimos.innerHTML = "";

    if (emprestimos.length === 0) {
        sectionEmprestimos.innerHTML = "<p>Nenhum empréstimo registrado.</p>";
        return;
    }

    const ordenados = [...emprestimos].sort((a, b) => b.id - a.id);

    ordenados.forEach(emp => {
        const livro = get(livros, emp.livroId);
        const titulo = livro ? escaparHTML(livro.titulo) : "<em>Livro removido</em>";

        const card = document.createElement("div");
        card.className = "emprestimo " + (emp.devolvido ? "devolvido" : "ativo");
        card.innerHTML = `
            <h3>${titulo}</h3>
            <p><strong>Amigo:</strong> ${escaparHTML(emp.amigo)}</p>
            <p><strong>Emprestado em:</strong> ${formatarData(emp.dataEmprestimo)}</p>
            <p><strong>Status:</strong> ${emp.devolvido
                ? "Devolvido em " + formatarData(emp.dataDevolucao)
                : "Emprestado"}</p>
            ${emp.devolvido ? "" : `<button type="button" data-acao="devolver" data-id="${emp.id}">Marcar como devolvido</button>`}
            <button type="button" class="secundario" data-acao="excluir" data-id="${emp.id}">Excluir registro</button>
        `;
        sectionEmprestimos.appendChild(card);
    });
}

// Atualiza select + lista. O appLivro.js chama esta função quando os livros mudam.
function atualizarEmprestimos() {
    popularSelectLivros();
    renderizarEmprestimos();
}

// Registrar empréstimo
formEmprestimo.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectLivro.value) {
        return;
    }

    const novoEmprestimo = criarEmprestimo(
        selectLivro.value,
        inputAmigo.value,
        inputDataEmprestimo.value
    );

    emprestimos = registrarEmprestimo(emprestimos, novoEmprestimo);
    salvarEmprestimos(emprestimos);

    formEmprestimo.reset();
    inputDataEmprestimo.value = hojeISO();
    atualizarEmprestimos();
});

// Botões da lista (devolver / excluir) por delegação de evento
sectionEmprestimos.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);

    if (botao.dataset.acao === "devolver") {
        emprestimos = devolverEmprestimo(emprestimos, id, hojeISO());
    } else if (botao.dataset.acao === "excluir") {
        emprestimos = removerEmprestimo(emprestimos, id);
    }

    salvarEmprestimos(emprestimos);
    atualizarEmprestimos();
});

// Primeira renderização
inputDataEmprestimo.value = hojeISO();
atualizarEmprestimos();
