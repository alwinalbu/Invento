// import { Fragment, useEffect, useRef, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";
// import { serverUrl } from "../pages/Register";

// export default function AddPurchase({
//   addSaleModalSetting,
//   products,
//   suppliers,
//   handlePageUpdate,
//   authContext,
//   editPurchaseData,
// }) {
//   const isEdit = !!editPurchaseData;
//   const [purchase, setPurchase] = useState(
//     editPurchaseData || {
//       userID: authContext.user,
//       supplierID: "",
//       productID: "",
//       quantityPurchased: "",
//       purchaseDate: "",
//       totalPurchaseAmount: "",
//     }
//   );

//   const [hasSales, setHasSales] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const cancelButtonRef = useRef(null);
//   const [open, setOpen] = useState(true);

//   // ✅ Fetch if product has sales (only when editing)
//   useEffect(() => {
//     const checkSales = async () => {
//       if (!isEdit) return;

//       try {
//         setLoading(true);
//         const res = await fetch(
//           `${serverUrl}/sales/check/${editPurchaseData.ProductID._id}/${editPurchaseData.PurchaseDate}`
//         );

//         const data = await res.json();
//         setHasSales(data.hasSales);
//       } catch (err) {
//         console.error("Error checking sales:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkSales();
//   }, [isEdit]);

//   // ✅ Handle form input
//   const handleInputChange = (key, value) => {
//     if (key === "quantityPurchased" || key === "totalPurchaseAmount") {
//       if (parseFloat(value) < 0) {
//         Swal.fire("Invalid", `${key} cannot be negative.`, "warning");
//         return;
//       }
//     }
//     setPurchase((prev) => ({ ...prev, [key]: value }));
//   };

//   // ✅ Add or Edit Purchase
//   const savePurchase = async () => {
//     const {
//       supplierID,
//       productID,
//       quantityPurchased,
//       purchaseDate,
//       totalPurchaseAmount,
//     } = purchase;

//     if (
//       !supplierID ||
//       !productID ||
//       !quantityPurchased ||
//       !purchaseDate ||
//       !totalPurchaseAmount
//     ) {
//       Swal.fire("Error", "Please fill out all fields.", "error");
//       return;
//     }

//     const url = isEdit
//       ? `${serverUrl}/purchase/edit/${purchase._id}`
//       : `${serverUrl}/purchase/add`;
//     const method = isEdit ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(purchase),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed");

//       Swal.fire(
//         "Success",
//         isEdit
//           ? "Purchase updated successfully!"
//           : "Purchase added successfully!",
//         "success"
//       );
//       handlePageUpdate();
//       addSaleModalSetting();
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     }
//   };

//   return (
//     <Transition.Root show={open} as={Fragment}>
//       <Dialog
//         as="div"
//         className="relative z-10"
//         initialFocus={cancelButtonRef}
//         onClose={setOpen}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                       {isEdit ? (
//                         <PencilIcon
//                           className="h-6 w-6 text-blue-400"
//                           aria-hidden="true"
//                         />
//                       ) : (
//                         <PlusIcon
//                           className="h-6 w-6 text-blue-400"
//                           aria-hidden="true"
//                         />
//                       )}
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                       <Dialog.Title
//                         as="h3"
//                         className="text-lg py-4 font-semibold leading-6 text-gray-900"
//                       >
//                         {isEdit ? "Edit Purchase" : "Add Purchase"}
//                       </Dialog.Title>

//                       {/* Warning if sales exist */}
//                       {isEdit && hasSales && (
//                         <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-2 rounded mb-3 text-sm">
//                           ⚠️ Sales exist for this product — Quantity and Amount
//                           are locked.
//                         </div>
//                       )}

//                       {loading ? (
//                         <p className="text-gray-600 text-sm">
//                           Checking sales...
//                         </p>
//                       ) : (
//                         <form className="grid gap-4 mb-4 sm:grid-cols-2">
//                           {/* Supplier */}
//                           <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-900">
//                               Supplier
//                             </label>
//                             <select
//                               value={purchase.supplierID}
//                               onChange={(e) =>
//                                 handleInputChange("supplierID", e.target.value)
//                               }
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
//                             >
//                               <option value="">Select Supplier</option>
//                               {suppliers.map((s) => (
//                                 <option key={s._id} value={s._id}>
//                                   {s.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>

//                           {/* Product */}
//                           <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-900">
//                               Product
//                             </label>
//                             <select
//                               value={purchase.productID}
//                               onChange={(e) =>
//                                 handleInputChange("productID", e.target.value)
//                               }
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
//                               disabled={isEdit} // Don’t change product on edit
//                             >
//                               <option value="">Select Product</option>
//                               {products.map((p) => (
//                                 <option key={p._id} value={p._id}>
//                                   {p.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>

//                           {/* Quantity */}
//                           <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-900">
//                               Quantity
//                             </label>
//                             <input
//                               type="number"
//                               value={purchase.quantityPurchased}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   "quantityPurchased",
//                                   e.target.value
//                                 )
//                               }
//                               disabled={isEdit && hasSales}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
//                             />
//                           </div>

//                           {/* Amount */}
//                           <div>
//                             <label className="block mb-2 text-sm font-medium text-gray-900">
//                               Total Amount
//                             </label>
//                             <input
//                               type="number"
//                               value={purchase.totalPurchaseAmount}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   "totalPurchaseAmount",
//                                   e.target.value
//                                 )
//                               }
//                               disabled={isEdit && hasSales}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
//                             />
//                           </div>

//                           {/* Date */}
//                           <div className="sm:col-span-2">
//                             <label className="block mb-2 text-sm font-medium text-gray-900">
//                               Purchase Date
//                             </label>
//                             <input
//                               type="date"
//                               value={purchase.purchaseDate}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   "purchaseDate",
//                                   e.target.value
//                                 )
//                               }
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
//                             />
//                           </div>
//                         </form>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                   <button
//                     type="button"
//                     className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 sm:ml-3 sm:w-auto"
//                     onClick={savePurchase}
//                     disabled={loading}
//                   >
//                     {isEdit ? "Update" : "Add"}
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//                     onClick={addSaleModalSetting}
//                     ref={cancelButtonRef}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { serverUrl } from "../pages/Register";

export default function AddPurchase({
  addSaleModalSetting,
  products,
  suppliers,
  handlePageUpdate,
  authContext,
  editPurchaseData,
}) {
  const isEdit = !!editPurchaseData;
  const [purchase, setPurchase] = useState({
    userID: authContext.user,
    supplierID: "",
    productID: "",
    quantityPurchased: "",
    purchaseDate: "",
    totalPurchaseAmount: "",
  });

  const [hasSales, setHasSales] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const [open, setOpen] = useState(true);

  // ✅ When editPurchaseData changes, prefill the form
  useEffect(() => {
    if (editPurchaseData) {
      setPurchase({
        userID: authContext.user,
        supplierID:
          editPurchaseData.supplierID?._id || editPurchaseData.supplierID || "",
        productID:
          editPurchaseData.ProductID?._id || editPurchaseData.productID || "",
        quantityPurchased:
          editPurchaseData.QuantityPurchased ||
          editPurchaseData.quantityPurchased ||
          "",
        purchaseDate: editPurchaseData.PurchaseDate
          ? new Date(editPurchaseData.PurchaseDate).toISOString().split("T")[0]
          : "",
        totalPurchaseAmount:
          editPurchaseData.TotalPurchaseAmount ||
          editPurchaseData.totalPurchaseAmount ||
          "",
      });
    }
  }, [editPurchaseData, authContext.user]);

  // ✅ Check if product has related sales (only in edit mode)
  useEffect(() => {
    const checkSales = async () => {
      if (!isEdit || !editPurchaseData?.ProductID) return;

      try {
        setLoading(true);
        const productId =
          typeof editPurchaseData.ProductID === "object"
            ? editPurchaseData.ProductID._id
            : editPurchaseData.ProductID;

        const res = await fetch(
          `${serverUrl}/sales/check/${productId}/${editPurchaseData.PurchaseDate}`
        );
        const data = await res.json();
        setHasSales(data.hasSales);
      } catch (err) {
        console.error("Error checking sales:", err);
      } finally {
        setLoading(false);
      }
    };
    checkSales();
  }, [isEdit, editPurchaseData]);

  // ✅ Handle form input changes
  const handleInputChange = (key, value) => {
    if (key === "quantityPurchased" || key === "totalPurchaseAmount") {
      if (parseFloat(value) < 0) {
        Swal.fire("Invalid", `${key} cannot be negative.`, "warning");
        return;
      }
    }
    setPurchase((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Add or Edit Purchase
  const savePurchase = async () => {
    const {
      supplierID,
      productID,
      quantityPurchased,
      purchaseDate,
      totalPurchaseAmount,
    } = purchase;

    if (
      !supplierID ||
      !productID ||
      !quantityPurchased ||
      !purchaseDate ||
      !totalPurchaseAmount
    ) {
      Swal.fire("Error", "Please fill out all fields.", "error");
      return;
    }

    const url = isEdit
      ? `${serverUrl}/purchase/edit/${editPurchaseData._id}`
      : `${serverUrl}/purchase/add`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchase),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed");

      Swal.fire(
        "Success",
        isEdit
          ? "Purchase updated successfully!"
          : "Purchase added successfully!",
        "success"
      );

      handlePageUpdate();
      addSaleModalSetting();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      {isEdit ? (
                        <PencilIcon
                          className="h-6 w-6 text-blue-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="h-6 w-6 text-blue-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg py-4 font-semibold leading-6 text-gray-900"
                      >
                        {isEdit ? "Edit Purchase" : "Add Purchase"}
                      </Dialog.Title>

                      {/* Warning if sales exist */}
                      {isEdit && hasSales && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-2 rounded mb-3 text-sm">
                          ⚠️ Sales exist for this product — Quantity and Amount
                          are locked.
                        </div>
                      )}

                      {loading ? (
                        <p className="text-gray-600 text-sm">
                          Checking sales...
                        </p>
                      ) : (
                        <form className="grid gap-4 mb-4 sm:grid-cols-2">
                          {/* Supplier */}
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Supplier
                            </label>
                            <select
                              value={purchase.supplierID}
                              onChange={(e) =>
                                handleInputChange("supplierID", e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            >
                              <option value="">Select Supplier</option>
                              {suppliers.map((s) => (
                                <option key={s._id} value={s._id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Product */}
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Product
                            </label>
                            <select
                              value={purchase.productID}
                              onChange={(e) =>
                                handleInputChange("productID", e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                              disabled={isEdit}
                            >
                              <option value="">Select Product</option>
                              {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={purchase.quantityPurchased}
                              onChange={(e) =>
                                handleInputChange(
                                  "quantityPurchased",
                                  e.target.value
                                )
                              }
                              disabled={isEdit && hasSales}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            />
                          </div>

                          {/* Amount */}
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Total Amount
                            </label>
                            <input
                              type="number"
                              value={purchase.totalPurchaseAmount}
                              onChange={(e) =>
                                handleInputChange(
                                  "totalPurchaseAmount",
                                  e.target.value
                                )
                              }
                              disabled={isEdit && hasSales}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            />
                          </div>

                          {/* Date */}
                          <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                              Purchase Date
                            </label>
                            <input
                              type="date"
                              value={purchase.purchaseDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "purchaseDate",
                                  e.target.value
                                )
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            />
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={savePurchase}
                    disabled={loading}
                  >
                    {isEdit ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
