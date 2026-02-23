---
layout: post
title:  "AI learns to play Mario : Deep Reinforcement Learning applied to Super Mario Bros"
tags:
  - AI
  - reinforcement learning
  - simulation
  - emergence
  - scientific programming
categories:
  - Tinkering
description: >
  I reimplemented Deep Reinforcement learning research papers and
  training an AI to beat Super Mario Bros
toc: false
---

<!-- Add a placeholder for the Twitch embed -->
<div id="twitch-embed"></div>
<!-- Load the Twitch embed JavaScript file -->
<script src="https://embed.twitch.tv/embed/v1.js"></script>
<!-- Create a Twitch.Embed object that will render within the "twitch-embed" element -->
<script type="text/javascript">
  new Twitch.Player("twitch-embed", {
    width: 854,
    height: 480,
    channel: "pcouy_",
    // Only needed if this page is going to be embedded on other websites
    //parent: ["embed.example.com", "othersite.example.com"]
  });
</script>

This is a live feed of my Deep Reinforcement Learning agent training on the
original Super Mario Bros game.

The agent is a custom implementation of the [Rainbow DQN
paper](https://arxiv.org/abs/1710.02298) from 2017. It stays pretty close to
what's described in the papers. There are however a few custom tweaks. I'll
update this article soon with more details.

This originally started as a pedagogical implementation of the original [Deep Q
Network paper](https://arxiv.org/abs/1312.5602) from 2015 for a course I taught.
I then kept implementing improvements to this paper until I reached the
algorithm described in the Rainbow paper.
