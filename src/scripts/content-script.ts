import { createApp } from "vue";
import "../style.css";
import PageInspector from "../components/PageInspector.vue";

window.addEventListener("DOMContentLoaded", async () => {
  const app = document.createElement("div");
  document.body.append(app);
  createApp(PageInspector).mount(app);
});
