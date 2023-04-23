
import './App.css';
import React, {useState} from 'react';

//Import Components
import Header from './components/Header';
import Footer from './components/Footer';

//Import Pages
import FileImport from './pages/FileImport';

//Import Axios
import axios from 'axios';



function App() {
  const [keywords, setKeywords] = useState([]);

  
 

  return (
    
   <div>
      <Header />
      <FileImport keywords={keywords} />
      <Footer />
    </div>
  );
};

export default App;
