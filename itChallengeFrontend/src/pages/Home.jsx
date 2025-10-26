import React from 'react';

export default function Home() {
  // This will later fetch real products from the backend.
  return (
    <section className="container home">
      <h2>Welcome to the shop</h2>
      <p>Use the product list below to add items to your cart.</p>

      <div className="product-grid">
        <div className="card">
          <img src="https://via.placeholder.com/300x200" alt="Sample product"/>
          <h3>Sample product</h3>
          <p>$9.99</p>
          <button>Add to cart</button>
        </div>
        {/* add more cards or map data here later */}
      </div>
    </section>
  );
}

//make me a full functional home page for an e-commerce site
//with a product grid showing sample products with images, names, prices, and add to cart buttons.

