import { useEffect, useState } from "react";
import Catalog from "../../features/catalog/catalog";
import { Product } from "../models/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => setProducts(data))
  }, [])
// put a [] as a dep in order to run this only once.

  function addProduct() {
    setProducts(prevState => [...prevState, {
      id: prevState.length + 101,
      name: 'product' + (prevState.length + 1), 
      price: (prevState.length * 100),
      brand: 'some brand',
      description: 'some desc',
      pictureUrl: 'path/to/picture'
    }])

  }

  return (
    <div className='app'>
      <h1>ECommerce Re-Store</h1>
      <Catalog products={products} addProduct={addProduct} />
    </div>
  );
}

export default App;
