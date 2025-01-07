import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FaChartBar } from "react-icons/fa"; // For analytics-style dashboard
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  // Function to generate random transaction codes
  const generateTransactionCode = () => {
    const types = ['SALES-VIST', 'PLACEMENT-VIST'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generate random number between 1000-9999
    return `${randomType}-${randomNumber}`;
  };

  // Sample real data array with a new "transaction" field
  const realData = [
    { allocatedAmount: 25000, spentAmount: 9750, food: 500, fuel: 2100, stay: 5050, toll: 1100, transaction: generateTransactionCode() },
    { allocatedAmount: 28000, spentAmount: 12100, food: 550, fuel: 2200, stay: 7150, toll: 1200, transaction: generateTransactionCode() },
    { allocatedAmount: 23000, spentAmount: 7050, food: 400, fuel: 2300, stay: 3200, toll: 1150, transaction: generateTransactionCode() },
    { allocatedAmount: 21000, spentAmount: 7400, food: 600, fuel: 2400, stay: 4100, toll: 1300, transaction: generateTransactionCode() },
    { allocatedAmount: 26000, spentAmount: 9500, food: 550, fuel: 2500, stay: 5200, toll: 1250, transaction: generateTransactionCode() },
    { allocatedAmount: 22000, spentAmount: 8250, food: 500, fuel: 2150, stay: 4200, toll: 1400, transaction: generateTransactionCode() },
    { allocatedAmount: 27000, spentAmount: 10750, food: 600, fuel: 2350, stay: 6300, toll: 1500, transaction: generateTransactionCode() },
    { allocatedAmount: 29000, spentAmount: 11850, food: 400, fuel: 2450, stay: 7400, toll: 1600, transaction: generateTransactionCode() },
    { allocatedAmount: 25000, spentAmount: 8650, food: 550, fuel: 2200, stay: 4200, toll: 1700, transaction: generateTransactionCode() },
    { allocatedAmount: 20000, spentAmount: 5500, food: 300, fuel: 2000, stay: 3100, toll: 1100, transaction: generateTransactionCode() },
    { allocatedAmount: 24000, spentAmount: 8200, food: 500, fuel: 2100, stay: 5200, toll: 1400, transaction: generateTransactionCode() },
    { allocatedAmount: 21000, spentAmount: 7400, food: 600, fuel: 2250, stay: 4100, toll: 1450, transaction: generateTransactionCode() },
    { allocatedAmount: 25000, spentAmount: 7700, food: 550, fuel: 2350, stay: 4300, toll: 1500, transaction: generateTransactionCode() },
    { allocatedAmount: 22000, spentAmount: 7550, food: 400, fuel: 2400, stay: 4150, toll: 1600, transaction: generateTransactionCode() },
    { allocatedAmount: 27000, spentAmount: 10650, food: 500, fuel: 2500, stay: 6350, toll: 1700, transaction: generateTransactionCode() },
    { allocatedAmount: 29000, spentAmount: 12400, food: 600, fuel: 2550, stay: 7450, toll: 1800, transaction: generateTransactionCode() },
    { allocatedAmount: 23000, spentAmount: 7400, food: 550, fuel: 2650, stay: 3300, toll: 1900, transaction: generateTransactionCode() },
    { allocatedAmount: 24000, spentAmount: 10200, food: 500, fuel: 2700, stay: 5100, toll: 2000, transaction: generateTransactionCode() },
    { allocatedAmount: 26000, spentAmount: 10650, food: 600, fuel: 2750, stay: 5200, toll: 2100, transaction: generateTransactionCode() },
    { allocatedAmount: 28000, spentAmount: 10850, food: 550, fuel: 2800, stay: 5300, toll: 2200, transaction: generateTransactionCode() },
    { allocatedAmount: 30000, spentAmount: 10150, food: 600, fuel: 2850, stay: 5400, toll: 2300, transaction: generateTransactionCode() },
    { allocatedAmount: 31000, spentAmount: 10400, food: 500, fuel: 2900, stay: 5500, toll: 2400, transaction: generateTransactionCode() },
    { allocatedAmount: 32000, spentAmount: 10650, food: 600, fuel: 2950, stay: 5600, toll: 2500, transaction: generateTransactionCode() },
    { allocatedAmount: 33000, spentAmount: 10850, food: 550, fuel: 3000, stay: 5700, toll: 2600, transaction: generateTransactionCode() },
    { allocatedAmount: 34000, spentAmount: 11050, food: 600, fuel: 3050, stay: 5800, toll: 2700, transaction: generateTransactionCode() },
    { allocatedAmount: 35000, spentAmount: 11150, food: 550, fuel: 3100, stay: 5900, toll: 2800, transaction: generateTransactionCode() },
    { allocatedAmount: 36000, spentAmount: 11350, food: 600, fuel: 3150, stay: 6000, toll: 2900, transaction: generateTransactionCode() },
    { allocatedAmount: 37000, spentAmount: 11650, food: 550, fuel: 3200, stay: 6100, toll: 3000, transaction: generateTransactionCode() },
    { allocatedAmount: 38000, spentAmount: 11850, food: 600, fuel: 3250, stay: 6200, toll: 3100, transaction: generateTransactionCode() },
    { allocatedAmount: 39000, spentAmount: 12050, food: 550, fuel: 3300, stay: 6300, toll: 3200, transaction: generateTransactionCode() },
    { allocatedAmount: 40000, spentAmount: 12250, food: 600, fuel: 3350, stay: 6400, toll: 3300, transaction: generateTransactionCode() },
    { allocatedAmount: 41000, spentAmount: 12450, food: 550, fuel: 3400, stay: 6500, toll: 3400, transaction: generateTransactionCode() },
    { allocatedAmount: 42000, spentAmount: 12650, food: 600, fuel: 3450, stay: 6600, toll: 3500, transaction: generateTransactionCode() },
    { allocatedAmount: 43000, spentAmount: 12850, food: 550, fuel: 3500, stay: 6700, toll: 3600, transaction: generateTransactionCode() },
    { allocatedAmount: 44000, spentAmount: 13050, food: 600, fuel: 3550, stay: 6800, toll: 3700, transaction: generateTransactionCode() },
    { allocatedAmount: 45000, spentAmount: 13250, food: 550, fuel: 3600, stay: 6900, toll: 3800, transaction: generateTransactionCode() },
  ];

  // Initialize the table data with real data
  const [entries, setEntries] = useState(realData);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 11;

  // Calculate total pages
  const totalPages = Math.ceil(entries.length / recordsPerPage);

  // Get the records to display based on current page
  const currentEntries = entries.slice(
    (currentPage - 1) * recordsPerPage, 
    currentPage * recordsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate total spent and allocated amounts from entries for bar chart
  const totalAllocatedAmount = entries.reduce((total, entry) => total + parseFloat(entry.allocatedAmount), 0);
  const totalSpentAmount = entries.reduce((total, entry) => total + parseFloat(entry.spentAmount), 0);

  // Bar chart data setup based on real records (Spent Amount by Category)
  const barData = {
    labels: ['Food', 'Fuel', 'Stay', 'Toll'],
    datasets: [
      {
        label: 'Total Spent Amounts',
        data: [
          entries.reduce((total, entry) => total + entry.food, 0),
          entries.reduce((total, entry) => total + entry.fuel, 0),
          entries.reduce((total, entry) => total + entry.stay, 0),
          entries.reduce((total, entry) => total + entry.toll, 0),
        ], // Calculate totals for each category
        backgroundColor: ['#36A2EB', '#FF5733', '#FFCE56', '#8B1A1A'],
        borderColor: ['#36A2EB', '#FF5733', '#FFCE56', '#8B1A1A'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for total allocated vs total spent comparison
  const compareBarData = {
    labels: ['Allocated Amount', 'Spent Amount'],
    datasets: [
      {
        label: 'Amount',
        data: [totalAllocatedAmount, totalSpentAmount],
        backgroundColor: ['#36A2EB', '#FF5733'],
        borderColor: ['#36A2EB', '#FF5733'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options to adjust the y-axis ticks
  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          // Define tick values to be multiples of 2000
          stepSize: 2000, // Step size for the ticks
          beginAtZero: true, // Ensure the chart starts from zero
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-bold text-left text-blue-600 flex items-center mb-4 sm:mb-0">
        <FaChartBar className="mr-2 text-blue-600" size={30} />
        Dashboard
      </h2>
      {/* Flex container to hold the two bar charts side by side */}
      <div className="flex space-x-8">
        {/* Bar Chart for Spent Amount by Category */}
        <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '40vh', flex: 1 }}>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Spent Amount by Category</h3>
          <Bar data={barData} options={options} />
        </div>

        {/* Bar Chart for Total Allocated vs Spent */}
        <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '40vh', flex: 1 }}>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Allocated vs Spent</h3>
          <Bar data={compareBarData} options={options} />
        </div>
      </div>

      {/* Table to Display Saved Data */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Saved Spent Data</h3>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Allocated Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Spent Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Food</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Fuel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Stay</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Toll</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((entry, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.transaction}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.allocatedAmount}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.spentAmount}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.food}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.fuel}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.stay}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.toll}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-700">No more records</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
