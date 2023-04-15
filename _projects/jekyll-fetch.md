---
layout: project
links:
  code:
    url: "https://github.com/pcouy/jekyll-fetch"
    name: Code
tags: jekyll
description:
  Jekyll plugin providing a filter that replaces URLs with the raw response body from fetching that URL over HTTP(s).


  Used to include `README.md` files from my projects on this website.
---

{{ page.links.code.url | append: "/raw/main/README.md" | fetch }}
