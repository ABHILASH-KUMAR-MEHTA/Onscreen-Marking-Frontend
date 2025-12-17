import React, { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const COLORS = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
];

const BORDER_COLORS = COLORS.map(c => c.replace("0.6", "1"));

const DoughnutChart = ({ arr = [], val = [] }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apiData, setApiData] = useState({ labels: [], values: [] });

  /* ---------------- Fetch Default Data ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/analytic/getadminanalytics`
        );

        const usersByRole = res?.data?.usersByRole;
        if (usersByRole) {
          setApiData({
            labels: Object.keys(usersByRole),
            values: Object.values(usersByRole),
          });
        }
      } catch (err) {
        toast.error(err?.message || "Failed to load analytics");
      }
    };

    fetchData();
  }, []);

  /* ---------------- Dark Mode Watcher ---------------- */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* ---------------- Final Data Source ---------------- */
  const labels = arr.length ? arr : apiData.labels.length ? apiData.labels : ["Loading"];
  const values = val.length ? val : apiData.values.length ? apiData.values : [1];

  /* ---------------- Memoized Chart Data ---------------- */
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: labels.map((_, i) => BORDER_COLORS[i % BORDER_COLORS.length]),
        borderWidth: 1,
        hoverOffset: 20,
      },
    ],
  }), [labels, values]);

  /* ---------------- Memoized Options ---------------- */
  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          color: isDarkMode ? "#fff" : "#000",
        },
      },
      title: {
        display: true,
        text: "Category-Wise Distribution",
        font: { size: 18 },
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    animation: {
      duration: 300,
      easing: "easeOutQuart",
    },
  }), [isDarkMode]);

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
