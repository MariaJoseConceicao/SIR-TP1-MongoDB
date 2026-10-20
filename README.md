# SIR-TP1-MongoDB

Aplicação web para gerir **alunos** e **cursos**, com uma API REST em Node.js/Express ligada a uma base de dados MongoDB Atlas. Permite criar, listar, editar e apagar alunos, e criar cursos com o respetivo coordenador, através de uma interface com janelas modais.

## Tecnologias

- **Node.js** e **Express**: servidor e API REST
- **MongoDB Atlas** com **Mongoose**: base de dados e modelos
- **dotenv**: variáveis de ambiente
- **HTML, CSS e JavaScript** (sem frameworks): interface no browser

## Funcionalidades

- Listar alunos numa tabela, com o nome do curso associado
- Criar alunos através de um modal
- Editar alunos (o botão **Editar** abre o modal já preenchido)
- Apagar alunos, com confirmação
- Criar cursos (nome e coordenador) através de um modal
- Impedir que se apague um curso que ainda tem alunos associados

## Estrutura do projeto

```
SIR-TP1-MongoDB/
├── public/
│   ├── index.html     # Página principal e modais
│   ├── script.js      # Lógica do front-end (pedidos à API, modais)
│   └── style.css      # Estilos
├── server.js          # Servidor Express, modelos e rotas
├── package.json
├── .env               # Variáveis de ambiente (não vai para o Git)
└── .gitignore
```

## Modelo de dados

Base de dados: `School`

**Coleção `cursos`**

| Campo         | Tipo   | Descrição                  |
| ------------- | ------ | -------------------------- |
| `_id`         | String | Identificador do curso     |
| `nomeDoCurso` | String | Nome do curso              |
| `coordenador` | String | Nome do coordenador        |

**Coleção `alunos`**

| Campo           | Tipo   | Descrição                              |
| --------------- | ------ | -------------------------------------- |
| `_id`           | String | Identificador do aluno                 |
| `nome`          | String | Nome do aluno                          |
| `apelido`       | String | Apelido do aluno                       |
| `idCurso`       | String | `_id` do curso a que o aluno pertence  |
| `anoCurricular` | Number | Ano curricular                         |

## API

| Método   | Rota           | Descrição                                      |
| -------- | -------------- | ---------------------------------------------- |
| `GET`    | `/cursos`      | Lista todos os cursos                          |
| `POST`   | `/cursos`      | Cria um curso                                  |
| `PUT`    | `/cursos/:id`  | Atualiza um curso                              |
| `DELETE` | `/cursos/:id`  | Apaga um curso (se não tiver alunos)           |
| `GET`    | `/alunos`      | Lista todos os alunos                          |
| `POST`   | `/alunos`      | Cria um aluno                                  |
| `PUT`    | `/alunos/:id`  | Atualiza um aluno                              |
| `DELETE` | `/alunos/:id`  | Apaga um aluno                                 |
