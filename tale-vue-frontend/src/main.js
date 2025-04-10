import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const app = createApp(App);
const pinia = createPinia()

app.use(pinia);
app.use(router);
app.use(Toast);

app.mount('#app');
