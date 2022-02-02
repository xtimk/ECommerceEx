import { Fragment } from "react";
import { Product } from "../../app/models/product";

interface Props {
    products: Product[];
    addProduct: () => void; // () stands for 0 params, returns void
}

// by using props, i have to use props.product or props.addProduct to access elements of props passed by the App.tsx
// export default function Catalog(props: Props) {
// I can avoid this by putting in the {} directly the elements of the prop that i want to access: this way i dont have to use props.product, but just product
export default function Catalog({products, addProduct}: Props) {
    return (
        <Fragment>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - {product.price}</li>
        ))}
      </ul>
      <button onClick={addProduct}>Add product</button>
        </Fragment>
    )
}