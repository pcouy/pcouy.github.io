---
layout: default
title: Links / Resources directory
---

This a growing directory of links I have found useful or interesting. You will mainly find
blog-posts, git repositories, security write-ups, scientific papers and learning resources.

The list is presented in no particular order. The tags are not filterable yet (I
intend to add this later though). I still have a lot of saved links to filter
and tag.

<!--The list is filterable using tags and the form below. You can bookmark specific
sets of filters (this makes use of the URL hash). Newest additions will appear
first.-->

<div>
<details>
<summary>I've collected and tagged these links using wallabag. Click to show the
SQL query I used to export them.</summary>
<pre>
SELECT e.url, e.title, STRING_AGG(t.slug, ',') as tag_slugs FROM wallabag_entry e
  LEFT JOIN wallabag_entry_tag et ON e.id=et.entry_id
  LEFT JOIN wallabag_tag t ON et.tag_id=t.id
  INNER JOIN wallabag_entry_tag ett ON ett.entry_id=e.id
  WHERE 
    ett.tag_id IN (SELECT id FROM wallabag_tag WHERE slug='share')
    AND t.slug <> 'share'
  GROUP BY e.url, e.title
  ORDER BY COUNT(t.slug) DESC;
</pre>
</details>
</div>

## List

<ul>
{% for link in site.data.links %}
<li>
<a href="{{ link.url }}">{{ link.title }}</a>
{% assign tags = link.tag_slugs| split: ',' %}
{% for tag in tags %}
<span class="link_tag">{{tag}}</span>
{% endfor %}
</li>
{% endfor %}
</ul>
