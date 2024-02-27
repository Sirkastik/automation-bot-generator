import { createApp } from 'vue'
import PageInspector from '../components/PageInspector.vue'
import '../style.css'

window.addEventListener('DOMContentLoaded', async () => {
  const app = document.createElement('div')
  document.body.append(app)
  createApp(PageInspector).mount(app)
})
