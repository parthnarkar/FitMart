export const normalizeProduct = (p = {}) => {
  const id = p.productId ?? p.id;

  return {
    ...p,
    id,
    productId: id,
  };
};