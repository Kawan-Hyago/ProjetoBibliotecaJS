// --- 1. FUNÇÕES DE NEGÓCIO ---

const add = (livrosArray, livro) => {
    return [...livrosArray, livro];
}

const get = (livrosArray, id) => livrosArray.find(livro => livro.id == id);

const listLivroByTitulo = (livrosArray, termo) => 
    livrosArray.filter(livro => 
        livro.titulo.toLowerCase().includes(termo.toLowerCase())
    );

const listLivroByGenero = (livrosArray, genero) =>
    livrosArray.filter(livro => 
        livro.genero.toLowerCase().includes(genero.toLowerCase())
    );

const marcarComoLido = (livrosArray, id) => {
    return livrosArray.map(livro =>
        livro.id === id ? { ...livro, lido: !livro.lido } : livro
    );
}

function listarNaoLidos(livrosArray) {
    return livrosArray.filter(livro => !livro.lido);
}

function totalPaginas(livrosArray) {
    return livrosArray.reduce((total, livro) => total + Number(livro.paginas), 0);
}

function possuiLivrosNaoLidos(livrosArray) {
    return livrosArray.some(livro => !livro.lido);
}

function todosForamLidos(livrosArray) {
    return livrosArray.every(livro => livro.lido);
}

function salvarLivros(livrosArray) {
    localStorage.setItem("livros", JSON.stringify(livrosArray));
}

function carregarLivros() {
    const dados = localStorage.getItem("livros");
    if (!dados) {
        return [];
    }
    return JSON.parse(dados);
}

function totalLivros(livrosArray) {
    return livrosArray.length;
}

function livrosLidos(livrosArray) {
    return livrosArray.reduce((total, livro) => livro.lido ? total + 1 : total, 0);
}

function livrosNaoLidos(livrosArray) {
    return livrosArray.reduce((total, livro) => !livro.lido ? total + 1 : total, 0);
}

function estatistics(livrosArray) {
    return {
        totalLivros: totalLivros(livrosArray),
        livrosLidos: livrosLidos(livrosArray),
        livrosNaoLidos: livrosNaoLidos(livrosArray),
        totalPaginas: totalPaginas(livrosArray)
    };
}

const remove = (livrosArray, id) => {
    return livrosArray.filter(livro => livro.id !== id);
}


// --- 2. INTEGRAÇÃO COM O DOM (app.js) ---

// Carrega os livros salvos ao iniciar
let livros = carregarLivros();

const formLivro = document.getElementById("formLivro");
const inputPesquisa = document.getElementById("pesquisa");
const sectionEstatisticas = document.getElementById("estatisticas");
const sectionListaLivros = document.getElementById("listaLivros");

// Função centralizadora para atualizar a interface
function atualizarTela(colecao) {
    renderizarLivros(colecao);
    atualizarEstatisticas(colecao);
}

// 6. Renderizar os livros na tela
function renderizarLivros(colecao) {
    sectionListaLivros.innerHTML = "";

    if (colecao.length === 0) {
        sectionListaLivros.innerHTML = "<p>Nenhum livro cadastrado.</p>";
        return;
    }

    colecao.forEach(livro => {
        const divLivro = document.createElement("div");
        divLivro.style.cssText = "border: 1px solid #ccc; padding: 10px; margin-bottom: 8px;";

        divLivro.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Gênero:</strong> ${livro.genero}</p>
            <p><strong>Páginas:</strong> ${livro.paginas}</p>
            <p><strong>Status:</strong> ${livro.lido ? "Lido" : "Não Lido"}</p>
            <button type="button" onclick="mudarStatus(${livro.id})">Marcar como ${livro.lido ? "Não Lido" : "Lido"}</button>
            <button type="button" onclick="deletarLivro(${livro.id})">Excluir</button>
        `;
        sectionListaLivros.appendChild(divLivro);
    });
}

// 8. Atualizar as estatísticas
function atualizarEstatisticas(colecao) {
    const stats = estatistics(colecao);
    sectionEstatisticas.innerHTML = `
        <h2>Estatísticas</h2>
        <p>Total de Livros: ${stats.totalLivros}</p>
        <p>Livros Lidos: ${stats.livrosLidos}</p>
        <p>Livros Não Lidos: ${stats.livrosNaoLidos}</p>
        <p>Total de Páginas: ${stats.totalPaginas}</p>
    `;
}

// 2, 3, 4, 5. Registrar formulário, criar objeto, adicionar, salvar e atualizar
formLivro.addEventListener("submit", (event) => {
    event.preventDefault();

    const novoLivro = {
        id: Date.now(),
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        genero: document.getElementById("genero").value,
        paginas: Number(document.getElementById("paginas").value),
        lido: false
    };

    livros = add(livros, novoLivro);
    salvarLivros(livros);
    atualizarTela(livros);
    
    formLivro.reset();
});

// 7. Pesquisar livros por título no input
inputPesquisa.addEventListener("input", (event) => {
    const termo = event.target.value;
    const livrosFiltrados = listLivroByTitulo(livros, termo);
    renderizarLivros(livrosFiltrados);
});

// Funções globais auxiliares para os botões da listagem
window.mudarStatus = function(id) {
    livros = marcarComoLido(livros, id);
    salvarLivros(livros);
    atualizarTela(livros);
};

window.deletarLivro = function(id) {
    livros = remove(livros, id);
    salvarLivros(livros);
    atualizarTela(livros);
};

// Executa a primeira renderização ao carregar a página
atualizarTela(livros);