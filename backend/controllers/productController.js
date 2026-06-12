const Product = require("../models/Product");

exports.listar = async (req, res) => {
  try {
    const produtos = await Product.find().sort({ createdAt: -1 });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao listar produtos",
      error: err.message,
    });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await Product.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    res.json(produto);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar produto",
      error: err.message,
    });
  }
};

exports.criar = async (req, res) => {
  try {
    const produto = await Product.create(req.body);
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({
      message: "Erro ao criar produto",
      error: err.message,
    });
  }
};

exports.editar = async (req, res) => {
  try {
    const produto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    res.json(produto);
  } catch (err) {
    res.status(400).json({
      message: "Erro ao editar produto",
      error: err.message,
    });
  }
};

exports.excluir = async (req, res) => {
  try {
    const produto = await Product.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    res.json({
      success: true,
      message: "Produto removido",
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao excluir produto",
      error: err.message,
    });
  }
};

exports.ajustarEstoque = async (req, res) => {
  try {
    const { quantidade } = req.body;

    const produto = await Product.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    const estoqueAtual = Number(produto.estoque || 0);
    const novoEstoque = estoqueAtual + Number(quantidade);

    if (novoEstoque < 0) {
      return res.status(400).json({
        message: "Estoque insuficiente",
      });
    }

    produto.estoque = novoEstoque;

    await produto.save();

    res.json({
      message: "Estoque atualizado com sucesso",
      produto,
    });
  } catch (error) {
    console.error("Erro ao ajustar estoque:", error);

    res.status(500).json({
      message: "Erro ao ajustar estoque",
      error: error.message,
    });
  }
};