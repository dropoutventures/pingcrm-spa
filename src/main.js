import { createApp, h, watch } from 'vue';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { plugin as formkitPlugin, defaultConfig as formkitDefaultConfig } from '@formkit/vue';
import formkitConfig from '../formkit.config.js';

import { Capacitor } from '@capacitor/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SuppressLongpressGesture } from 'capacitor-suppress-longpress-gesture';

import { trail, defineRoutes, route, current } from "momentum-trail";
import routes from './routes.json';
const APP_URL = ((!/^https?:\/\//i.test(import.meta.env.VITE_APP_URL)) ? 'https://' : '') + import.meta.env.VITE_APP_URL.replace(/\/$/, '');
routes.url = APP_URL;
defineRoutes(routes);

import './tailwind.css';

import axios from 'axios';
axios.defaults.withCredentials = true;

import { store } from '@/state.js';

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'x-Inertia': true,
};

console.log('csrfToken Initial State:', store.csrfToken);
watch(() => store.csrfToken, (csrfToken) => {
    if (!csrfToken) {
        console.log('refetch csrfToken', csrfToken);
        axios.get(route('sanctum.csrf'), {
            headers: defaultHeaders
        })
            .then(response => {
                console.log('csrf-cookie', response.headers['x-csrf-token']);
                store.csrfToken = response.headers['x-csrf-token'];
            });
    }
});

axios.interceptors.request.use(
    async (config) => {
        if (Capacitor.isNativePlatform()) {
            // config.headers['Authorization'] = '<API_TOKEN_HERE>';
            try {
                // let token = await SecureStoragePlugin.get({key: 'csrfToken'});
                config.headers['x-csrf-token'] = store.csrfToken;
            } catch (e) {
                console.error('SecureStorage Error', e);
            }
        }
        config.headers['x-referer'] = window.location.pathname;
        console.log('Request', config);
        return config;
    }
);

axios.interceptors.response.use(
    async (response) => {
        // If it includes X-CSRF-Token, Save That To Storage
        if (!!response.headers['x-csrf-token']) {
            if (Capacitor.isNativePlatform()) {
                // Is It Should Replacing??
                store.csrfToken = response.headers['x-csrf-token'];
                // await SecureStoragePlugin.remove({ key: 'csrfToken' });
                // await SecureStoragePlugin.set({ key: 'csrfToken', value: response.headers['x-csrf-token'] });
            }
        }
        console.log('Response', response);
        return response
    }
);

if (Capacitor.isNativePlatform()) {
    document.getElementById("app").dataset.isNativePlatform = Capacitor.getPlatform();

    await StatusBar.setStyle({style: Style.Dark});
    SuppressLongpressGesture.deactivateService();
    SafeArea.getSafeAreaInsets().then(({insets}) => {
        for (const [key, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(
                `--safe-area-inset-${key}`,
                `${value}px`,
            );
        }
    });
    SafeArea.addListener('safeAreaChanged', data => {
        const { insets } = data;
        for (const [key, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(
                `--safe-area-inset-${key}`,
                `${value}px`,
            );
        }
    });
}

// import md5 from 'crypto-js/md5'; // This Is How The X-Inertia-Version Is Generated

axios.get(
    APP_URL + window.location.pathname + window.location.search,
    {
        mode: "cors",
        credentials: "include",
        withCredentials: true,
        headers: defaultHeaders
    }
)
    .catch(async (error) => {
        console.log('error', error);
        return await axios.get(
            route('login'),
            {
                mode: "cors",
                credentials: "include",
                withCredentials: true,
                headers: defaultHeaders
            }
        );
    })
    .then(async (response) => {
        document.getElementById("app").dataset.page = JSON.stringify(response.data);
        await createInertiaApp({
            title: (title) => (!!title ? `${title} - ` : '') + import.meta.env.VITE_APP_NAME,
            resolve: (name) => resolvePageComponent(`./views/${name}.vue`, import.meta.glob('./views/**/*.vue')),
            setup({el, App, props, plugin}) {
                createApp({render: () => h(App, props)})
                    .mixin({methods: {route, current}})
                    .use(trail, {routes})
                    .use(plugin)
                    .use(formkitPlugin, formkitDefaultConfig(formkitConfig))
                    .mount(el)
            },
        });
        delete document.getElementById("app").dataset.page;
    });

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.info(`Response Error ${error.response.status}`);
        // TODO: If the Tokens get expired, we should retry with the CSRF endpoint
        switch (error.response.status) {
            case 401:
                console.error('Interceptor 401');
                window.location.href = route('login');
                break;
            case 419:
                console.info('Interceptor 419');
                break;
            case 404:
                // TODO: Redirect to 404 Page, Or Show 404 Page
                break;
        }
        return Promise.reject(error);
    }
);