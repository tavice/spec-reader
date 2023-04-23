
import './App.css';
import React, {useState} from 'react';

//Import Components
import FileImport from './components/FileImport';

//Import Axios
import axios from 'axios';



function App() {
  const [keywords, setKeywords] = useState([]);
  
  
 

  return (
    
   <div>

      <FileImport keywords={keywords} />
    </div>
  );
};

export default App;
