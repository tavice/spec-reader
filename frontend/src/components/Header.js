import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'

const Header = () => {
  return (
    <div className='header'>
      <h1 className='main-title'>My Project Management Tools</h1>
      <nav className='nav-bar'>
        <Link to='/' className='nav-link'>Home</Link>
        <Link to='/keywords' className='nav-link'>Documents Keywords Analyzer</Link>
        <Link to='/pmgpt' className='nav-link'>PM GPT</Link>
      </nav>
    </div>
  );
};

export default Header;
