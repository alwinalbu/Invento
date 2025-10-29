import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { serverUrl } from "../pages/Register";
import Swal from "sweetalert2";


export default function AddSale({
  addSaleModalSetting,
  products,
  stores,
  handlePageUpdate,
  authContext,
}) {
  const [sale, setSale] = useState({
    userID: authContext.user,
    productID: "",
    storeID: "",
    stockSold: "",
    saleDate: "",
    totalSaleAmount: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [error, setError] = useState("");
  const [errorTotal, setErrorTotal] = useState("");
  const [productStock, setProductStock] = useState(0);

  // Fetch product stock when product is selected
  useEffect(() => {
    if (sale.productID) {
      const selectedProduct = products.find(
        (product) => product._id === sale.productID
      );
      if (selectedProduct) {
        setProductStock(selectedProduct.stock);
      }
    }
  }, [sale.productID, products]);

  // Handling Input Change for input fields
 const handleInputChange = (key, value) => {
   // Prevent negative numbers for stockSold and totalSaleAmount
   if ((key === "totalSaleAmount") && value < 0) {
     setErrorTotal("Value cannot be negative.");
     return;
   }

   if ((key === "stockSold") && value < 0) {
     setError("Value cannot be negative.");
     return;
   }

   setSale({ ...sale, [key]: value });

   // Additional stock validation for stockSold
   if (key === "stockSold") {
     if (value > productStock) {
       setError("Not enough stock available for this sale.");
     } else {
       setError("");
     }
   } else {
     setError("");
   }
 };


  const addSale = () => {
    // Validation before submitting the sale
    if (sale.stockSold <= 0 || sale.stockSold > productStock) {
      setError("Please enter a valid sale quantity.");
      return;
    }

    fetch(`${serverUrl}/sales/add`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(sale),
    })
      .then((result) => {
        if (result.ok) {
          Swal.fire({
            title: "Success!",
            text: "New Sale is Added.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            handlePageUpdate(); 
            addSaleModalSetting();
          });
        } else {
          return result.json().then((data) => {
            throw new Error(data.message || "Something went wrong");
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to add sale.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg overflow-y-scroll">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg py-4 font-semibold leading-6 text-gray-900 "
                      >
                        Add Sale
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="productID"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Product Name
                            </label>
                            <select
                              id="productID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="productID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option value="" selected>
                                Select Products
                              </option>
                              {products.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="stockSold"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Stock Sold
                            </label>
                            <input
                              type="number"
                              name="stockSold"
                              id="stockSold"
                              value={sale.stockSold}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Enter quantity"
                            />
                            {error && (
                              <div className="text-red-500 text-xs mt-1">
                                {error}
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="storeID"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Store Name
                            </label>
                            <select
                              id="storeID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="storeID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option value="" selected>
                                Select Store
                              </option>
                              {stores.map((element) => (
                                <option key={element._id} value={element._id}>
                                  {element.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="totalSaleAmount"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Total Sale Amount
                            </label>
                            <input
                              type="number"
                              name="totalSaleAmount"
                              id="totalSaleAmount"
                              value={sale.totalSaleAmount}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="$100 - $10,000"
                            />
                            {errorTotal && (
                              <div className="text-red-500 text-xs mt-1">
                                {errorTotal}
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="saleDate"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Sale Date
                            </label>
                            <input
                              type="date"
                              name="saleDate"
                              id="saleDate"
                              value={sale.saleDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              onKeyDown={(e)=>e.preventDefault()}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={addSale}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Sale
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={addSaleModalSetting}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
