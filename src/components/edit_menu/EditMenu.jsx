import React, { useState } from "react";
import Navbar from "../navbar/Navbar";

const AddMenuItem = () => {
  const [categories] = useState(["Burgers", "Chicken", "Drinks"]); // Predefined categories
  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    price: "",
    size: [{ size: "", price: "" }],
    selectedSize: "",
    imageUrl: "",
  });
  const [toast, setToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSizes = [...newItem.size];
    updatedSizes[index][name] = value;
    setNewItem((prev) => ({
      ...prev,
      size: updatedSizes,
    }));
  };

  const handleAddSize = () => {
    setNewItem((prev) => ({
      ...prev,
      size: [...prev.size, { size: "", price: "" }],
    }));
  };

  const handleDeleteSize = (index) => {
    const updatedSizes = [...newItem.size];
    updatedSizes.splice(index, 1); // Remove the size at the specified index
    setNewItem((prev) => ({
      ...prev,
      size: updatedSizes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = JSON.parse(localStorage.getItem("id"));

    // Validate fields
    if (
      !newItem.category ||
      !newItem.name ||
      !newItem.price ||
      !newItem.imageUrl ||
      newItem.size.some((s) => !s.size || !s.price)
    ) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch(
        `https://server-08ld.onrender.com/add_item/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        }
      );

      if (response.ok) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);

        // Reset the form after successful submission
        setNewItem({
          category: "",
          name: "",
          price: "",
          size: [{ size: "", price: "" }],
          selectedSize: "",
          imageUrl: "",
        });
      } else {
        const errorData = await response.json();
        alert("Error adding item: " + errorData.message);
      }
    } catch (error) {
      alert("Failed to add item. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Add Menu Item</h1>

          <div className="mb-4">
            <label className="block text-lg font-bold">Category</label>
            <select
              name="category"
              value={newItem.category}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-700 text-white"
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold">Item Name</label>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-700 text-white"
              placeholder="Enter item name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-bold">Price</label>
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-700 text-white"
              placeholder="Enter price"
            />
          </div>

          {newItem.size.map((size, index) => (
            <div
              key={index}
              className="space-y-2 border p-4 rounded-lg mb-4 bg-gray-700"
            >
              <div className="mb-4">
                <label className="block text-lg font-bold">Size</label>
                <input
                  type="text"
                  name="size"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="border p-2 rounded-lg w-full bg-gray-600 text-white"
                  placeholder="Enter size"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-bold">Size Price</label>
                <input
                  type="number"
                  name="price"
                  value={size.price}
                  onChange={(e) => handleSizeChange(index, e)}
                  className="border p-2 rounded-lg w-full bg-gray-600 text-white"
                  placeholder="Enter size price"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSize(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete Size
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSize}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Size
          </button>

          <div className="mb-4">
            <label className="block text-lg font-bold">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={newItem.imageUrl}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full bg-gray-700 text-white"
              placeholder="Enter image URL"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg w-full"
          >
            Submit
          </button>
        </form>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            Submission Complete!
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMenuItem;
