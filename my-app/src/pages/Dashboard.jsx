import { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DataContext from "../Context/DataContext";
import { API_BASE } from "../config/api.js";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Resize and JPEG-encode uploads so JSON payloads stay small (avoids 413 / MongoDB 16MB cap). */
async function compressImageFile(file, maxEdge = 1600, quality = 0.82) {
  if (!file?.type?.startsWith("image/")) {
    return readFileAsDataUrl(file);
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = objectUrl;
    });
    let { width, height } = img;
    const maxDim = Math.max(width, height);
    const scale = maxDim > maxEdge ? maxEdge / maxDim : 1;
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return readFileAsDataUrl(file);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return readFileAsDataUrl(file);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

const Dashboard = () => {
  const { data, FetchingAllProducts } = useContext(DataContext);
  useEffect(() => {
    FetchingAllProducts();
  }, [FetchingAllProducts]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [Description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const addProduct = async () => {
    if (!name?.trim() || !price || !category?.trim()) {
      toast.error("Name, category, and price are required");
      return;
    }
    let finalImage = imageUrl.trim();
    if (image) {
      try {
        finalImage = await compressImageFile(image);
      } catch {
        toast.error("Could not read image file");
        return;
      }
    }
    if (!finalImage) {
      toast.error("Add an image file or paste an image URL");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/api/products`, {
        title: name.trim(),
        price: Number(price),
        category: category.trim(),
        description: Description?.trim() || "",
        image: finalImage,
        inStock,
      });
      toast.success("Product saved to database");
      setName("");
      setCategory("");
      setPrice("");
      setInStock(true);
      setImage(null);
      setImageUrl("");
      setDescription("");
      await FetchingAllProducts();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Could not save product";
      toast.error(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`);
      toast.success("Product removed");
      await FetchingAllProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete");
      console.error(err);
    }
  };

  const toggleStock = async (product) => {
    try {
      await axios.patch(`${API_BASE}/api/products/${product.id}`, {
        inStock: !product.inStock,
      });
      await FetchingAllProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update");
      console.error(err);
    }
  };

  return (
    <div id="dashboard">
      <div className="max-w-6xl mx-auto px-10 mb-10">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

          <div className="mb-2 border rounded-2xl shadow p-4 bg-white">
            <div className=" p-4 space-y-3">
              <input
                placeholder="Product title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mr-1 w-full border rounded px-2 py-1"
              />
              <input
                placeholder="Category (e.g. electronics, clothes)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mr-1 w-full border rounded px-2 py-1"
              />
              <input
                placeholder="Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className="mr-1 w-full border rounded px-2 py-1"
              />
              <input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />

              <input
                placeholder="Image URL (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
              />
              <p className="text-xs text-gray-500">
                Use an image URL or upload a file. Uploads are resized before
                save to avoid size limits.
              </p>

              <div className="flex items-center gap-2 ">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={() => setInStock(!inStock)}
                />
                <span>In Stock</span>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer disabled:opacity-50"
                onClick={addProduct}
                disabled={saving}
              >
                {saving ? "Saving…" : "Add Product"}
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {(Array.isArray(data) ? data : []).map((product) => {
              const title = product.title ?? product.name;
              return (
                <div
                  className="border rounded-2xl shadow p-4 bg-white"
                  key={product.id}
                >
                  <div className="p-4 md:flex justify-between m-2 items-center">
                    <div>
                      <img
                        src={product.image}
                        alt={title}
                        className="w-24 h-24 object-cover rounded-xl mb-2"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold">{title}</h2>
                      <p className="text-sm text-gray-500">${product.price}</p>
                      <p className="text-xs text-gray-400">{product.category}</p>
                      <p
                        className={`mb-1 text-sm ${
                          product.inStock !== false
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.inStock !== false ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                        onClick={() => toggleStock(product)}
                      >
                        Toggle Stock
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-red-600 text-white rounded-xl"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
