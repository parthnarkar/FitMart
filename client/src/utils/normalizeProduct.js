export const normalizeProduct = (p) => {
  if (!p) return p;

  const resolvedId = p.productId ?? p.id;

  return {
    ...p,
    id: resolvedId,
    productId: resolvedId,
  };
};