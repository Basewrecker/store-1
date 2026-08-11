import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product-list";

const Homepage = async () => {
  // console.log(sampleData)
  return (
    <>
      <ProductList data={sampleData.products} title="Newset Arrivals" limit={4 } />
    </>
  );
};

export default Homepage;
