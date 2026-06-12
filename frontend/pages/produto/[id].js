import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";

export default function Produto() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) carregarProduto();
  }, [id]);

  async function carregarProduto() {
    try {
      setLoading(true);
      const { data } = await api.get(`/produtos/${id}`);
      setProduto(data);
      setErro("");
    } catch (error) {
      setErro("Produto não encontrado ou backend indisponível.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={styles.container}>Carregando...</main>
      </>
    );
  }

  if (erro || !produto) {
    return (
      <>
        <Navbar />
        <main style={styles.container}>
          <p style={styles.error}>{erro || "Produto não encontrado."}</p>
          <Link href="/">Voltar</Link>
        </main>
      </>
    );
  }

  const preco = Number(produto.preco || 0);

  return (
    <>
      <Navbar />

      <main style={styles.container}>
        <Link href="/" style={styles.back}>← Voltar para produtos</Link>

        <section style={styles.product}>
          <div style={styles.imageBox}>
            <img
              src={produto.imagem || "https://via.placeholder.com/500"}
              alt={produto.nome}
              style={styles.image}
            />
          </div>

          <div style={styles.info}>
            <span style={styles.category}>{produto.categoria || "Geral"}</span>
            <span style={styles.badge}>5% OFF PIX</span>

            <h1 style={styles.title}>{produto.nome}</h1>

            <p style={styles.description}>
              {produto.descricao || "Produto disponível para compra."}
            </p>

            <h2 style={styles.price}>R$ {preco.toFixed(2)}</h2>

            <p style={styles.pix}>
              Pix: R$ {(preco * 0.95).toFixed(2)}
            </p>

            <p style={styles.parcelado}>
              4x de R$ {(preco / 4).toFixed(2)} sem juros
            </p>

           <p
  style={{
    ...styles.stock,
    color: produto.estoque > 0 ? "#16a34a" : "#dc2626",
  }}
>
  Estoque disponível: {produto.estoque ?? 0}
</p>
<button
  style={{
    ...styles.button,
    opacity: produto.estoque <= 0 ? 0.5 : 1,
  }}
  disabled={produto.estoque <= 0}
  onClick={async () => {
    try {
      const produtoAtualizado = await addToCart(produto);

      if (produtoAtualizado) {
        setProduto((current) => ({
          ...current,
          estoque: produtoAtualizado.estoque,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }}
>
  {produto.estoque <= 0
    ? "Produto esgotado"
    : "🛒 Adicionar ao carrinho"}
</button>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 20px 50px",
  },
  back: {
    display: "inline-block",
    marginBottom: 24,
    color: "#352255",
    fontWeight: "bold",
  },
  product: {
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: 36,
    background: "#fff",
    padding: 28,
    borderRadius: 24,
    boxShadow: "0 12px 35px rgba(0,0,0,.08)",
  },
  imageBox: {
    background: "#f7f7f7",
    borderRadius: 18,
    padding: 20,
  },
  image: {
    width: "100%",
    maxHeight: 520,
    objectFit: "contain",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  category: {
    color: "#6b7280",
    fontWeight: "bold",
  },
  badge: {
    background: "#16a34a",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
    width: "fit-content",
  },
  title: {
    fontSize: 38,
    color: "#352255",
    margin: "6px 0",
  },
  description: {
    color: "#555",
    lineHeight: 1.5,
  },
  price: {
    color: "#352255",
    fontSize: 34,
    margin: "10px 0 0",
  },
  pix: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 18,
  },
  parcelado: {
    color: "#666",
  },
  stock: {
    color: "#444",
    fontWeight: "bold",
  },
  button: {
  marginTop: 16,
  border: 0,
  borderRadius: 999,
  padding: "16px 22px",
  cursor: "pointer",
  background: "#ffcb39",
  color: "#352255",
  fontSize: 16,
  fontWeight: "bold",
},
  error: {
    color: "#b00020",
  },
};