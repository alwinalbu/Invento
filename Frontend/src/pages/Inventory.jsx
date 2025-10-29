import React, { useContext, useEffect, useState } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import searchIcon from "../assets/search-icon.png";
import AuthContext from "../utlis/AuthContext";
import { serverUrl } from "./Register";

const Inventory = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null); 
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false); 
  const [error, setError] = useState(null); 

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (searchTerm) {
      fetchSearchData();
    } else {
      fetchProductsData();
    }
  }, [refresh, searchTerm]);



  const fetchSearchData = () => {
    fetch(`${serverUrl}/product/search?searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to search products.");
      });
  };

  // Fetching Data of All Products (including deleted ones)
  const fetchProductsData = () => {
    fetch(`${serverUrl}/product/get/${authContext.user}?includeDeleted=true`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        setError(null); // Reset error if data is fetched successfully
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch products.");
      });
  };



  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete item (soft delete, mark as inactive)
  const deleteItem = (id) => {
    fetch(`${serverUrl}/product/delete/${id}`, {
      method: "PUT", // Change method to PUT for updating the product
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleted: true }), // Mark the product as deleted
    })
      .then((response) => response.json())
      .then(() => {
        setRefresh(!refresh); // Trigger product list refresh
        setError(null); // Reset error if deletion is successful
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to delete product.");
      });
  };

  // Function to restore a deleted product (make it active again)
  const restoreProduct = (id) => {
    fetch(`${serverUrl}/product/restore/${id}`, {
      method: "PUT", // Use PUT to update the product
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setRefresh(!refresh); // Trigger product list refresh after restoration
        setError(null); // Reset error if restoration is successful
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to restore product.");
      });
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={() => setRefresh(!refresh)}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img alt="search-icon" className="w-5 h-5" src={searchIcon} />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="text-center py-5">No products found.</p>
          ) : (
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Products
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Manufacturer
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Stock
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    Availability
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    More
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.map((element) => (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.stock > 0 ? "In Stock" : "Not in Stock"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateProductModalSetting(element)}
                      >
                        Edit
                      </span>
                      {element.deleted ? (
                        <span
                          className="text-blue-600 px-2 cursor-pointer"
                          onClick={() => restoreProduct(element._id)}
                        >
                          Restore
                        </span>
                      ) : (
                        <span
                          className="text-red-600 px-2 cursor-pointer"
                          onClick={() => deleteItem(element._id)}
                        >
                          Delete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;


