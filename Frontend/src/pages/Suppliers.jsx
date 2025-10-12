
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { serverUrl } from "./Register";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editSupplier, setEditSupplier] = useState(null);

  // ✅ Fetch all suppliers on page load
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${serverUrl}/supplier/get`);
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editSupplier) {
      setEditSupplier({ ...editSupplier, [name]: value });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  // ✅ Add supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${serverUrl}/supplier/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
      });
      if (!res.ok) throw new Error("Failed to add supplier");
      Swal.fire("Success", "Supplier added successfully!", "success");
      setNewSupplier({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
      });
      fetchSuppliers();
    } catch (err) {
      Swal.fire("Error", "Could not add supplier", "error");
    }
  };

  // ✅ Update supplier
  const handleEditSupplier = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${serverUrl}/supplier/${editSupplier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSupplier),
      });
      if (!res.ok) throw new Error("Update failed");
      Swal.fire("Updated!", "Supplier details updated.", "success");
      setEditSupplier(null);
      fetchSuppliers();
    } catch (err) {
      Swal.fire("Error", "Failed to update supplier", "error");
    }
  };

  // ✅ Block / Unblock supplier
  const handleToggleStatus = async (id, currentStatus) => {
    const confirm = await Swal.fire({
      title: currentStatus ? "Block Supplier?" : "Activate Supplier?",
      text: currentStatus
        ? "This supplier will be marked inactive."
        : "This supplier will be reactivated.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (!confirm.isConfirmed) return;

    await fetch(`${serverUrl}/supplier/${id}/toggle`, { method: "PATCH" });
    fetchSuppliers();
    Swal.fire(
      "Done",
      currentStatus ? "Supplier blocked." : "Supplier activated.",
      "success"
    );
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col w-11/12 gap-5">
        {/* ✅ Add or Edit Supplier Form */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            {editSupplier ? "Edit Supplier" : "Add New Supplier"}
          </h2>
          <form
            onSubmit={editSupplier ? handleEditSupplier : handleAddSupplier}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Supplier Name"
              value={editSupplier ? editSupplier.name : newSupplier.name}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={
                editSupplier
                  ? editSupplier.companyName
                  : newSupplier.companyName
              }
              onChange={handleInputChange}
              className="border rounded p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editSupplier ? editSupplier.email : newSupplier.email}
              onChange={handleInputChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={editSupplier ? editSupplier.phone : newSupplier.phone}
              onChange={handleInputChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={editSupplier ? editSupplier.address : newSupplier.address}
              onChange={handleInputChange}
              className="border rounded p-2 sm:col-span-2"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded sm:col-span-2"
            >
              {editSupplier ? "Update Supplier" : "Add Supplier"}
            </button>
            {editSupplier && (
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 rounded sm:col-span-2"
                onClick={() => setEditSupplier(null)}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* ✅ Supplier Table */}
        <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold px-4 py-3 text-gray-800 border-b">
            Supplier List
          </h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Company
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Email
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Phone
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Address
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((s) => (
                <tr
                  key={s._id}
                  className={`hover:bg-gray-50 ${
                    !s.isActive ? "bg-gray-100 text-gray-400" : ""
                  }`} // ✅ Faded look for inactive suppliers
                >
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.companyName}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2">{s.address}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      s.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className={`text-blue-600 hover:underline text-sm ${
                        !s.isActive ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        if (s.isActive) setEditSupplier(s);
                      }}
                      disabled={!s.isActive}
                    >
                      Edit
                    </button>
                    <button
                      className="text-yellow-600 hover:underline text-sm"
                      onClick={() => handleToggleStatus(s._id, s.isActive)}
                    >
                      {s.isActive ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
