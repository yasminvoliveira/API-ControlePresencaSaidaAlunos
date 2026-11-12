//trazer a lista

//saber qual é o ultimo ID cadastrado

//somar + 1 para ser o proximo ID

//return

import { listarTodos } from "../MANIPULADOR/manipulador_arquivo.js";


export async function gerarNovoId(){
    const registrosAlunos = await listarTodos();

    //pegar todos os IDs existentes
    const ids = registrosAlunos.map((aluno) => aluno.id);

    //Retorna o maior ID encontrado
    const novoID = Math.max(...ids) +1;
    return novoID

}

