---
layout: project
links:
  code:
    url: "https://github.com/pcouy/jekyll-picture-tag-ng"
    name: Code
  demo:
    url: "https://crocodile-couture.fr"
    name: Demo
tags: jekyll imagemagick responsive
description:
  Jekyll plugin that overloads the default `kramdown` parser to turn basic images into HTML `picture` tags providing different sizes for the pictures.
  
  
  Pictures of different sizes will be auto-generated at build-time using `imagemagick` according to the configuration.
---

{{ page.links.code.url | append: "/raw/main/README.md" | fetch }}
