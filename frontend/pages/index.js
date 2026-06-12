import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setLoading(true);
      const { data } = await api.get("/produtos");
      setProdutos(data);
      setErro("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os produtos. Verifique se o backend está rodando na porta 5000.");
    } finally {
      setLoading(false);
    }
  }

  
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const produtosFiltrados = produtos.filter((produto) => {
  const nomeProduto = normalizar(produto.nome || "");
  const buscaDigitada = normalizar(busca || "");

  const buscaOk = nomeProduto.includes(buscaDigitada);

  const categoriaOk =
    categoria === "Todos" || produto.categoria === categoria;

  return buscaOk && categoriaOk;
});

  return (
    <div>
      <Navbar />
      <main style={styles.container}>
        <section className="hero">
  <div>
    <p className="hero-label">Ofertas e produtos variados</p>

    <h1>
      Compre de forma simples, rápida e segura
    </h1>

    <p>
      Produtos selecionados com qualidade, entrega rápida e preços competitivos.
    </p>

    <div className="hero-actions">
      <a href="#produtos">Ver produtos</a>
      <a href="/admin" className="secondary">Admin</a>
    </div>
  </div>
</section>
<div className="categorias">
<div className="container-categorias">
  <button onClick={() => { setCategoria("Eletrônicos"); setBusca(""); }}>
    Eletrônicos
  </button>

  <button onClick={() => { setCategoria("Papelaria"); setBusca(""); }}>
    Papelaria
  </button>

  <button onClick={() => { setCategoria("Utilidades"); setBusca(""); }}>
    Utilidades
  </button>

  <button onClick={() => { setCategoria("Ferramentas"); setBusca(""); }}>
    Ferramentas
  </button>

  <button onClick={() => { setCategoria("Todos"); setBusca(""); }}>
    Todos
  </button>

</div>
<div className="info-strip">
  <div>🚚 Entrega rápida</div>
  <div>💳 Até 4x sem juros</div>
  <div>🔒 Compra segura</div>
  <div>⭐ Produtos selecionados</div>
</div>
</div>
        <section style={styles.filters}>
          <input
            style={styles.input}
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="🔍 Buscar produtos, marcas e categorias..."
          />
        </section>
        {loading && <p>Carregando produtos...</p>}
        {erro && <p style={styles.error}>{erro}</p>}
        {!loading && !erro && produtosFiltrados.length === 0 && (
          <p>Nenhum produto encontrado.</p>
        )}
        <div className="section-title">
          <h2>Destaques da Semana</h2>
          <p>Produtos selecionados com ofertas especiais para você</p>
        </div>

       <section id="produtos" style={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto._id} produto={produto} />
          ))}
        </section>
      </main>
            <section style={{ textAlign: "center", padding: 20 }}>
        <div>
          <footer className="footer">
  <div className="footer-container">

    <div className="footer-column">
      <h3>Ra&FeL Store</h3>

      <p>
        Produtos selecionados com qualidade,
        segurança e os melhores preços.
      </p>
    </div>

    <div className="footer-column">
      <h4>Links</h4>

      <a href="/">Início</a>
      <a href="/carrinho">Carrinho</a>
      <a href="/admin">Admin</a>
    </div>

    <div className="footer-column">
      <h4>Contato</h4>

      <p>📍 Porto Velho - RO</p>
      <p>📞 (69) 99999-9999</p>
      <p>✉ contato@raefel.com</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 Ra&FeL Store - Todos os direitos reservados.
  </div>
</footer>
        </div>
      </section>  
    </div>
  );
}


const styles = {
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 20px 20px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },
  error: {
    color: "#b00020",
  },
};

