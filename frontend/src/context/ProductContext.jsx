import React, { createContext, useState } from "react";

export const ProductContext = createContext();

function ProductProvider({ children }) {
  const [search, setSearch] = useState("");

  return (
    <ProductContext.Provider value={{ search, setSearch }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
