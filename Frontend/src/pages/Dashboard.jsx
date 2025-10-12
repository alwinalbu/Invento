import React, { useContext, useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart"; 
import { PieChart } from "@mui/x-charts/PieChart"; 

import AuthContext from "../utlis/AuthContext";
import { serverUrl } from "./Register";

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [monthlySalesLabels, setMonthlySalesLabels] = useState([]);
  const [itemsSoldData, setItemsSoldData] = useState([]); 

  const authContext = useContext(AuthContext);

  console.log(authContext.user,"user inside dashboard");
  

  // Fetching total sales amount
  const fetchTotalSaleAmount = () => {
    fetch(`${serverUrl}/sales/get/${authContext.user}/totalsaleamount`)
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount));
  };

  // Fetching total purchase amount
  const fetchTotalPurchaseAmount = () => {
    fetch(
      `${serverUrl}/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount));
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(`${serverUrl}/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${serverUrl}/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales Data from backend
  const fetchMonthlySalesData = () => {
    fetch(`${serverUrl}/sales/getmonthly/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => {
        const salesAmount = datas.salesAmount;
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        setMonthlySalesData(salesAmount);
        setMonthlySalesLabels(months);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Sales Data for Products (for the Pie Chart)
  const fetchItemsSoldData = () => {
    fetch(`${serverUrl}/sales/getitems/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => {
        // Assuming the response is a list of products with quantity sold
        const productSales = datas.map((product) => ({
          name: product.name,
          quantitySold: product.quantitySold,
        }));
        setItemsSoldData(productSales);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
    fetchItemsSoldData(); // Fetching the number of items sold for PieChart
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                ${saleAmount}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchase
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                ${purchaseAmount}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Products
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {products.length}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Stores
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {stores.length}
              </span>
            </p>
          </div>
        </article>

        {/* Container for Responsive Layout */}
        <div className="graph-container flex flex-wrap gap-4 justify-center col-span-full">
          {/* Bar chart using MUI */}
          <div
            className="graph flex justify-center"
            style={{ minWidth: "300px", maxWidth: "500px" }}
          >
            <BarChart
              xAxis={[{ scaleType: "band", data: monthlySalesLabels }]}
              series={[{ data: monthlySalesData }]}
              width={400}
              height={300}
            />
          </div>

          {/* Pie chart for Items Sold */}
          <div
            className="graph flex justify-center"
            style={{ minWidth: "300px", maxWidth: "500px" }}
          >
            {itemsSoldData.length > 0 && (
              <PieChart
                series={[
                  {
                    data: itemsSoldData.map((product) => ({
                      label: product.name,
                      value: product.quantitySold,
                    })),
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={300}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

