import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

import Bot from "./Bot";
import JobAdd from "./JobAdd";

const defaultJobs = [
    {id: 0, name: 'All'},
    {id: 6, name: 'C'},
    {id: 448, name: 'Assembly'},
    {id: 320, name: 'C++'},
    {id: 31, name: 'Linux'},
    {id: 336, name: 'UNIX'},
    {id: 508, name: 'x86'},
];

ReactDOM.render(
  <React.StrictMode>
      <div>
          <Bot/>
      </div>

  </React.StrictMode>,
  document.getElementById('root')
);



