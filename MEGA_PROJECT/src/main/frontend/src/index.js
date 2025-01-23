import React from "react";
import ReactDOM from "react-dom/client"; // 'react-dom/client'에서 createRoot를 임포트합니다.
import App from "./App";

// 기존 root element
const rootElement = document.getElementById("root");

// createRoot를 사용하여 root를 생성하고 render 호출
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
