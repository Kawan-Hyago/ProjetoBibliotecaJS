// funcoes.js
const livros = [];

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
        livro.id === id ? { ...livro, lido: true } : livro
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

// Preenchendo a função remove que estava vazia
const remove = (livrosArray, id) => {
    return livrosArray.filter(livro => livro.id !== id);
}

// Exportação para ES Modules (navegador)
export {
    add,
    remove,
    get,
    listarNaoLidos,
    possuiLivrosNaoLidos,
    totalPaginas,
    listLivroByTitulo,
    listLivroByGenero,
    marcarComoLido,
    estatistics,
    todosForamLidos,
    salvarLivros,
    carregarLivros,
    totalLivros,
    livrosLidos,
    livrosNaoLidos
};

module.exports= {add

    , remove

    , get

    , listarNaoLidos

    , possuiLivrosNaoLidos

    , totalPaginas

    , listLivroByTitulo

    , listLivroByGenero

    , marcarComoLido

    , estatistics

    , todosForamLidos

    , salvarLivros

    , carregarLivros

    , totalLivros

    , livrosLidos

    , livrosNaoLidos

    , estatistics

}; 