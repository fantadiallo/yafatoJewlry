export function addToFavorites(item) {
  const storedFavs = JSON.parse(localStorage.getItem('favorites')) || [];

  const exists = storedFavs.some((fav) => fav.id === item.id);
  if (!exists) {
    const cleanedItem = {
      id: item.id, // product ID or handle
      variantId: item.variantId, // MUST be the full Shopify variant ID
      title: item.title,
      image: item.image,
      price: item.price,
    };

    storedFavs.push(cleanedItem);
    localStorage.setItem('favorites', JSON.stringify(storedFavs));
  }
}

export function removeFromFavorites(id) {
  const storedFavs = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = storedFavs.filter((item) => item.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updated));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}
