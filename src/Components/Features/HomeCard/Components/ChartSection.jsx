import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ChartSection = ({ darkMode }) => {
  const chartRef = useRef();
  const svgRef = useRef();

  // Sample data comparing businesses with/without online presence
  const data = [
    { category: "Revenue Growth", withPresence: 75, withoutPresence: 30 },
    { category: "Customer Reach", withPresence: 82, withoutPresence: 25 },
    {
      category: "Operational Efficiency",
      withPresence: 68,
      withoutPresence: 35,
    },
    { category: "Brand Awareness", withPresence: 79, withoutPresence: 28 },
    {
      category: "Customer Satisfaction",
      withPresence: 73,
      withoutPresence: 45,
    },
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Chart dimensions and margins
    const width = chartRef.current.clientWidth;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent");

    // Create chart group
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, width - margin.left - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.top - margin.bottom, 0]);

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(["withPresence", "withoutPresence"])
      .range([
        darkMode ? "#4f46e5" : "#3b82f6",
        darkMode ? "#ef4444" : "#dc2626",
      ]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    // X-axis
    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563");

    // Y-axis
    chartGroup
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563");

    // Replace the grid lines section with this code:
    const gridGroup = chartGroup.append("g").attr("class", "grid");

    // Manually add grid lines at specific positions (20, 40, 60, 80)
    [20, 40, 60, 80].forEach((value) => {
      gridGroup
        .append("line")
        .attr("x1", 0)
        .attr("y1", yScale(value))
        .attr("x2", width - margin.left - margin.right)
        .attr("y2", yScale(value))
        .style(
          "stroke",
          darkMode ? "rgba(229, 231, 235, 0.1)" : "rgba(0, 0, 0, 0.1)"
        )
        .style("stroke-dasharray", "3,3");
    });

    // Create grouped bars
    const categories = chartGroup
      .selectAll(".category")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "category")
      .attr("transform", (d) => `translate(${xScale(d.category)},0)`);

    // With online presence bars (blue)
    categories
      .append("rect")
      .attr("class", "bar-with")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.withPresence))
      .attr("width", xScale.bandwidth() / 2)
      .attr(
        "height",
        (d) => height - margin.top - margin.bottom - yScale(d.withPresence)
      )
      .attr("fill", colorScale("withPresence"))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        showTooltip(d, "With Online Presence", d.withPresence);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        chartGroup.selectAll(".tooltip").remove();
      });

    // Without online presence bars (red)
    categories
      .append("rect")
      .attr("class", "bar-without")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.withoutPresence))
      .attr("width", xScale.bandwidth() / 2)
      .attr(
        "height",
        (d) => height - margin.top - margin.bottom - yScale(d.withoutPresence)
      )
      .attr("fill", colorScale("withoutPresence"))
      .attr("rx", 4)
      .attr("ry", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        showTooltip(d, "Without Online Presence", d.withoutPresence);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        chartGroup.selectAll(".tooltip").remove();
      });

    // Tooltip function
    function showTooltip(d, label, value) {
      const tooltip = chartGroup
        .append("g")
        .attr("class", "tooltip")
        .attr(
          "transform",
          `translate(${xScale(d.category) + xScale.bandwidth() / 2},${
            yScale(value) - 10
          })`
        );

      tooltip
        .append("rect")
        .attr("x", -60)
        .attr("y", -40)
        .attr("width", 120)
        .attr("height", 30)
        .attr("fill", darkMode ? "#374151" : "#f3f4f6")
        .attr("rx", 4)
        .attr("ry", 4)
        .style("stroke", darkMode ? "#4f46e5" : "#3b82f6")
        .style("stroke-width", "1px");

      tooltip
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", -30)
        .style("fill", darkMode ? "#f3f4f6" : "#111827")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .text(label);

      tooltip
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", -15)
        .style("fill", darkMode ? "#f3f4f6" : "#111827")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(`${value}%`);
    }

    // Chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#f3f4f6" : "#111827")
      .text("Impact of Online Presence on Business Metrics");

    // Legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 150},${margin.top})`
      );

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", colorScale("withPresence"));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563")
      .text("With Online Presence");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 12)
      .attr("height", 12)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", colorScale("withoutPresence"));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 30)
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e5e7eb" : "#4b5563")
      .text("Without Online Presence");
  }, [darkMode]);

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div ref={chartRef} className="w-full">
          <svg ref={svgRef} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
