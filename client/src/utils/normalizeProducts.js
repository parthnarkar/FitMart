export const normalizeProduct = (p) => {
  if (!p) return p;

  return {
    ...p,
    id: p.productId ?? p.id,
    productId: p.productId ?? p.id,
  };
};
