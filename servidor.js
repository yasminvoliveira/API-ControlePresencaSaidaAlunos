// Construindo o servidor

//#region IMPORTS

import express from "express";
import { listarTodos, salvarTodos } from "./MANIPULADOR/manipulador_arquivo.js"
import { gerarNovoId } from "./FUNCOES/funcoes.js";

const app = express(); //Express
const PORT = 3000;
app.use(express.json());
//#endregion

//LÓGICA
//GET - iniciando
app.get("/", (req, res) => {
    res.send("Bem-Vindo à API do Sistema de Controle");
})

//GET / alunos
app.get("/alunos", async (req, res) => {
    try {
        const registros = await listarTodos();
        return res.status(200).json(registros);
    }
    catch (error) {
        console.log("Erro ao listar registros", error)
        return res.status(500).json({ error: "Não foi possível ler os registros" });
    }
});

//GET /alunos/:id

app.get("/alunos/:id", async (req, res) => {
    try {
        //Recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //Leio os registros cadastrados
        const registros = await listarTodos();

        const idprocurado = registros.find((registro) =>
            registro.id === id);

        if (!idprocurado) {
            return res.status(404).json({ erro: "O registro não foi encontrado" });

        }

        return res.status(200).json(idprocurado);
    }
    catch (error) {
        console.log("Erro ao procurar o registro", error);
        return res.status(500).json({ error: "Registro não encontrado" });
    }
});

//POST /alunos
app.post("/alunosPost", async (req, res) => {
    try {
        //dados do novo registro

        const {
            //o que vou precisar
            matricula,
            nome,
            turma,
            data,
            presente,
            motivoSaida,
            minutosFora,

        } = req.body;


        //vendo se estão todos preenchidos
        if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            //return
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        const id = await gerarNovoId();

        //criando o objeto com os dados do novo registro
        const novoRegistro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: false
        }

        //listando todos
        const registros = await listarTodos();
        //Adicionando o novo registro - push
        registros.push(novoRegistro);
        //salvando...
        await salvarTodos(registros);

        return res.status(201).json({ mensagem: "Novo registro realizado com sucesso" })
    }
    catch (error) {
        console.log("Erro ao salvar registro", error);
        return res.status(500).json
            ({ error: "Não foi possível salvar o registro" });
    }
})

//PUT
app.put("/alunos/:id", async (req, res) => {
    try {
        //Recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //Lê os dados cadastrados
        const registros = await listarTodos();

        const idprocurado = registros.find((registro) => registro.id === id);
        // verificar se encontrou registro

        if (!idprocurado) {
            return res.status(404).json({ erro: "Registro não encontrado" });
        }

        const {
            //o que vou precisar
            matricula,
            nome,
            turma,
            data,
            presente,
            motivoSaida,
            minutosFora,

        } = req.body;


        //vendo se estão todos preenchidos
        if (!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            //return
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        //criando o objeto com os dados do novo registro
        const novoRegistro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: false
        }
        const registrosAtualizados = registros.map((registro) =>  //ele vai aplicar a logica abaixo para todos os registors dentro de registro
            {
                if(registro.id === id){
                    return novoRegistro; //troca o elemento pelo elemento atualizado
                }
                else{
                    return registro // mantém o elemento original
                }
            });

        //salvar a lista nova
        await salvarTodos(registrosAtualizados);

        //Mensagem de resposta
        return res.status(200).json({ mensagem: "Registro atualizado com sucesso" })
    }
    catch (error) {
        console.log("Erro ao alterar o registro", error);
        return res.status(500).json
            ({ error: "Não foi possível alterar o registro" });


    }
})

 //DELETE/alunos/:id
    app.delete("/alunos/:id", async (req, res) => {
    try {
        //Recuperar ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //Leio os dados cadastrados
        const registros = await listarTodos();

        //Mantém apenas os itens com id diferente
        const registrosAtualizados = registros.filter((registro) =>
            registro.id !== id);

        //veificar se deletou
        if (registrosAtualizados.length === registros.length) {
            return res.status(404).json({ erro: "Registro não deletado" });

        }
        await salvarTodos(registrosAtualizados);
        return res.status(200).json({ mensagem: "Registro excluído com sucesso" });
    }


    catch (error) {
        console.log("Erro ao deletar registro", error);
        return res.status(500).json({ error: "Registro não deletado" });
    }
});


//Funções auxiliares 
app.listen(PORT, () => {
    console.log("Está rodando na porta:", PORT);
});
