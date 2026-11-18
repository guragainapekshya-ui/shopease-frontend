
const API_URL = "http://127.0.0.1:8000/api/cart";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

async function cartRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || JSON.stringify(data)
    );
  }

  return data;
}

export const getCart = () =>
  cartRequest("/cart-read/");

export const addCartItem = (productId, quantity) =>
  cartRequest("/cart-create/", {
    method: "POST",
    body: JSON.stringify({
      product: productId,
      quantity,
    }),
  });

export const updateCartItem = (cartItemId, quantity) =>
  cartRequest(`/cart-update/${cartItemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const deleteCartItem = (cartItemId) =>
  cartRequest(`/cart-delete/${cartItemId}/`, {
    method: "DELETE",
  });
