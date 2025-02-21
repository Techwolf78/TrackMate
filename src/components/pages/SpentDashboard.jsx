import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { FaChartBar } from "react-icons/fa";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Link } from 'react-router-dom'; // Add Link for routing

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 11;

  useEffect(() => {
    const fetchData = () => {
      const spentRef = ref(db, 'sales_spent/');
      onValue(spentRef, (snapshot) => {
        const data = snapshot.val();
        const loadedData = [];
        for (let key in data) {
          loadedData.push({
            id: key,
            ...data[key]
          });
        }
        setEntries(loadedData);
      });
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(entries.length / recordsPerPage);
  const currentEntries = entries.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalAllocatedAmount = entries.reduce((total, entry) => total + parseFloat(entry.allocatedAmount || 0), 0);
  const totalSpentAmount = entries.reduce((total, entry) => total + parseFloat(entry.spentAmount || 0), 0);

  const barData = {
    labels: ['Food', 'Fuel', 'Stay', 'Toll'],
    datasets: [
      {
        label: 'Total Spent Amounts',
        data: [
          entries.reduce((total, entry) => total + parseFloat(entry.food || 0), 0),
          entries.reduce((total, entry) => total + parseFloat(entry.fuel || 0), 0),
          entries.reduce((total, entry) => total + parseFloat(entry.stay || 0), 0),
          entries.reduce((total, entry) => total + parseFloat(entry.toll || 0), 0),
        ],
        backgroundColor: ['#36A2EB', '#FF5733', '#FFCE56', '#8B1A1A'],
        borderColor: ['#36A2EB', '#FF5733', '#FFCE56', '#8B1A1A'],
        borderWidth: 1,
      },
    ],
  };

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

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 2000,
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Keep the legend visible
        labels: {
          boxWidth: 0, // Removes the color box next to the labels
          font: {
            size: 14, // Change font size if you want
          },
        },
      },
    },
  };
  

  const getValueOrZero = (value) => {
    if (value === null || value === undefined) return '0'; // Return '0' if value is null or undefined
    if (typeof value === 'string') return value || '0'; // If value is a string (e.g., college name), return it
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? '0' : numericValue.toFixed(2); // Format number to 2 decimal places or return '0' if NaN
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-inter">
      <div className="block md:hidden bg-yellow-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Please open this section on a large screen only.</h3>
      </div>
      <div className="hidden md:block">
        <h2 className="text-4xl font-bold text-left text-blue-600 flex items-center mb-4 sm:mb-0">
          <FaChartBar className="mr-2 text-blue-600" size={30} />
          Dashboard
        </h2>
        <div className="mb-4 flex justify-end">
          <Link to="/clddata">
            <button className="px-6 py-3 text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700">
              College Data
            </button>
          </Link>
        </div>

        <div className="flex space-x-8">
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '40vh', flex: 1 }}>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Spent Amount by Category</h3>
            <Bar data={barData} options={options} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '40vh', flex: 1 }}>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Allocated vs Spent</h3>
            <Bar data={compareBarData} options={options} />
          </div>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">College</th>
                {/* Temporarily commented out the Additional Colleges column */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-blue-200">Additional Colleges</th> */}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((entry, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.allocatedAmount)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.spentAmount)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.food)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.fuel)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.stay)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getValueOrZero(entry.toll)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.college || 'No College'}</td>
                    {/* Temporarily commented out the Additional Colleges column data */}
                    {/* <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {entry.additionalColleges && entry.additionalColleges.length > 0
                        ? entry.additionalColleges.join(', ') // Join multiple colleges with a comma
                        : 'No additional colleges'}
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-700">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default Dashboard;
