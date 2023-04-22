import React from 'react';
import { saveAs } from 'file-saver';
import pdfjsLib from 'pdfjs-dist';

const FileImport = () => {
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
  };

  const parsePdf = (pdfData) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';

    pdfjsLib.getDocument({ data: pdfData }).promise.then((pdf) => {
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then((page) => {
          page.getTextContent().then((textContent) => {
            const textItems = textContent.items.map((item) => item.str);
            const pageText = textItems.join(' ');
            pages.push(pageText);

            if (pages.length === pdf.numPages) {
              const text = pages.join(' ');
              const jsonData = { text };
              downloadJson(jsonData);
            }
          });
        });
      }
    });
  };

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
