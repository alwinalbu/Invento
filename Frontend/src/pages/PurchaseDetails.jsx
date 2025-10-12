// import { useContext, useEffect, useState } from "react";
// import AuthContext from "../utlis/AuthContext";
// import AddPurchase from "../components/AddPurchase";
// import { serverUrl } from "./Register";

// function PurchaseDetails() {
//   const [showPurchaseModal, setPurchaseModal] = useState(false);
//   const [purchases, setAllPurchases] = useState([]);
//   const [filteredPurchases, setFilteredPurchases] = useState([]);
//   const [products, setAllProducts] = useState([]);
//   const [suppliers, setAllSuppliers] = useState([]);
//   const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
//   const [updatePage, setUpdatePage] = useState(true);

//   // ✅ Filters
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });

//   const authContext = useContext(AuthContext);

//   // ✅ Fetch all data on load or update
//   useEffect(() => {
//     Promise.all([
//       fetchPurchaseData(),
//       fetchProductsData(),
//       fetchSuppliersData(),
//       fetchTotalPurchaseAmount(),
//     ]);
//   }, [updatePage]);

//   // ✅ Fetch Purchase Data
//   const fetchPurchaseData = async () => {
//     try {
//       const res = await fetch(`${serverUrl}/purchase/get/${authContext.user}`);
//       const data = await res.json();
//       setAllPurchases(data);
//       setFilteredPurchases(data);
//     } catch (err) {
//       console.log("Error fetching purchases:", err);
//     }
//   };

//   // ✅ Fetch Products
//   const fetchProductsData = async () => {
//     try {
//       const res = await fetch(`${serverUrl}/product/get/${authContext.user}`);
//       const data = await res.json();
//       setAllProducts(data);
//     } catch (err) {
//       console.log("Error fetching products:", err);
//     }
//   };

//   // ✅ Fetch Suppliers
//   const fetchSuppliersData = async () => {
//     try {
//       const res = await fetch(`${serverUrl}/supplier/get`);
//       const data = await res.json();
//       setAllSuppliers(data);
//     } catch (err) {
//       console.log("Error fetching suppliers:", err);
//     }
//   };

//   // ✅ Fetch Total Purchase Amount
//   const fetchTotalPurchaseAmount = async () => {
//     try {
//      const res = await fetch(
//        `${serverUrl}/purchase/get/${authContext.user}/totalpurchaseamount`
//      );
//       const data = await res.json();
//       setTotalPurchaseAmount(data.totalPurchaseAmount || 0);
//     } catch (err) {
//       console.log("Error fetching total purchase amount:", err);
//     }
//   };

//   // ✅ Toggle Modal
//   const addSaleModalSetting = () => {
//     setPurchaseModal(!showPurchaseModal);
//   };

//   // ✅ Handle Page Refresh
//   const handlePageUpdate = () => {
//     setUpdatePage(!updatePage);
//   };

//   // ✅ Filter Purchases
//   useEffect(() => {
//     let filtered = [...purchases];

//     if (selectedSupplier) {
//       filtered = filtered.filter((p) => p.supplierID?._id === selectedSupplier);
//     }

//     if (dateRange.from || dateRange.to) {
//       filtered = filtered.filter((p) => {
//         const purchaseDate = new Date(p.PurchaseDate);
//         const from = dateRange.from ? new Date(dateRange.from) : null;
//         const to = dateRange.to ? new Date(dateRange.to) : null;
//         return (!from || purchaseDate >= from) && (!to || purchaseDate <= to);
//       });
//     }

//     setFilteredPurchases(filtered);

//     // ✅ Update total after filters
//     const total = filtered.reduce(
//       (sum, p) => sum + (p.TotalPurchaseAmount || 0),
//       0
//     );
//     setTotalPurchaseAmount(total);
//   }, [selectedSupplier, dateRange, purchases]);

//   return (
//     <div className="col-span-12 lg:col-span-10 flex justify-center">
//       <div className="flex flex-col gap-5 w-11/12">
//         {showPurchaseModal && (
//           <AddPurchase
//             addSaleModalSetting={addSaleModalSetting}
//             products={products}
//             suppliers={suppliers}
//             handlePageUpdate={handlePageUpdate}
//             authContext={authContext}
//           />
//         )}

//         {/* ✅ Filter Bar */}
//         <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
//           <div className="flex gap-3 items-center flex-wrap">
//             {/* Supplier Filter */}
//             <select
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               className="border rounded p-2 text-sm text-gray-700"
//             >
//               <option value="">All Suppliers</option>
//               {suppliers.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name} ({s.companyName})
//                 </option>
//               ))}
//             </select>

//             {/* Date Range */}
//             <div className="flex gap-2 items-center">
//               <input
//                 type="date"
//                 value={dateRange.from}
//                 onChange={(e) =>
//                   setDateRange({ ...dateRange, from: e.target.value })
//                 }
//                 className="border rounded p-2 text-sm"
//               />
//               <span className="text-gray-500">to</span>
//               <input
//                 type="date"
//                 value={dateRange.to}
//                 onChange={(e) =>
//                   setDateRange({ ...dateRange, to: e.target.value })
//                 }
//                 className="border rounded p-2 text-sm"
//               />
//             </div>
//           </div>

//           {/* Reset Filters */}
//           <button
//             onClick={() => {
//               setSelectedSupplier("");
//               setDateRange({ from: "", to: "" });
//               setFilteredPurchases(purchases);
//             }}
//             className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded self-end sm:self-auto"
//           >
//             Reset Filters
//           </button>
//         </div>

//         {/* ✅ Purchase Table */}
//         <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 shadow-sm">
//           <div className="flex justify-between pt-5 pb-3 px-3">
//             <div className="flex gap-4 justify-center items-center">
//               <span className="font-bold text-lg text-gray-800">
//                 Purchase Details
//               </span>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
//                 onClick={addSaleModalSetting}
//               >
//                 Add Purchase
//               </button>
//             </div>
//           </div>

//           <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left font-medium text-gray-900">
//                   Supplier
//                 </th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-900">
//                   Product
//                 </th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-900">
//                   Quantity
//                 </th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-900">
//                   Purchase Date
//                 </th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-900">
//                   Amount
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {filteredPurchases.length > 0 ? (
//                 filteredPurchases.map((p) => (
//                   <tr key={p._id} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 text-gray-900">
//                       {p.supplierID?.name || "N/A"}
//                     </td>
//                     <td className="px-4 py-2 text-gray-900">
//                       {p.ProductID?.name || "N/A"}
//                     </td>
//                     <td className="px-4 py-2 text-gray-700">
//                       {p.QuantityPurchased || 0}
//                     </td>
//                     <td className="px-4 py-2 text-gray-700">
//                       {p.PurchaseDate
//                         ? new Date(p.PurchaseDate).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                     <td className="px-4 py-2 text-gray-700">
//                       ${p.TotalPurchaseAmount || 0}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="text-center py-4 text-gray-500 italic"
//                   >
//                     No purchases found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* ✅ Total Summary */}
//           <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end">
//             <span className="text-sm font-semibold text-gray-800">
//               Total Purchase Value:{" "}
//               <span className="text-blue-600 font-bold">
//                 ${totalPurchaseAmount.toFixed(2)}
//               </span>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PurchaseDetails;

import { useContext, useEffect, useState } from "react";
import AuthContext from "../utlis/AuthContext";
import AddPurchase from "../components/AddPurchase";
import { serverUrl } from "./Register";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [editPurchaseData, setEditPurchaseData] = useState(null);
  const [purchases, setAllPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [suppliers, setAllSuppliers] = useState([]);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [updatePage, setUpdatePage] = useState(true);

  // ✅ Filters
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const authContext = useContext(AuthContext);

  // ✅ Fetch all data on load or refresh
  useEffect(() => {
    Promise.all([
      fetchPurchaseData(),
      fetchProductsData(),
      fetchSuppliersData(),
      fetchTotalPurchaseAmount(),
    ]);
  }, [updatePage]);

  // ✅ Fetch Purchases
  const fetchPurchaseData = async () => {
    try {
      const res = await fetch(`${serverUrl}/purchase/get/${authContext.user}`);
      const data = await res.json();
      setAllPurchases(data);
      setFilteredPurchases(data);
    } catch (err) {
      console.log("Error fetching purchases:", err);
    }
  };

  // ✅ Fetch Products
  const fetchProductsData = async () => {
    try {
      const res = await fetch(`${serverUrl}/product/get/${authContext.user}`);
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  // ✅ Fetch Suppliers
  const fetchSuppliersData = async () => {
    try {
      const res = await fetch(`${serverUrl}/supplier/get`);
      const data = await res.json();
      setAllSuppliers(data);
    } catch (err) {
      console.log("Error fetching suppliers:", err);
    }
  };

  // ✅ Fetch Total Purchase Amount
  const fetchTotalPurchaseAmount = async () => {
    try {
      const res = await fetch(
        `${serverUrl}/purchase/get/${authContext.user}/totalpurchaseamount`
      );
      const data = await res.json();
      setTotalPurchaseAmount(data.totalPurchaseAmount || 0);
    } catch (err) {
      console.log("Error fetching total purchase amount:", err);
    }
  };

  // ✅ Toggle Add/Edit modal
  const togglePurchaseModal = (purchase = null) => {
    setEditPurchaseData(purchase);
    setPurchaseModal(!showPurchaseModal);
  };

  // ✅ Handle Page Refresh
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = [...purchases];

    if (selectedSupplier) {
      filtered = filtered.filter((p) => p.supplierID?._id === selectedSupplier);
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((p) => {
        const purchaseDate = new Date(p.PurchaseDate);
        const from = dateRange.from ? new Date(dateRange.from) : null;
        const to = dateRange.to ? new Date(dateRange.to) : null;
        return (!from || purchaseDate >= from) && (!to || purchaseDate <= to);
      });
    }

    setFilteredPurchases(filtered);

    const total = filtered.reduce(
      (sum, p) => sum + (p.TotalPurchaseAmount || 0),
      0
    );
    setTotalPurchaseAmount(total);
  }, [selectedSupplier, dateRange, purchases]);

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {/* ✅ Add / Edit Modal */}
        {showPurchaseModal && (
          <AddPurchase
            addSaleModalSetting={() => setPurchaseModal(false)}
            products={products}
            suppliers={suppliers}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
            editPurchaseData={editPurchaseData}
          />
        )}

        {/* ✅ Filter Bar */}
        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex gap-3 items-center flex-wrap">
            {/* Supplier Filter */}
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="border rounded p-2 text-sm text-gray-700"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.companyName})
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="border rounded p-2 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="border rounded p-2 text-sm"
              />
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedSupplier("");
              setDateRange({ from: "", to: "" });
              setFilteredPurchases(purchases);
            }}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded self-end sm:self-auto"
          >
            Reset Filters
          </button>
        </div>

        {/* ✅ Purchase Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 shadow-sm">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <span className="font-bold text-lg text-gray-800">
              Purchase Details
            </span>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={() => togglePurchaseModal()}
            >
              Add Purchase
            </button>
          </div>

          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Supplier
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Product
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Purchase Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Amount
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">
                      {p.supplierID?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {p.ProductID?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {p.QuantityPurchased || 0}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {p.PurchaseDate
                        ? new Date(p.PurchaseDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      ${p.TotalPurchaseAmount || 0}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => togglePurchaseModal(p)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ✅ Total Summary */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end">
            <span className="text-sm font-semibold text-gray-800">
              Total Purchase Value:{" "}
              <span className="text-blue-600 font-bold">
                ${totalPurchaseAmount.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;

