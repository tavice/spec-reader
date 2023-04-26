import React, { useState } from "react";
import { saveAs } from "file-saver";
import pdfjsLib from "pdfjs-dist";

//import css
import "../styles/FileImport.css";

//Import TagCLoud
import { TagCloud } from "react-tagcloud";
//import 'react-tagcloud/dist/styles.min.css';

//Import Chart
import Chart from "chart.js/auto";

const FileImport = () => {
  const [keywords, setKeywords] = useState([]);

  //Function to handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const pdfData = new Uint8Array(arrayBuffer);
        parsePdf(pdfData);
      };
    }

    console.log(file);
  };

  //Function to parse pdf
  const pdfjs = require("pdfjs-dist/build/pdf");

  const parsePdf = async (pdfData) => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item) => item.str);
      const pageText = textItems.join(" ");
      pages.push(pageText);
      if (pages.length === pdf.numPages) {
        const text = pages.join(" ");
        console.log(text);
        const jsonData = { text };
        const response = await fetch("http://localhost:3001/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();
        
        //check if data is received
        console.log(data);

        //update chart
        updateChart(data.tagCloudHTML);

        //update keywords
        if (data.keywords) {
          setKeywords((prevKeywords) => [
            ...prevKeywords,
            ...data.keywords.map((keyword) => ({ value: keyword })),
          ]);
        }

        //update tag cloud
        saveToLocalStorage(data.tagCloud);
       
      }
    }
  };

  //function to get the words in a cloud version
  function updateChart(tagCloud) {
    const canvas = document.getElementById("my-canvas");
    const ctx = canvas.getContext("2d");

    const chartData = {
      labels: Object.keys(tagCloud),
      datasets: [
        {
          label: "Tag Cloud",
          backgroundColor: "rgba(63, 191, 255, 0.5)",
          borderColor: "rgba(63, 191, 255, 1)",
          borderWidth: 1,
          data: Object.values(tagCloud),
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 0.1,
            },
          },
        ],
      },
    };

    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: options,
    });
  }

  //
  function onCloudDraw(canvas) {
    console.log("Canvas has been rendered:", canvas);
  }

  //Function to download json as a JSON File
  const downloadJson = (data) => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click(); // This will download the data file named "my_data.json".
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // console.log(json);
    // console.log(blob);
    // console.log(url);
  };

  //Function to download json as a text File
  const downloadText = (data) => {
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "data.txt");
  };

  //Function to save in local storage
  const saveToLocalStorage = (data) => {
    localStorage.setItem("data", data);
    const json = JSON.stringify(data);
    localStorage.setItem("myData", json);
    const jsonData = JSON.parse(localStorage.getItem("myData"));
    console.log(jsonData);
  };

  console.log("keywords are", keywords);

  return (
    <div className="file-import-container">
      <input type="file" className="file-input" onChange={handleFileChange} />
      <div className="tag-cloud-container">
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={keywords.map((keyword, index) => ({
            value: keyword,
            count: index + 1,
          }))}
          className="simple-cloud"
          onClick={(tag) => console.log(`'${tag.value}' was selected!`)}
          onTagDraw={(tag, canvas) => {
            canvas.fillStyle = tag.color;
            canvas.font = `${tag.size}px sans-serif`;
          }}
          onCanvasDraw={onCloudDraw}
        />
        <canvas id="my-canvas" />
      </div>
      <div className="button-group">
        <button className="download-btn" onClick={() => downloadJson(keywords)}>
          Download JSON
        </button>
        <button className="download-btn" onClick={() => downloadText(keywords)}>
          Download Text
        </button>
        <button
          className="download-btn"
          onClick={() => saveToLocalStorage(keywords)}
        >
          Save to Local Storage
        </button>
      </div>
    </div>
  );
};

export default FileImport;
