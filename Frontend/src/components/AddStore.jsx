import React, { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../utlis/AuthContext";
import UploadImage from "./UploadImage";
import { serverUrl } from "../pages/Register";
import Swal from "sweetalert2";

export default function AddStore({ onStoreAdded }) {
  const authContext = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: authContext.user,
    name: "",
    category: "",
    address: "",
    city: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.category || !form.address || !form.city || !form.image) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

const addStore = () => {
  if (!validateForm()) return;

  fetch(`${serverUrl}/store/add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((result) => {
      if (result.ok) {
        // Success notification with SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Store Added",
          text: "Store added successfully.",
        });
        onStoreAdded(); // Callback to update the page or state
        setOpen(false); // Close the modal
      } else {
        throw new Error("Failed to add store.");
      }
    })
    .catch((err) => {
      console.error("Error adding store:", err);
      // Error notification with SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add store. Please try again.",
      });
    });
};

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Invento");

    await fetch("https://api.cloudinary.com/v1_1/dylttfesj/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...form, image: data.url });
        alert("Store image successfully uploaded.");
      })
      .catch((error) => console.error("Error uploading image:", error));
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
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Store Information
                      </Dialog.Title>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <form>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={form.name}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter store name"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              value={form.city}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Category
                            </label>
                            <select
                              id="category"
                              name="category"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              value={form.category}
                              onChange={handleInputChange}
                            >
                              <option value="">Select category</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Groceries">Groceries</option>
                              <option value="Wholesale">Wholesale</option>
                              <option value="SuperMart">SuperMart</option>
                              <option value="Phones">Phones</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="address"
                              className="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Address
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              rows="4"
                              value={form.address}
                              onChange={handleInputChange}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Enter address"
                            ></textarea>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <UploadImage uploadImage={uploadImage} />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addStore}
                  >
                    Add Store
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
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
