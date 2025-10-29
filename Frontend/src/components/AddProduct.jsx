// import { Fragment, useContext, useRef, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import AuthContext from "../utlis/AuthContext";
// import { serverUrl } from "../pages/Register";
// import Swal from "sweetalert2";


// export default function AddProduct({
//   addProductModalSetting,
//   handlePageUpdate,
// }) {
//   const authContext = useContext(AuthContext);

//   const [product, setProduct] = useState({
//     userId: authContext?.user ?? "",
//     name: "",
//     manufacturer: "",
//     description: "",
//   });

//   const [open, setOpen] = useState(true);
//   const cancelButtonRef = useRef(null);

//   const handleInputChange = (key, value) => {
//     setProduct((prev) => ({ ...prev, [key]: value }));
//   };

//   const addProduct = () => {
//     if (!product.name || !product.manufacturer || !product.description) {
//       alert("Please fill in all fields.");
//       return;
//     }

// fetch(`${serverUrl}/product/add`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(product),
// })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Failed to add product");
//     }
//     return response.json();
//   })
//   .then(() => {
//     // Success notification
//     Swal.fire({
//       icon: "success",
//       title: "Success",
//       text: "Product added successfully!",
//     });
//     handlePageUpdate(); // Refresh the page or trigger re-fetch
//     addProductModalSetting(); // Close modal after success
//   })
//   .catch((err) => {
//     console.error(err);
//     // Error notification
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "Failed to add product. Please try again.",
//     });
//   });

//   };

//   return (
//     <Transition show={open} as={Fragment}>
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
//                       <PlusIcon
//                         className="h-6 w-6 text-blue-400"
//                         aria-hidden="true"
//                       />
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                       <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
//                         Add Product
//                       </Dialog.Title>
//                       <form>
//                         <div className="grid gap-4 mb-4 sm:grid-cols-2">
//                           <InputField
//                             label="Name"
//                             id="name"
//                             value={product.name}
//                             onChange={(e) =>
//                               handleInputChange(e.target.name, e.target.value)
//                             }
//                           />
//                           <InputField
//                             label="Manufacturer"
//                             id="manufacturer"
//                             value={product.manufacturer}
//                             onChange={(e) =>
//                               handleInputChange(e.target.name, e.target.value)
//                             }
//                           />
//                           <div className="sm:col-span-2">
//                             <label
//                               htmlFor="description"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Description
//                             </label>
//                             <textarea
//                               id="description"
//                               rows="5"
//                               name="description"
//                               className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
//                               placeholder="Write a description..."
//                               value={product.description}
//                               onChange={(e) =>
//                                 handleInputChange(e.target.name, e.target.value)
//                               }
//                             />
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="button"
//                     className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
//                     onClick={addProduct}
//                   >
//                     Add Product
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
//                     onClick={() => addProductModalSetting()}
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
//     </Transition>
//   );
// }

// function InputField({ label, id, value, onChange }) {
//   return (
//     <div>
//       <label
//         htmlFor={id}
//         className="block mb-2 text-sm font-medium text-gray-900"
//       >
//         {label}
//       </label>
//       <input
//         type="text"
//         name={id}
//         id={id}
//         value={value}
//         onChange={onChange}
//         className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg"
//       />
//     </div>
//   );
// }

import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../utlis/AuthContext";
import { serverUrl } from "../pages/Register";
import Swal from "sweetalert2";

export default function AddProduct({
  addProductModalSetting,
  handlePageUpdate,
}) {
  const authContext = useContext(AuthContext);

  const [product, setProduct] = useState({
    userId: authContext?.user ?? "",
    name: "",
    manufacturer: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Validation helper
const validateFields = () => {
  const name = product.name.trim();
  const manufacturer = product.manufacturer.trim();

  // ✅ Required check
  if (!name || !manufacturer) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in both Name and Manufacturer.",
    });
    return false;
  }

  // ✅ Length check (max 25)
  if (name.length > 25 || manufacturer.length > 25) {
    Swal.fire({
      icon: "error",
      title: "Too Long",
      text: "Name and Manufacturer cannot exceed 25 characters.",
    });
    return false;
  }

  // ✅ Only letters, numbers, and spaces allowed
  const allowed = /^[A-Za-z0-9 ]+$/;
  if (!allowed.test(name) || !allowed.test(manufacturer)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Characters",
      text: "Only letters, numbers, and spaces are allowed — no special characters.",
    });
    return false;
  }

  // ✅ No negative or weird numbers
  if (/^-/.test(name) || /^-/.test(manufacturer)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Format",
      text: "Negative numbers or invalid symbols are not allowed.",
    });
    return false;
  }

  // ✅ Must have at least one letter (avoid only numbers or spaces)
  if (!/[A-Za-z]/.test(name) || !/[A-Za-z]/.test(manufacturer)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name and Manufacturer must contain at least one letter.",
    });
    return false;
  }

  return true;
};


  const addProduct = () => {
    if (!validateFields()) return;

    fetch(`${serverUrl}/product/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add product");
        return response.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product added successfully!",
        });
        handlePageUpdate();
        addProductModalSetting();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add product. Please try again.",
        });
      });
  };

  return (
    <Transition show={open} as={Fragment}>
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
                      <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                        Add Product
                      </Dialog.Title>
                      <form>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <InputField
                            label="Name"
                            id="name"
                            value={product.name}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                          <InputField
                            label="Manufacturer"
                            id="manufacturer"
                            value={product.manufacturer}
                            onChange={(e) =>
                              handleInputChange(e.target.name, e.target.value)
                            }
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    onClick={addProduct}
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
                    onClick={() => addProductModalSetting()}
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
    </Transition>
  );
}

function InputField({ label, id, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type="text"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}

