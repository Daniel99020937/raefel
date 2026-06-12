import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ produto }) {
  const { addToCart } = useCart();

  const [estoqueAtual, setEstoqueAtual] = useState(produto.estoque ?? 0);

  async function handleAddToCart() {
    const produtoAtualizado = await addToCart({
      ...produto,
      estoque: estoqueAtual,
    });

    if (produtoAtualizado) {
      setEstoqueAtual(produtoAtualizado.estoque);
    }
  }

  const preco = Number(produto.preco || 0);
  const semEstoque = estoqueAtual <= 0;

  return (
    <div style={styles.card}>
      <Link href={`/produto/${produto._id}`}>
        <img
          src={produto.imagem || "https://via.placeholder.com/300"}
          alt={produto.nome}
          style={styles.image}
        />
      </Link>

      <p style={styles.category}>{produto.categoria || "Geral"}</p>

      <span style={styles.badge}>5% OFF PIX</span>

      <h3 style={styles.title}>{produto.nome}</h3>

      <strong style={styles.price}>R$ {preco.toFixed(2)}</strong>

      <p style={styles.pixPrice}>
        Pix: R$ {(preco * 0.95).toFixed(2)}
      </p>

      <p style={styles.installments}>
        4x de R$ {(preco / 4).toFixed(2)}
      </p>

      <p
        style={{
          ...styles.stock,
          color: semEstoque ? "#dc2626" : "#16a34a",
        }}
      >
        {semEstoque ? "Produto esgotado" : `Estoque: ${estoqueAtual}`}
      </p>

      <div style={styles.actions}>
        <Link href={`/produto/${produto._id}`} style={styles.link}>
          Ver produto
        </Link>

        <button
          style={{
            ...styles.button,
            opacity: semEstoque ? 0.5 : 1,
            cursor: semEstoque ? "not-allowed" : "pointer",
          }}
          disabled={semEstoque}
          onClick={handleAddToCart}
        >
          {semEstoque ? "Esgotado" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e5e5",
    borderRadius: 18,
    padding: 16,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 8px 25px rgba(0,0,0,.06)",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "contain",
    background: "#f7f7f7",
    borderRadius: 12,
  },
  category: {
    color: "#666",
    fontSize: 13,
    margin: 0,
  },
  badge: {
    background: "#16a34a",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
    width: "fit-content",
  },
  title: {
    margin: 0,
    minHeight: 48,
    color: "#352255",
  },
  price: {
    fontSize: 18,
    color: "#352255",
  },
  pixPrice: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 14,
    margin: 0,
  },
  installments: {
    color: "#666",
    fontSize: 13,
    margin: 0,
  },
  stock: {
    fontWeight: "bold",
    fontSize: 14,
    margin: "4px 0",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: "auto",
  },
  link: {
    color: "#352255",
    fontWeight: "bold",
  },
  button: {
    border: 0,
    borderRadius: 999,
    padding: "10px 14px",
    background: "#ffcb39",
    color: "#352255",
    fontWeight: "bold",
  },
};