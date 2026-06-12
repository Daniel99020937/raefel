import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("raefel_cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;

    try {
      localStorage.setItem("raefel_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [cart, cartLoaded]);

  async function ajustarEstoque(productId, quantidade) {
    const { data } = await api.patch(`/produtos/${productId}/estoque`, {
      quantidade,
    });

    return data.produto || data;
  }

  async function addToCart(produto) {
    try {
      const produtoAtualizado = await ajustarEstoque(produto._id, -1);

      setCart((currentCart) => {
        const exists = currentCart.find((item) => item._id === produto._id);

        if (exists) {
          return currentCart.map((item) =>
            item._id === produto._id
              ? {
                  ...item,
                  qtd: item.qtd + 1,
                  estoque: produtoAtualizado.estoque,
                }
              : item
          );
        }

        return [
          ...currentCart,
          {
            ...produto,
            estoque: produtoAtualizado.estoque,
            qtd: 1,
          },
        ];
      });

      return produtoAtualizado;
    } catch (error) {
      console.error("Erro ao adicionar:", error.response?.data || error);

      if (error.response?.status === 400) {
        alert("Produto sem estoque disponível.");
        return null;
      }

      alert("Erro ao adicionar produto.");
      return null;
    }
  }

  async function increaseQuantity(productId) {
    try {
      const produtoAtualizado = await ajustarEstoque(productId, -1);

      setCart((currentCart) =>
        currentCart.map((item) =>
          item._id === productId
            ? {
                ...item,
                qtd: item.qtd + 1,
                estoque: produtoAtualizado.estoque,
              }
            : item
        )
      );

      return produtoAtualizado;
    } catch (error) {
      console.error("Erro ao aumentar:", error.response?.data || error);
      alert(error.response?.data?.message || "Estoque insuficiente.");
      return null;
    }
  }

  async function decreaseQuantity(productId) {
    const item = cart.find((item) => item._id === productId);

    if (!item) return null;

    try {
      const produtoAtualizado = await ajustarEstoque(productId, 1);

      setCart((currentCart) =>
        currentCart
          .map((item) =>
            item._id === productId
              ? {
                  ...item,
                  qtd: item.qtd - 1,
                  estoque: produtoAtualizado.estoque,
                }
              : item
          )
          .filter((item) => item.qtd > 0)
      );

      return produtoAtualizado;
    } catch (error) {
      console.error("Erro ao diminuir:", error.response?.data || error);
      alert("Erro ao diminuir quantidade.");
      return null;
    }
  }

  async function removeFromCart(productId) {
    const item = cart.find((item) => item._id === productId);

    if (!item) return null;

    try {
      const produtoAtualizado = await ajustarEstoque(productId, item.qtd);

      setCart((currentCart) =>
        currentCart.filter((item) => item._id !== productId)
      );

      return produtoAtualizado;
    } catch (error) {
      console.error("Erro ao remover:", error.response?.data || error);
      alert("Erro ao remover produto do carrinho.");
      return null;
    }
  }

  async function clearCart() {
    try {
      for (const item of cart) {
        await ajustarEstoque(item._id, item.qtd);
      }

      setCart([]);
      localStorage.removeItem("raefel_cart");
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error.response?.data || error);
      alert("Erro ao limpar carrinho.");
    }
  }

  function finishOrder() {
    setCart([]);
    localStorage.removeItem("raefel_cart");
    alert("Pedido finalizado com sucesso!");
  }

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.preco || 0) * Number(item.qtd || 0),
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.qtd || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        totalItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        finishOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}