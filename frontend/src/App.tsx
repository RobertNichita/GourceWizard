import React from 'react';
import './App.css';
import {Bar} from './components/Bar';
import {Header} from './components/Header';

function App() {
  return (
    <div>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="../dist/output.css" rel="stylesheet" />
      </head>
      <body>
        <h1 className="text-3xl font-bold underline text-blue-900">
          Graphic Design is my passion
        </h1>
        <h1>Graphic Design is not my passion</h1>
      </body>
      <p className="text-center text-3xl text-green-300">Hi iliY</p>
      <Header></Header>
      <Bar></Bar>
    </div>
  );
}

export default App;
