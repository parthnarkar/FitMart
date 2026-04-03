export const normalizeProduct = (product) => {
  return {
    id: product.productId || product._id || product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    brand: product.brand,
    category: product.category,
    stock: product.stock,
  };
};
