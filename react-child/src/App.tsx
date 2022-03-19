import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import News from "./News";

function App() {
  return (
    <div className="App">
      <BrowserRouter
        basename={window.__POWERED_BY_QIANKUN__ ? "/react-child" : "/"}
      >
        {/* 使用 Routes 替换曾经的 Switch */}
        <Link to="/">首页</Link>
        <Link to="/news">新闻</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </BrowserRouter>
      <h3>当前是react child</h3>
    </div>
  );
}

export default App;
