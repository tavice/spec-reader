import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import pdfjsLib from "pdfjs-dist";

//import css
import "../styles/FileImport.css";





const FileImport = () => {
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

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
        const response = await fetch("http://localhost:3001/PDF", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();

        //check if data is received
        console.log(data);

        //saveToLocalStorage(data);
        //downloadJson(data);
        //downloadText(data);
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

  //Function to download json as a text File
  const downloadText = (data) => {
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "data.txt");
  };

  //Function to save in local storage
  const saveToLocalStorage = (data) => {
    const json = JSON.stringify(data);
    localStorage.setItem("myData", json);
    const jsonData = JSON.parse(localStorage.getItem("myData"));
    console.log(jsonData);
  };




  //The next function we will build the chat message
  //

  const handleInput = (e) => {
    setInput(e.target.value);
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // make POST request to backend API
    const response = await fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input }),
    });

    // get response from backend API and add it to messages
    const data = await response.json();
    setMessages([...messages, { sender: "user", text: input }]); // add user message
    setMessages([...messages, { sender: "chatbot", text: data.message }]); // add chatbot message

    // clear input field
    setInput("");
  };

  //console.log(messages);



  return (
    <div className="file-import-container">
      <input type="file" className="file-input" onChange={handleFileChange} />
      
      <div>
      {messages.map((message, i) => (
        <div key={i}>
          <span>{message.sender}: </span>
          <span>{message.text}</span>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInput} />
        <button type="submit">Send</button>
      </form>
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
