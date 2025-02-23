<h1 align="center"><a href="//flipnote.js.org" target="blank"><img width="838px" src="https://raw.githubusercontent.com/jaames/flipnote.js/master/assets/ghbanner@2x.png"/></a></h1>

<p align="center">
  <b>A JavaScript library for parsing, converting, and in-browser playback of the proprietary animation formats used by Nintendo's Flipnote Studio and Flipnote Studio 3D apps. | <a href="//flipnote.js.org" target="blank">flipnote.js.org</a></b>
</p>

<p align="center">
   <a href="#features">Features</a> | <a href="#background">Background</a> | <a href="https://flipnote.js.org/pages/docs/get-started.html">Get Started</a> | <a href="https://flipnote.js.org/pages/docs/web-components.html">Web Components</a> | <a href="https://flipnote.js.org/globals.html">API</a> | <a href="https://flipnote.js.org/pages/docs/acknowledgements.html">Special Thanks</a>
</p>

<p align="center">
  Looking for an online Flipnote player and converter? Check out <a href="https://flipnote.rakujira.jp/">Flipnote Player</a>!
</p>

## Features

* Full file parser implementations for animations from both Flipnote Studio and Flipnote Studio 3D, with a consistent API for dealing with metadata, thumbnails, frames, audio, signatures, and more
* High emphasis on accuracy, with reverse-engineered code being referenced as much as possible; frame rendering and audio mixing/interpolation are *identical* to console output
* Realtime browser-based playback, with a player API based on the HTML5 Video and Audio APIs
* Playback uses a WebGL renderer featuring crisp pixel scaling (using sharp-bilinear filtering), with a HTML5 canvas fallback
* Optional web component for easily embedding a Flipnote player UI on any web page
* Built-in Flipnote GIF and WAV exporters
* Includes utilities for working with Flipnote Studio IDs, filenames, and playlist files
* Works in web browser and NodeJS environments
* Exports full Typescript types
* Surprisingly small once minified & gzipped

## Status

🔆 I consider this library to be feature complete - notwithstanding a new Flipnote Studio release, of course!

It's been a fun pet project so I may return to do some tweaks, implement support for interesting web features as they come, etc, etc. Please also understand that I consider Flipnote encoding to be beyond the scope of what I set out to accomplish (making Flipnote content viewable outside of the original apps) and as such I will not be implementing it here.

## Background

Released in 2009, [Flipnote Studio](https://en.wikipedia.org/wiki/Flipnote_Studio) is an application for the Nintendo DSi console which allows users to create flipbook-style animations with the console's touch screen, cameras and microphone. In 2013 it received a sequel on the Nintendo 3DS called [Flipnote Studio 3D](https://en.wikipedia.org/wiki/Flipnote_Studio_3D), which expanded upon the original's feature set and added the ability to use 3D depth.

Flipnote Studio has had quite a legacy. The British animation studio Aardman [created several original shorts for it](https://www.nintendolife.com/news/2009/12/aardman_create_zelda_flipnote), it's been used to create multiple [music videos](https://www.youtube.com/watch?v=K3m3_7RoGZk), and [a user even spent 4 years creating a full 30-minute anime](https://nintendoeverything.com/3ds-user-spends-four-years-making-an-anime-in-flipnote-studio-3d/) primarily animated in Flipnote Studio 3D.

Even though it has been several years since the last Flipnote Studio installment was released (and the online services for both apps have since been retired) there is still a notable community of people actively creating Flipnotes, thanks mostly to fan-built services such as [Sudomemo](https://www.sudomemo.net/) and [Kaeru Gallery](https://gallery.kaeru.world/). There's even several high-profile artists such as [Kéké](https://bsky.app/profile/kekeflipnote.bsky.social) who are rocking their Flipnote Studio creations on social media!

## Why this library exists

While user-created Flipnote animations can be easily saved to the SD card from within the apps, Nintendo created proprietary file formats for this purpose; Flipnote Studio uses [.ppm](https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format) (not to be confused with the Netpbm format of the same extension) and Flipnote Studio 3D uses [.kwz](https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format) respectively. While they may seem superficially similar, the two formats are quite different internally.

At the time of writing, the only official software that can load and play these animations are the original Flipnote Studio apps themselves, which are now rather hard to obtain due to the [Nintendo DSi Shop closing down in 2016](https://www.nintendo.co.uk/News/2016/March/Important-information-about-the-discontinuation-of-the-Nintendo-DSi-Shop-1095977.html), and the [Nintendo 3DS eShop closing down in 2023](https://www.nintendo.com/en-gb/Support/Purchasing/Download-games/Nintendo-eShop/Notice-of-End-of-Purchases-in-Nintendo-eShop-for-Wii-U-and-Nintendo-3DS-Update-April-2024-2174073.html). For various reasons we also think it's unlikely that Nintendo is going to produce a new entry in the series.

This library hopes to aid in the long-term preservation and enjoyment of these animations by enabling them to be played in any modern web browser with JavaScript enabled. In addition, it provides a consistent API and various utilities for dealing with both animation formats so that other developers can create their own tools and applications around them!

## Projects using flipnote.js

* [Flipnote Archive](https://archive.sudomemo.net/) - an archive of Flipnote animations posted to Flipnote Hatena before its closure in 2013
* [Flipnote Player](http://flipnote.rakujira.jp/) - web-based browser, player and converter for Flipnote animations
* [Kaeru Gallery](https://gallery.kaeru.world/) - fan-made replacement online service for Flipnote Studio 3D
* [IPGFlip](https://ipgflip.xyz/) - (in hiatus) fan-made replacement online service for Flipnote Studio

----

🐸