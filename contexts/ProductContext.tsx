import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProductCategory = "vegetables" | "grains" | "fruits";

export interface Product {
  id: string;
  name: string;
  nameId: string;
  price: number;
  category: ProductCategory;
  createdAt: number;
  image: string | null;
  unit: string;
  stock: number;
  farmer: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  editProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("products");
      if (stored) setProducts(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: Date.now().toString(), createdAt: Date.now() },
    ]);
  };

  const editProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
