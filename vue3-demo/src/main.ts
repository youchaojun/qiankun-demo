import { App, createApp, RendererElement } from "vue";
import AppEl from "./App.vue";
import router from "./router";
import store from "./store";
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
