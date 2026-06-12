import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const initialForm = {
  nome: "",
  descricao: "",
  preco: "",
  imagem: "",
  categoria: "Geral",
  estoque: "0",
};

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const { data } = await api.get("/produtos");
      setProdutos(data);
      setErro("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os produtos. Verifique backend e MongoDB.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function validar() {
    if (!form.nome.trim()) return "Informe o nome do produto.";
    if (!form.preco || Number(form.preco) <= 0) return "Informe um preço válido.";
    if (!form.imagem.trim()) return "Informe a URL da imagem.";
    return "";
  }

  async function salvar(event) {
    event.preventDefault();

    const validationError = validar();
    if (validationError) {
      setErro(validationError);
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      preco: Number(form.preco),
      imagem: form.imagem,
      categoria: form.categoria || "Geral",
      estoque: Number(form.estoque || 0),
    };

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/produtos/${editingId}`, payload);
      } else {
        await api.post("/produtos", payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setErro("");
      await carregarProdutos();
    } catch (error) {
      console.error(error);
      setErro("Erro ao salvar produto. Confira os campos e a API.");
    } finally {
      setLoading(false);
    }
  }

  function editar(produto) {
    setEditingId(produto._id);
    setForm({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco || "",
      imagem: produto.imagem || "",
      categoria: produto.categoria || "Geral",
      estoque: produto.estoque ?? "0",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(id) {
    const confirmed = confirm("Deseja excluir este produto?");
    if (!confirmed) return;

    try {
      await api.delete(`/produtos/${id}`);
      await carregarProdutos();
    } catch (error) {
      console.error(error);
      setErro("Erro ao excluir produto.");
    }
  }

  function cancelarEdicao() {
    setEditingId(null);
    setForm(initialForm);
    setErro("");
  }

  return (
    <div>
      <Navbar />

      <main style={styles.container}>
        <h1>Administração de Produtos</h1>
        <p>Use esta tela para cadastrar, editar e excluir produtos do catálogo.</p>

        {erro && <p style={styles.error}>{erro}</p>}

        <form onSubmit={salvar} style={styles.form}>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do produto" style={styles.input} />
          <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preço" type="number" step="0.01" style={styles.input} />
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoria" style={styles.input} />
          <input name="estoque" value={form.estoque} onChange={handleChange} placeholder="Estoque" type="number" style={styles.input} />
          <input name="imagem" value={form.imagem} onChange={handleChange} placeholder="URL da imagem" style={styles.inputFull} />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" style={styles.textarea} />

          <div style={styles.actions}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Salvando..." : editingId ? "Salvar edição" : "Cadastrar produto"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelarEdicao} style={styles.secondaryButton}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <h2>Produtos cadastrados</h2>

        <section style={styles.list}>
          {produtos.map((produto) => (
            <div key={produto._id} style={styles.card}>
              <img src={produto.imagem || "https://via.placeholder.com/120"} alt={produto.nome} style={styles.image} />

              <div style={styles.info}>
                <h3>{produto.nome}</h3>
                <p>{produto.categoria || "Geral"}</p>
                <strong>R$ {Number(produto.preco || 0).toFixed(2)}</strong>
                <p>Estoque: {produto.estoque ?? 0}</p>
              </div>

              <div style={styles.cardActions}>
                <button onClick={() => editar(produto)} style={styles.secondaryButton}>Editar</button>
                <button onClick={() => excluir(produto._id)} style={styles.dangerButton}>Excluir</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 20px 40px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  inputFull: {
    gridColumn: "1 / -1",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  textarea: {
    gridColumn: "1 / -1",
    minHeight: 90,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 8,
  },
  button: {
    border: 0,
    borderRadius: 8,
    padding: "12px 16px",
    cursor: "pointer",
    background: "#111",
    color: "#fff",
  },
  secondaryButton: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    background: "#fff",
  },
  dangerButton: {
    border: 0,
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    background: "#b00020",
    color: "#fff",
  },
  list: {
    display: "grid",
    gap: 12,
  },
  card: {
    display: "grid",
    gridTemplateColumns: "100px 1fr 180px",
    gap: 16,
    alignItems: "center",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
  },
  image: {
    width: 90,
    height: 90,
    objectFit: "contain",
    background: "#f7f7f7",
    borderRadius: 8,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  cardActions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },
  error: {
    color: "#b00020",
    fontWeight: "bold",
  },
};
