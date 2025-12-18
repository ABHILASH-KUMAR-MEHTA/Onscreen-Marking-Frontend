import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";

// Register necessary chart elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({user,analytical,analyticEval}) => {

  const [responseData, setResponseData] = useState([])
  // const [dataSets, setdataSets] = useState({})
console.log(user)
console.log(analytical)
console.log(analyticEval)
  useEffect(() => {
    // try {
    //   async function fetchData() {
    //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytic/getadminanalytics`);
    //     setResponseData(response.data)
    //   }
    //   fetchData();
    // } catch (error) {
    //   toast.error(error?.message)
    // }

   setResponseData(analytical)
  }, [analytical]);

 
     const dataSets = {
    Users: { labels: ["Admin", "Evaluator", "Moderator"], data: [responseData.totalUsers] },
    Tasks: {
      labels: ["Pending", "Completed", "In Progress"],
      data: [responseData.tasks],
    },
    // Schemas: { labels: ["Schema A", "Schema B", "Schema C"], data: [5, 8, 12] },
    Courses: { labels: ["Math", "Science", "English"], data: [responseData.courses] },
    Subjects: { labels: ["Class 1", "Class 2", "Class 3"], data: [responseData.subjects] },
    // Booklets: { labels: ["Booklet A", "Booklet B"], data: [100, 150] },
    // ResultGenerated: { labels: ["Results Generated"], data: [100] },
    // ScannedData: { labels: ["Scanned Data"], data: [150] },
  };
  

 
  // console.log(dataSets)




  const labels = Object.keys(dataSets);
  
  // Generate dataset dynamically by summing up the `data` array for each category
  const processedData = labels.map((category) =>
    dataSets[category].data.reduce((acc, val) => acc + val, 0)
);
// console.log(processedData)

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };

    // Initial check on mount
    checkDarkMode();

    // Add event listener for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };

  }, []);

  // Bar chart data
  const data = {
    labels, // X-axis labels dynamically generated
    datasets: [
      {
        label: "Total Count",
        data: processedData, // Summed data for each category
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options with dark mode and legend at the bottom
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
          color: isDarkMode ? "white" : "black",
        },
      },
      title: {
        display: true,
        text: "Overall Statistics",
        font: {
          size: 18,
        },
        color: isDarkMode ? "white" : "black",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
