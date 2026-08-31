import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  // console.log(sampleData)
  return (
    <>
      <ProductList data={latestProducts} title="Newset Arrivals" limit={4 } />
    </>
  );
};

export default Homepage;
