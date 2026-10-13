let alunoEmEdicao = null;

async function getAlunos() {
    const response = await fetch("/alunos");

    if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
    }

    return response.json();
}

async function getCursos() {
    const response = await fetch("/cursos");

    if (!response.ok) {
        throw new Error("Erro ao carregar cursos");
    }

    return response.json();
}

async function carregarCursos() {
    try {
        const cursos = await getCursos();
        const selectCurso = document.getElementById("idCurso");

        selectCurso.innerHTML = "";

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Seleciona um curso";
        selectCurso.appendChild(opcaoInicial);

        cursos.forEach((curso) => {
            const option = document.createElement("option");

            option.value = curso._id;
            option.textContent = curso.nomeDoCurso;

            selectCurso.appendChild(option);
        });
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os cursos.");
    }
}

async function addAluno() {
    const alunos = await getAlunos();

    const idsNumericos = alunos
        .map((aluno) => Number(aluno._id))
        .filter((id) => Number.isInteger(id));

    const proximoId =
        idsNumericos.length > 0
            ? Math.max(...idsNumericos) + 1
            : 1;

    const aluno = {
        _id: String(proximoId),
        nome: document.getElementById("nome").value,
        apelido: document.getElementById("apelido").value,
        idCurso: document.getElementById("idCurso").value,
        anoCurricular: Number(
            document.getElementById("anoCurricular").value
        )
    };

    const response = await fetch("/alunos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(aluno)
    });

    if (!response.ok) {
        throw new Error("Erro ao criar aluno");
    }

    document.getElementById("formCriar").reset();

    await mostraAlunos();
}

async function updateAluno(id) {
    const aluno = {
        nome: document.getElementById("nome").value,
        apelido: document.getElementById("apelido").value,
        idCurso: document.getElementById("idCurso").value,
        anoCurricular: Number(
            document.getElementById("anoCurricular").value
        )
    };

    const response = await fetch(`/alunos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(aluno)
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar aluno");
    }

    alunoEmEdicao = null;

    document.getElementById("formCriar").reset();
    document.getElementById("btcriar").textContent = "Criar Aluno";
    document.getElementById("btCancelarEdicao").style.display = "none";

    await mostraAlunos();
}

async function deleteAluno(id) {
    const confirmar = confirm("Tens a certeza que queres apagar este aluno?");

    if (!confirmar) {
        return;
    }

    const response = await fetch(`/alunos/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao apagar aluno");
    }

    await mostraAlunos();
}

function editarAluno(aluno) {
    alunoEmEdicao = aluno._id;

    document.getElementById("nome").value = aluno.nome;
    document.getElementById("apelido").value = aluno.apelido;
    document.getElementById("idCurso").value = aluno.idCurso;
    document.getElementById("anoCurricular").value = aluno.anoCurricular;

    document.getElementById("btcriar").textContent = "Atualizar Aluno";
    document.getElementById("btCancelarEdicao").style.display = "inline";
}

function cancelarEdicao() {
    alunoEmEdicao = null;

    document.getElementById("formCriar").reset();
    document.getElementById("btcriar").textContent = "Criar Aluno";
    document.getElementById("btCancelarEdicao").style.display = "none";
}

async function mostraAlunos() {
    try {
        const alunos = await getAlunos();
        const cursos = await getCursos();

        const tabelaAlunos = document.getElementById("alunos");
        tabelaAlunos.innerHTML = "";

        alunos.forEach((aluno) => {
            const trAluno = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = aluno.nome;

            const tdApelido = document.createElement("td");
            tdApelido.textContent = aluno.apelido;

            const tdCurso = document.createElement("td");

            const curso = cursos.find(
                (curso) => String(curso._id) === String(aluno.idCurso)
            );

            tdCurso.textContent = curso
                ? curso.nomeDoCurso
                : "Curso desconhecido";

            const tdAno = document.createElement("td");
            tdAno.textContent = aluno.anoCurricular;

            const tdAcoes = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => {
                editarAluno(aluno);
            });

            const btnApagar = document.createElement("button");
            btnApagar.textContent = "Apagar";
            btnApagar.addEventListener("click", () => {
                deleteAluno(aluno._id);
            });

            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnApagar);

            trAluno.appendChild(tdNome);
            trAluno.appendChild(tdApelido);
            trAluno.appendChild(tdCurso);
            trAluno.appendChild(tdAno);
            trAluno.appendChild(tdAcoes);

            tabelaAlunos.appendChild(trAluno);
        });
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os alunos.");
    }
}

document.getElementById("btcriar").addEventListener("click", async () => {
    try {
        if (alunoEmEdicao === null) {
            await addAluno();
        } else {
            await updateAluno(alunoEmEdicao);
        }
    } catch (erro) {
        console.error(erro);
        alert("Ocorreu um erro ao guardar o aluno.");
    }
});

document
    .getElementById("btCancelarEdicao")
    .addEventListener("click", cancelarEdicao);

carregarCursos();
mostraAlunos();