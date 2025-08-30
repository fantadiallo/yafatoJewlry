
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProductById } from "../../api/shopify";


export default function ProductDetailsPage() {
  const { id } = useParams(); // /products/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchSingleProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading product...</p>;
  }

  if (!product) {
    return <p className="error">Product not found.</p>;
  }

  return (
    <main className="productDetails">
      <div className="detailsWrapper">
        {/* Product Images */}
        <div className="imageGallery">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={product.title} />
          ))}
        </div>

        {/* Product Info */}
        <div className="info">
          <h1>{product.title}</h1>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>

          <button
            className="addToCartBtn"
            onClick={() => console.log("Add to cart:", product.variantId)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
