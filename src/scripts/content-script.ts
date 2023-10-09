import { createApp } from "vue";
import "../style.css";
import Inspector from "../components/DomInspector.vue";

window.addEventListener("DOMContentLoaded", async () => {
  const app = document.createElement("div");
  document.body.append(app);
  createApp(Inspector).mount(app);
});
