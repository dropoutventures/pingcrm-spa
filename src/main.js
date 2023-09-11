import { createApp, h } from 'vue';
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

axios.interceptors.request.use(
    async (config) => {
        if (Capacitor.isNativePlatform()) {
            // config.headers['Authorization'] = '<API_TOKEN_HERE>';
            try {
                let token = await SecureStoragePlugin.get({key: 'csrfToken'});
                config.headers['x-csrf-token'] = token.value;
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
                await SecureStoragePlugin.remove({ key: 'csrfToken' });
                await SecureStoragePlugin.set({ key: 'csrfToken', value: response.headers['x-csrf-token'] });
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

const loginPageData = {
    "component": "Auth\/Login",
    "props": {
        "errors": {},
        "auth": {
            "user": null
        },
        "flash": {
            "success": null,
            "error": null
        }
    },
    "url": "\/login",
    "version": ""
};

axios.get(
    APP_URL + window.location.pathname + window.location.search,
    {
        mode: "cors",
        credentials: "include",
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-Inertia': true,
        }
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
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-Inertia': true,
                }
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
            default:
                return Promise.reject(error);
        }
    }
);