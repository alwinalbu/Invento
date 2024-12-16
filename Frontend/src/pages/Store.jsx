import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../utlis/AuthContext";
import AddStore from "../components/AddStore";
import locationIcon from "../assets/location-icon.png";
import { serverUrl } from "./Register";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch all stores for the current user
  const fetchStores = () => {
    fetch(`${serverUrl}/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setStores(data);
      })
      .catch((error) => console.error("Error fetching stores:", error));
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleStoreAdded = () => {
    fetchStores(); // Refresh the store list after adding a store
    setShowModal(false);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12 border-2 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Manage Store</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModal}
          >
            Add Store
          </button>
        </div>
        {showModal && <AddStore onStoreAdded={handleStoreAdded} />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div
              className="bg-white shadow rounded-lg overflow-hidden"
              key={store._id}
            >
              <img
                alt="store"
                className="h-60 w-full object-cover"
                src={store.image}
              />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{store.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    alt="location icon"
                    className="h-6 w-6"
                    src={locationIcon}
                  />
                  <span>{`${store.address}, ${store.city}`}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Category: {store.category}
                </p>
              </div>
            </div>
          ))}
        </div>
        {stores.length === 0 && (
          <p className="text-gray-500 text-center">
            No stores found. Add a store to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default Store;
