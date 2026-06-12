import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

export default function Carrinho() {
  const router = useRouter();

  const {
    cart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    finishOrder,
  } = useCart();

  const frete = 0;

  function handleCheckout() {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    finishOrder();
    router.push("/");
  }

  return (
    <div>
      <Navbar />

      <main style={styles.container}>
        <h1 style={styles.title}>Carrinho</h1>

        {cart.length === 0 && (
          <div style={styles.empty}>
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione produtos para continuar sua compra.</p>

            <Link href="/" style={styles.continue}>
              Ver produtos
            </Link>
          </div>
        )}

        {cart.length > 0 && (
          <div style={styles.layout}>
            <section style={styles.list}>
              {cart.map((item) => (
                <div key={item._id} style={styles.item}>
                  <img
                    src={item.imagem || "https://via.placeholder.com/120"}
                    alt={item.nome}
                    style={styles.image}
                  />

                  <div style={styles.info}>
                    <span style={styles.category}>
                      {item.categoria || "Geral"}
                    </span>

                    <h3 style={styles.name}>{item.nome}</h3>

                    <p style={styles.pix}>
                      Pix: R$ {(Number(item.preco || 0) * 0.95).toFixed(2)}
                    </p>
                  </div>

                  <div style={styles.quantity}>
                    <button
                      style={styles.qtyButton}
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      -
                    </button>

                    <strong>{item.qtd}</strong>

                    <button
                      style={styles.qtyButton}
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <strong style={styles.subtotal}>
                    R$ {(Number(item.preco || 0) * item.qtd).toFixed(2)}
                  </strong>

                  <button
                    style={styles.remove}
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </section>

            <aside style={styles.summary}>
              <h2>Resumo do Pedido</h2>

              <div style={styles.row}>
                <span>Subtotal</span>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>

              <div style={styles.row}>
                <span>Frete</span>
                <strong style={styles.free}>Grátis</strong>
              </div>

              <hr style={styles.hr} />

              <div style={styles.totalRow}>
                <span>Total</span>
                <strong>R$ {(total + frete).toFixed(2)}</strong>
              </div>

              <button style={styles.finish} onClick={handleCheckout}>
                Finalizar compra
              </button>

              <button style={styles.clear} onClick={clearCart}>
                Limpar carrinho
              </button>

              <p style={styles.note}>
                Checkout real será uma melhoria futura. Para o MVP, o carrinho
                já calcula o pedido.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 20px 50px",
  },

  title: {
    color: "#352255",
    fontSize: 38,
    marginBottom: 20,
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 24,
    alignItems: "start",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  item: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 120px 120px 100px",
    gap: 14,
    alignItems: "center",
    background: "#fff",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 8px 25px rgba(0,0,0,.06)",
  },

  image: {
    width: 80,
    height: 80,
    objectFit: "contain",
    background: "#f7f7f7",
    borderRadius: 12,
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  category: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "bold",
  },

  name: {
    color: "#352255",
    margin: "4px 0",
  },

  pix: {
    color: "#16a34a",
    fontWeight: "bold",
    margin: 0,
  },

  quantity: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },

  subtotal: {
    color: "#352255",
  },

  remove: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "9px 10px",
    borderRadius: 10,
    cursor: "pointer",
  },

  summary: {
    background: "#fff",
    borderRadius: 20,
    padding: 22,
    boxShadow: "0 8px 25px rgba(0,0,0,.08)",
    position: "sticky",
    top: 20,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "14px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 22,
    color: "#352255",
    margin: "18px 0",
  },

  free: {
    color: "#16a34a",
  },

  hr: {
    border: 0,
    borderTop: "1px solid #eee",
  },

  finish: {
    width: "100%",
    border: 0,
    borderRadius: 999,
    padding: "15px",
    cursor: "pointer",
    background: "#ffcb39",
    color: "#352255",
    fontWeight: "bold",
    fontSize: 16,
  },

  clear: {
    width: "100%",
    marginTop: 10,
    border: "1px solid #ddd",
    borderRadius: 999,
    padding: "13px",
    cursor: "pointer",
    background: "#fff",
  },

  note: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 14,
  },

  empty: {
    background: "#fff",
    borderRadius: 20,
    padding: 32,
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,.06)",
  },

  continue: {
    display: "inline-block",
    marginTop: 12,
    background: "#ffcb39",
    color: "#352255",
    padding: "12px 22px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: "bold",
  },
};