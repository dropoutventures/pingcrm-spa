# Remote Inertia SPA
The idea behind this project is to have standalone frontends that communicate with one Laravel install.
Think of multiple storefronts that communicate to a central Orders CRM, etc etc.
Maybe this idea is completely stupid, but it seems to be working ... so here is how you can do it yourself.
*UPDATE:* 3rd-Party Cookies are no good, so we have to use subdomains instead, not a big deal.

## Laravel Setup
1) Your site should be using Laravel and Inertia JS, for this demo I used [PingCRM](https://github.com/inertiajs/pingcrm)
2) Install [Ziggy](https://github.com/tighten/ziggy) with Composer `composer require tightenco/ziggy`
3) Create an endpoint to [retrieve Ziggy's routes](https://github.com/tighten/ziggy#retrieving-ziggys-routes-and-config-from-an-api-endpoint), in `/routes/api.php`:
```php
Route::get('routes', fn () => response()->json(new Ziggy));
```
Probably we should add something to [limit which routes are sent](https://github.com/tighten/ziggy#filtering-routes).
4) In `app/Http/Middleware/HandleInertiaRequests.php` we must disable the Inertia Version that is included in the response:
```diff
public function version(Request $request) {
-  return parent::version($request);
+  return null;
}
```
We do this because the local version and remote version won't match and will cause issues.
5) In `/config/cors.php` we have to allow CORS on all paths, because we are using the same routes as the frontend, and expose the `X-Inertia` header:
```diff
return [
-  'paths' => [ 'api/*', 'sanctum/csrf-cookie' ],
+  'paths' => [ '*', 'api/*', 'sanctum/csrf-cookie' ],
    ...
-  'exposed_headers' => [],
+  'exposed_headers' => [ 'X-Inertia' ],
    ...
-   'supports_credentials' => false,
+   'supports_credentials' => true,
];
```
6) Now the main way to make this work is to make a subdomain on the same domain as the SPA so there is no issue with 3rd-party cookies, so we would do `pingfrontend.com` for the SPA and `crm.pingfrontend.com` as a domain alias for the `pingcrm.com` Laravel server. You can do this in your nginx `server_name` setting by setting it to `_`.

Here is an example of a simple route, notice the component query - this allows you to pass a custom copmonent name to be returned
```php
Route::any('/', function(Request $request) {
    return Inertia::render($request->query('component','Home'));
})->name('index');
```

## SPA Setup
All of this is already done for you inside the main.js file, but here it is again anyways...
1) For this project I used [Vite Vue3 Tailwind Starterkit](https://github.com/web2033/vite-vue3-tailwind-starter), which was pretty awesome and provides everything I'd already want in my project.
2) You'll need to install Ziggy: `npm install ziggy-js` and add it to your project:
```js
import route from 'ziggy-js'
const ZiggyRoutes = await fetch('https://crm.pingfrontend.com/api/routes').then(x => x.json())
const ZiggyRouter = (name, params) => route(name, params, true, ZiggyRoutes)
```
3) Before creating your Inertia Vue app, you'll need to fill the `data-page` attribute with the first load page data:
```js
fetch('https://crm.pingfrontend.com' + window.location.pathname + window.location.search)
```
Maybe both of these can be done in the same request, as the Routes can be included in the Inertia Request, since ideally there won't be that many routes for your project.

Here is an exampoe of a route, since the pages are loaded locally from the SPA, if the name doesn't match what ever is defaulted you'll have to send it as a query parameter:
```vue
<Link :href="route('index', { component: 'Welcome' })">Welcome Page</Link>
```
