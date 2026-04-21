import { useState, useContext } from "react";
import DataContext from "../Context/DataContext";

const Dashboard = () => {
  const { data, FetchingAllProducts, setData } = useContext(DataContext);
  // const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [image, setImage] = useState(null);
  const [Description, setDescription] = useState("");

  const addProduct = () => {
    if (!name || !price) return;
    const imageUrl = image ? URL.createObjectURL(image) : "";
    const newProduct = {
      id: Date.now(),
      name,
      price,
      inStock,
      image: imageUrl,
      Description,
    };
    setData([...data, newProduct]);
    setName("");
    setPrice("");
    setInStock(true);
    setImage(null);
    setDescription("");
  };

  const deleteProduct = (id) => {
    setData(data.filter((p) => p.id !== id));
  };

  const toggleStock = (id) => {
    setData(data.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
  };
  return (
    <div id="dashboard">
      <div className="max-w-6xl mx-auto px-10 mb-10">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

          <div className="mb-2 border rounded-2xl shadow p-4 bg-white">
            <div className=" p-4 space-y-3">
              <input
                placeholder=" Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mr-1"
              />
              <input
                placeholder=" Product Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className="mr-1"
              />
              <input
                placeholder=" Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border p-2 rounded w-full"
              />

              <div className="flex items-center gap-2 ">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={() => setInStock(!inStock)}
                />
                <span>In Stock</span>
              </div>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer"
                onClick={addProduct}
              >
                Add Product
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {data?.map((product) => (
              <div
                className="border rounded-2xl shadow p-4 bg-white"
                key={product.id}
              >
                <div className="p-4 md:flex justify-between m-2 items-center">
                  <div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-xl mb-2"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-500">${product.price}</p>
                    <p
                      className={`mb-1 text-sm ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                      variant="outline"
                      onClick={() => toggleStock(product.id)}
                    >
                      Toggle Stock
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-xl"
                      variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
