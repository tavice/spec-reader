import React from 'react';
import { saveAs } from 'file-saver';
import pdfjsLib from 'pdfjs-dist';

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
  const pdfjs = require('pdfjs-dist/build/pdf');

  const parsePdf = async (pdfData) => {
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
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
        const jsonData = { text };
        downloadJson(jsonData);
      }
    }

    console.log(pages);
    console.log(pdf);
  };
  
 
    //Function to download json
  const downloadJson = (jsonData) => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'pdfText.json');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileImport;
