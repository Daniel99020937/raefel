require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const produtos = [
  {
    nome: "Mouse Gamer RGB",
    descricao: "Mouse gamer com iluminação RGB e alta precisão.",
    preco: 89.9,
    imagem: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    categoria: "Informática",
    estoque: 12,
  },
  {
    nome: "Teclado Mecânico",
    descricao: "Teclado mecânico compacto para jogos e trabalho.",
    preco: 159.9,
    imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    categoria: "Informática",
    estoque: 8,
  },
  {
    nome: "Smartwatch Fitness",
    descricao: "Relógio inteligente com monitoramento de atividades.",
    preco: 129.9,
    imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    categoria: "Eletrônicos",
    estoque: 15,
  },
  {
    nome: "Fone Bluetooth",
    descricao: "Fone sem fio com estojo carregador.",
    preco: 99.9,
    imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    categoria: "Eletrônicos",
    estoque: 20,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(produtos);
    console.log("Produtos iniciais cadastrados com sucesso.");
  } catch (error) {
    console.error("Erro no seed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
