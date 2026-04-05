export const normalizeProduct = (p = {}) => ({
  ...p,
  id: p.productId ?? p.id ?? null,
  productId: p.productId ?? p.id ?? null,
});