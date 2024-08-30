---
layout: post
title:  "Increase privacy by using nginx as caching proxy in front of a map tile proxy server"
tags: linux nginx tutorial privacy selfhosting
categories:
  - Server admin
description: A tutorial featuring two examples showing how you can increase your privacy using nginx to proxy third-party services.
image: media/banner-rpi-eth-monitor.jpg
---

If you are self-hosting any service, chances are that you care about
increasing your privacy by minimizing your reliance on third-party services. If
this is the case, you may be bothered when an application you are hosting relies
on such third-parties. This can be the case when some features are too resource
intensive for personal servers.

One example of this is map tile servers, which are relied upon for map features
in a variety of software, such as [Immich](https://immich.app/) (awesome Google Photos replacement !).
Such tile servers host a whole world map at several zoom level, and provide
clients with map fragments (tiles) for the requested coordinates and zoom
level.
Unfortunately, it is not easy to host such a tile server : the [easiest solution
I could find](https://protomaps.com/) still require more than 100GB of disk
space to serve a full world map. On the other hand, using a third party for this
makes clients send a bunch of requests to them. This requests will give the
third-party details about any location viewed on the map. It will also generally
include other informations, such as the URL you're viewing the map from and the
client's IP address.

This article will show how to build a caching reverse proxy in order to mitigate these
privacy concerns while avoiding the need to host more than 100GB of map data.
As a concrete application, the caching proxy will then be used as a tile
provider for an Immich instance.

## Why do this



Hosting a caching proxy between the clients and the tile provider can bring
several general benefits :

- Limit the amount of personally identifiable information (PII) sent to the tile
  provider by using the Immich instance's IP address and stripping the
  `Referer` header
- Limit the frequency at which PII is sent to the tile provider by caching tiles
  that have already been loaded through the proxy
- The decreased load on the upstream tile provider makes it reasonable to use Open
  Street Map's tile server as the upstream provider
- The upstream provider will not be able to differentiate between several users
  of the same proxy

In addition, there are a few Immich specific advantages (which may apply to
other similar software) :

- If you do not need the map displaying your photos to be perfectly up to date,
  you can set an arbitrarily long caching duration
- Most use cases for the map will frequently zoom on the same areas, which makes
  it a good fit for a cache

## Tutorial

This guide will use [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
to build a caching proxy in front of Open Street Map's tileserver and to serve a custom
`style.json` for the maps.

This works if you already proxy your services behind an Nginx instance.
It is probably possible to achieve similar results with other reverse proxies,
but this would obviously need to be adapted.

While this guide is directed towards Immich users, the nginx configuration can
be easily used with other applications. As long as it provides a way to switch
tile providers, you should be able to use your proxy with it.

### Caching proxy

Inside Nginx's `http` config block (usually in `/etc/nginx/nginx.conf`), create
a cache zone (a directory that will hold cached responses from OSM) :

```nginx
http {
    # You should not need to edit existing lines in the http block, only add the line below
    proxy_cache_path /var/cache/nginx/osm levels=1:2 keys_zone=osm:100m max_size=5g inactive=180d;
}
```

You may need to manually create the `/var/cache/nginx/osm` directory and set its
owner to Nginx's user (typically `www-data` on Debian based distros).

Customize the `max_size` parameter to change the maximum amount of cached data
you want to store on your server. The `inactive` parameter will cause Nginx to
discard cached data that's not been accessed in this duration (180d ~ 6months).

Then, inside the `server` block that serves your Immich instance, create a new
`location` block :

```nginx
server {
    listen 443 ssl;
    server_name immich.your-domain.tld;

    # You should not need to change your existing config, only add the location block below

    location /map_proxy/ {
        proxy_pass https://tile.openstreetmap.org/;
        proxy_cache osm;
        proxy_cache_valid 180d;
        proxy_ignore_headers Cache-Control Expires;
        proxy_ssl_server_name on;
        proxy_ssl_name tile.openstreetmap.org;
        proxy_set_header Host tile.openstreetmap.org;
        proxy_set_header User-Agent "Nginx Caching Tile Proxy for self-hosters";
        proxy_set_header Cookie "";
        proxy_set_header Referer "";
    }
}
```

Reload Nginx (`sudo systemctl reload nginx`). Confirm this works by visiting
`https://immich.your-domain.tld/map_proxy/0/0/0.png`, which should now return a
world map PNG (the one from https://tile.openstreetmap.org/0/0/0.png )

This config ignores cache control headers from OSM and sets its own cache
validity duration (`proxy_cache_valid` parameter). After the specified duration,
the proxy will re-fetch the tiles. 6 months seem reasonable to me for the use
case, and it can probably be set to a few years without it causing issues.

Besides being lighter on OSM's servers, the caching proxy will improve privacy
by only requesting tiles from upstream when loaded for the first time. This
config also strips cookies and referrer before forwarding the queries to OSM, as
well as set a user agent for the proxy following [OSM foundation's
guidelines](https://operations.osmfoundation.org/policies/tiles/) (according to
these guidelines, you should add a contact information to this user agent)

This can probably be made to work on a different domain than the one serving
your Immich instance, but this will require tweaking CORS headers.

### Custom `style.json`

The following map style can be used to replace Immich's default tile provider
with your caching proxy :

```json
{
  "version": 8,
  "name": "Immich Map",
  "sources": {
    "immich-map": {
      "type": "raster",
      "tileSize": 256,
      "tiles": ["https://immich.your-domain.tld/map_proxy/{z}/{x}/{y}.png"]
    }
  },
  "sprite": "https://maputnik.github.io/osm-liberty/sprites/osm-liberty",
  "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "raster-tiles",
      "type": "raster",
      "source": "immich-map",
      "minzoom": 0,
      "maxzoom": 22
    }
  ],
  "id": "immich-map-dark"
}
```

Replace `immich.your-domain.tld` with your actual Immich domain, and remember
the absolute path you save this at on your server.

### One last update to nginx's config

Since Immich currently does not provide a way to manually edit `style.json`, we
need to serve it from http(s). Add one more `location` block below the previous
one :

```nginx
location /map_style.json {
    alias /srv/immich/mapstyle.json; # This needs to be the location where you saved the file from the previous step
}
```

Replace the `alias` parameter with the location where you saved the json
map style. After reloading nginx, your json style will be available at
`https://immich.your-domain.tld/map_style.json`. You can now use this URL to
your style as both the light and dark themes in your instance's settings.
