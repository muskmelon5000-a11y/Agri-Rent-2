window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.error("Global Error Caught:", msg, error);
  const root = document.getElementById("root");
  if (root && root.innerHTML.trim() === "") {
    root.innerHTML = `
      <div style="padding: 24px; color: #991b1b; font-family: system-ui, sans-serif; background: #fef2f2; border: 2px solid #f87171; margin: 20px; border-radius: 16px; max-width: 500px;">
        <h2 style="margin-top:0; font-size: 20px;">App Initializer Notice</h2>
        <p style="font-size: 14px;">${msg}</p>
        <button onclick="localStorage.clear(); window.location.hash='#/login'; window.location.reload();" style="padding: 10px 18px; background: #059669; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Reset & Go to Login</button>
      </div>
    `;
  }
  return false;
};

import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";

render(<App />, document.getElementById("root"));