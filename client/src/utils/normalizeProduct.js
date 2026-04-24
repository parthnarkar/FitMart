export const normalizeProduct = (p) => {
  if (!p) return p;

  const normalizedId = Number(p.productId ?? p.id);

  return {
    ...p,
    id: normalizedId,
    productId: normalizedId,
    price: p.price != null ? Number(p.price) : p.price,
  };
};