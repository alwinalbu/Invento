import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import dashboardIcon from "../assets/dashboard-icon.png";
import inventoryIcon from "../assets/inventory-icon.png";
import supplierIcon from "../assets/supplier-icon.png";
import orderIcon from "../assets/order-icon.png";

const SideMenu = () => {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/", icon: dashboardIcon },
    { name: "Inventory", path: "/inventory", icon: inventoryIcon },
    { name: "Purchase Details", path: "/purchase-details", icon: supplierIcon },
    { name: "Sales", path: "/sales", icon: supplierIcon },
    { name: "Manage Store", path: "/manage-store", icon: orderIcon },
    { name: "Suppliers", path: "/suppliers", icon: supplierIcon },
  ];

  return (
    <div
      className={`h-screen flex flex-col justify-between bg-white border-r shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ========== Top Section ========== */}
      <div className="flex flex-col">
        {/* Toggle Button */}
        <div className="flex justify-end p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 hover:text-blue-600"
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav aria-label="Main Nav" className="flex flex-col space-y-1 mt-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center gap-3 rounded-lg mx-2 p-2 transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={isCollapsed ? item.name : ""}
            >
              <img src={item.icon} alt={item.name} className="h-5 w-5" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* ========== Bottom User Section ========== */}
      <div className="border-t border-gray-200 p-3 flex items-center gap-3 hover:bg-gray-50 transition-all">
        <img
          src={localStorageData?.imageUrl}
          alt="User"
          className="h-10 w-10 rounded-full object-cover border border-gray-300"
        />
        {!isCollapsed && (
          <div>
            <p className="text-xs text-gray-700">
              <strong className="block font-medium text-gray-900">
                {localStorageData?.firstName + " " + localStorageData?.lastName}
              </strong>
              <span className="text-gray-500 text-[11px]">
                {localStorageData?.email}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
