import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import App from './App';
import Customize from './routes/customize';
import Library from './routes/library';
import Create from './routes/create';
import Video from './routes/video';
import reportWebVitals from './reportWebVitals';
import gqlClient from '../src/services';
import {ApolloProvider} from '@apollo/client';
import frontEndConfig from './config';

console.log(`🧙 Started Gource Wizard Client server at ${frontEndConfig.url}`);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={gqlClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="library" element={<Library />} />
          <Route path="create" element={<Create />} />
          <Route path="customize" element={<Customize />} />
          <Route path="video" element={<Video />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
