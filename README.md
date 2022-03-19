# webpack5最基础微服务（qiankun）搭建流程


[乾坤官方](https://qiankun.umijs.org/zh/guide)  


前言： 为什么有那么多手把手教搭建的还要出一个教程，是因为当前我在搭建的时候用的是最新的脚手架搭建的，所以用的webpack也是最新的webpack 5x（用craco代替eject方式配置），在用qiankun官方的方法会报错，这是因为在webpage5中更改了一个属性（jsonpFunction --> chunkLoadingGlobal），所以**为了让遇到跟我同样问题的人少走点弯路   **  


## qiankun搭建流程
已精简为最基础的搭建方法

### 先创建主应用
1、 用脚手架创建react主应用
```
npx create-react-app react-child --template typescript
```
2、安装qiankun
```
yarn add qiankun
```
3、注册微应用并启动：
在App.tsx中创建如下文件（可自行更改）
```
import { registerMicroApps, start } from "qiankun";
const microApp = [
  {
    name: "react app", // app的名称
    entry: "http://localhost:3002", // 子应用的启动地址
    container: "#younMain", // 加载子应用的容器
    activeRule: "/react-child", //跳转路由（在子系统需要对应 <BrowserRouter
        basename={window.__POWERED_BY_QIANKUN__ ? "/react-child" : "/"}
      >）
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
```
4、在主应用中创建跳转和公共部分
```
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
```
### 创建react 微应用
1、 用脚手架创建react
```
npx create-react-app react-child --template typescript
```
2、安装路由
```
yarn add react-router-dom 
我安装的版本是6.2.2
```
3、安装craco替换webpack
```
yarn add @craco/craco 
我安装的版本是6.4.3
```
4、在根目录创建craco.config.js
```
const { name } = require("./package");

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = "umd";
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;

      return config;
    },
  },
  devServer: {
    port: 3002,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
    hot: true,
    liveReload: false,
  },
};

```
5、在src下创建public-path.ts
```

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export {}
遇到__POWERED_BY_QIANKUN__报错等问题直接在react-app-env.d.ts中加入类型申明

interface Window {
  __POWERED_BY_QIANKUN__: any;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: any;
}
declare let __webpack_public_path__;
```
6、修改index.tsx
```
import './public-path';

function render(props: any) {
  const { container } = props;
  ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props: any) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props: any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
```
7、添加路由
```
<BrowserRouter
        basename={window.__POWERED_BY_QIANKUN__ ? "/react-child" : "/"}  // react-childt 对应的就是主应用注册app中的activeRule
      >
        {/* 使用 Routes 替换曾经的 Switch */}
        <Link to="/">首页</Link>
        <Link to="/news">新闻</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </BrowserRouter>
```
#### 创建vue微应用（vue3）
1、用脚手架创建vue项目
```
npx @vue/cli create vue3-demo
```
2、修改配置文件vue.fonfig.js
```
const { defineConfig } = require("@vue/cli-service");
const { name } = require("./package");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3003,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
  },
});

```
3、创建public-path.ts
```

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export {}
遇到__POWERED_BY_QIANKUN__报错等问题直接在shims-vue.d.ts中加入类型申明

interface Window {
  __POWERED_BY_QIANKUN__: any;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: any;
}
declare let __webpack_public_path__;
```
4、修改main.ts
```
import "./public-path";
interface PropsIF {
  container?: RendererElement;
}

let instance: App<Element> | null;
function render(props: PropsIF = {}) {
  const { container } = props;
  instance = createApp(AppEl);
  instance.use(store);
  instance.use(router);
  instance.mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}
export async function mount(props: PropsIF) {
  console.log("[vue] props from main framework", props);
  render(props);
}
export async function unmount() {
  instance?.unmount();
  instance = null;
}

```

[项目demo地址：https://github.com/youchaojun/qiankun-demo](https://github.com/youchaojun/qiankun-demo)