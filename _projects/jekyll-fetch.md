---
layout: project
links:
  code:
    url: "https://github.com/pcouy/jekyll-fetch"
    name: Code
---

# Jekyll Fetch

{{ page.links.code.url | append: "/raw/main/README.md" | fetch }}
