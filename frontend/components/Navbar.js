import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <>
      <div style={styles.topBar}>
       ⚡ 5% OFF no Pix
      </div>

      <header style={styles.header}>
        <Link href="/" style={styles.logo}>
          Ra&FeL
        </Link>

        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>
            Início
          </Link>

          <Link href="/carrinho" style={styles.cart}>
            🛒 Carrinho ({totalItems})
          </Link>

          <Link href="/admin" style={styles.link}>
            Admin
          </Link>
        </nav>
      </header>
    </>
  );
}

const styles = {
  topBar: {
    background: "#ffcb39",
    color: "#352255",
    textAlign: "center",
    padding: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  header: {
    background: "#352255",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 32px",
    marginBottom: 24,
  },

logo: {
  color: "#ffcb39",
  fontSize: "clamp(28px, 4vw, 38px)",
  fontWeight: "800",
  textDecoration: "none",
  letterSpacing: "1px",
},
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
  },

  cart: {
    background: "#ffcb39",
    color: "#352255",
    padding: "10px 16px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: "bold",
  },
};