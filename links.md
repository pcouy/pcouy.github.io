---
layout: default
title: Links / Resources directory
---

This a growing directory of links I have found useful or interesting. You will mainly find
blog-posts, git repositories, security write-ups, scientific papers and learning resources.

The list is presented in no particular order. The tags are not filterable yet (I
intend to add this later though). I still have a lot of saved links to filter
and tag.

The displayed dates are either the date of publication (if Wallabag managed to
find it in the page's metadata) or the time I added the link to my
[Wallabag](https://wallabag.org/) instance.

<!--The list is filterable using tags and the form below. You can bookmark specific
sets of filters (this makes use of the URL hash). Newest additions will appear
first.-->

<div>
<details>
<summary>I've collected and tagged these links using wallabag. Click to show the
bash script and SQL query I used to export them as CSV.</summary>
<pre>
#!/bin/bash

docker compose exec -u postgres postgres psql -U postgres wallabag -c "\\copy (
    SELECT
        e.url,
        e.title,
        TO_CHAR(COALESCE(e.published_at, e.created_at), 'YYYY-MM-DD') AS date,
        STRING_AGG(t.slug, ',') as tag_slugs
    FROM wallabag_entry e
    LEFT JOIN wallabag_entry_tag et ON e.id=et.entry_id
    LEFT JOIN wallabag_tag t ON et.tag_id=t.id
    INNER JOIN wallabag_entry_tag ett ON ett.entry_id=e.id
    WHERE
    ett.tag_id IN (SELECT id FROM wallabag_tag WHERE slug='share')
    AND t.slug <> 'share'
    GROUP BY e.url, e.title, date
    ORDER BY date DESC, COUNT(t.slug) DESC
) TO /var/lib/postgresql/shared_links.csv WITH (FORMAT CSV, HEADER);" && \
docker compose cp postgres:/var/lib/postgresql/shared_links.csv .
</pre>
</details>
</div>

## List

<ul>
{% for link in site.data.links %}
<li data-tags="{{ tags }}">
<a href="{{ link.url }}">{{ link.title }}</a> ({{ link.date }})
{% assign tags = link.tag_slugs| split: ',' %}
{% for tag in tags %}
<span class="link_tag">{{tag}}</span>
{% endfor %}
</li>
{% endfor %}
</ul>
