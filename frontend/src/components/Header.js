import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
        <h1 className='mainTitle'>My Project Management Tools</h1>
        <div className='navBar'>
            <Link to='/'>Home</Link>
            <Link to='/keywords'>Documents Keywords Analyzer</Link>
            <Link to='/pmgpt'>PM GPT</Link>
   
            </div>
    </div>
    
  )
}

export default Header