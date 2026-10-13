require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API a funcionar"
  });
});

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