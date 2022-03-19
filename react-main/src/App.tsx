import React from "react";
import "./App.css";
import { registerMicroApps, start } from "qiankun";

const microApp = [
  {
    name: "react app", // app name registered
    entry: "http://localhost:3002",
    container: "#younMain",
    activeRule: "/react-child",
  },
  {
    name: "vue3 app",
    entry: "http://localhost:3003",
    container: "#younMain",
    activeRule: "/vue3-child",
  },
];
registerMicroApps(microApp);
start({
  sandbox: { strictStyleIsolation: true }, //  主应用与子应用样式隔离
});
function App() {
  return (
    <div className="App">
      <div className="header">公共部分</div>
      <div className="test">样式隔离测试, 主应用是绿色，子应用使用红色</div>
      <div className="application">
        {microApp.map((item) => (
          <div className="list" key={item.name}>
            <a href={item.activeRule}>{item.name}</a>
          </div>
        ))}
      </div>
      <div id="younMain">
        <p>主应用的中预留微应用位置</p>
      </div>
    </div>
  );
}

export default App;
