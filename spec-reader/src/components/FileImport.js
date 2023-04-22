import React from "react";
import { saveAs } from "file-saver";
import pdfjsLib from "pdfjs-dist";

const FileImport = () => {
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
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item) => item.str);
      const pageText = textItems.join(' ');
      pages.push(pageText);
      if (pages.length === pdf.numPages) {
        const text = pages.join(' ');
        console.log(text);
        const jsonData = { text };
        const response = await fetch('http://localhost:3001/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        });
        const data = await response.json();
        console.log(data);
      }
    }
  };
  
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

  //Function to download json as a JSON File
    const downloadText = (data) => {
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "data.txt");
    };

  //Function to save in local storage
    const saveToLocalStorage = (data) => {
        localStorage.setItem("data", data); const json = JSON.stringify(data);
        localStorage.setItem('myData', json);
        const jsonData = JSON.parse(localStorage.getItem('myData'));
        console.log(jsonData);
    };
  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileImport;
