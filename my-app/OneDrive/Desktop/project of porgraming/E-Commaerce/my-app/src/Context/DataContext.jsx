import axios from "axios";
import { createContext, useState } from "react";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState();

  // fetching all products from api
  const FetchingAllProducts = async () => {
    try {
      const res = await axios.get("https://fakestoreapi.com/products");
      const ProductsData = res.data;
      setData(ProductsData);
    } catch (error) {
      console.log(error);
    }
  };
  const getUniqueCategory = (data, property) => {
    let newVal = data?.map((curElem) => {
      return curElem[property];
    });
    newVal = ["All", ...new Set(newVal)];
    return newVal;
  };
  const categoryOnlyData = getUniqueCategory(data, "category");
  // const brandOnlyData = getUniqueCategory(data, "brand");
  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        FetchingAllProducts,
        categoryOnlyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataContext;
