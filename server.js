require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*app.use(express.static(path.join(__dirname, "public")));*/


/* ---------- MODELOS ---------- */

// _id definido como String porque o script.js envia ids como "1", "2", ...
const cursoSchema = new mongoose.Schema({
  _id: { type: String },
  nomeDoCurso: { type: String, required: true },
  coordenador: { type: String, default: "" }
});

const alunoSchema = new mongoose.Schema({
  _id: { type: String },
  nome: { type: String, required: true },
  apelido: { type: String, required: true },
  idCurso: { type: String, required: true },
  anoCurricular: { type: Number, required: true }
});

// Terceiro argumento = nome exato da coleção no Atlas
const Curso = mongoose.model("Curso", cursoSchema, "cursos");
const Aluno = mongoose.model("Aluno", alunoSchema, "alunos");

/* ---------- ROTAS: CURSOS ---------- */

app.get("/cursos", async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.post("/cursos", async (req, res) => {
  try {
    const curso = await Curso.create(req.body);
    res.status(201).json(curso);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

app.put("/cursos/:id", async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado" });
    }

    res.json(curso);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

app.delete("/cursos/:id", async (req, res) => {
  try {
    // Não deixa apagar um curso que ainda tem alunos associados
    const alunosNoCurso = await Aluno.countDocuments({ idCurso: req.params.id });

    if (alunosNoCurso > 0) {
      return res
        .status(409)
        .json({ erro: "Este curso ainda tem alunos associados" });
    }

    const curso = await Curso.findByIdAndDelete(req.params.id);

    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado" });
    }

    res.json({ mensagem: "Curso apagado" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/* ---------- ROTAS: ALUNOS ---------- */

app.get("/alunos", async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.post("/alunos", async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.status(201).json(aluno);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

app.put("/alunos/:id", async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    res.json(aluno);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

app.delete("/alunos/:id", async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);

    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    res.json({ mensagem: "Aluno apagado" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

/* ---------- ARRANQUE ---------- */

async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas ligado com sucesso");

    app.listen(PORT, () => {
      console.log(`Servidor a funcionar em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao ligar ao MongoDB:", erro.message);
  }
}

iniciarServidor();