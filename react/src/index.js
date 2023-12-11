import React from 'react';
import ReactDOM from 'react-dom/client';
import './asset/index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from './App';
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UserCenter from "./page/UserCenter";
import MarkdownUpdate from "./page/MarkdownUpdate";
import MarkdownAdd from "./page/MarkdownAdd";
import Bookmark from "./page/Bookmark";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-center" element={<UserCenter />} />
        <Route path="/markdown/update/:id" element={<MarkdownUpdate />} />
        <Route path="/markdown/add" element={<MarkdownAdd />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

