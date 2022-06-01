## Background

Released in 2009, [Flipnote Studio](https://en.wikipedia.org/wiki/Flipnote_Studio) is an application for the Nintendo DSi console which allows users to create flipbook-style animations with the console's touch screen, cameras and microphone. In 2013 it recieved a sequel on the Nintendo 3DS called [Flipnote Studio 3D](https://en.wikipedia.org/wiki/Flipnote_Studio_3D), which expanded upon the original's feature set and added the ability to use 3D depth.

Flipnote Studio has had quite a legacy. The British animation studio Aardman [created several original shorts for it](https://www.nintendolife.com/news/2009/12/aardman_create_zelda_flipnote), it's been used to create multiple [music videos](https://www.youtube.com/watch?v=K3m3_7RoGZk), and [a user even spent 4 years creating a full 30-minute anime](https://nintendoeverything.com/3ds-user-spends-four-years-making-an-anime-in-flipnote-studio-3d/) primarily animated in Flipnote Studio 3D.

Even though it has been several years since the last Flipnote Studio installment was released (and the online services for both apps have since been retired) there is still a notable community of people actively creating Flipnotes, thanks mostly to fan-built services such as [Sudomemo](https://www.sudomemo.net/), [Kaeru Gallery](https://gallery.kaeru.world/), [IPGFlip](https://ipgflip.xyz/). There's even several high-profile artists such as [Kéké](https://twitter.com/Kekeflipnote) who are rocking their Flipnote Studio creations on social media!

## Why this library exists

Nintendo created proprietary file formats for storing user-created Flipnote animations; Flipnote Studio uses [.ppm](https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/PPM-format) (not to be confused with the Netpbm format of the same extension) and Flipnote Studio 3D uses [.kwz](https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/KWZ-Format) respectively. 

At the time of writing, the only official software that can load and play these animations are the original Flipnote Studio apps themselves, which are now rather hard to obtain due to the [Nintendo DSi Shop closing down in 2016](https://www.nintendo.co.uk/News/2016/March/Important-information-about-the-discontinuation-of-the-Nintendo-DSi-Shop-1095977.html), and [Flipnote Studio 3D having a limited release outside of Japan](https://www.nintendolife.com/news/2016/03/reminder_flipnote_studio_3d_debuting_in_europe_as_my_nintendo_account_incentive). It also seems particularly unlikely that Nintendo is going to produce a new entry in the series any time soon.

This library hopes to aid in the long-term preservation and enjoyment of these animations, by enabling them to be played in any modern web browser. In addition, it provides a consistent API and various utilities for dealing with both animation formats so that other developers can easily create their own tools and applications around them.

## Features

* Full file parser implementations with metadata, frames, audio, etc
* Realtime browser-based playback, with a player API based on the HTML5 Video and Audio APIs
* Optional web component for easily embedding a Flipnote player UI on any web page
* Crisp scaling using sharp-bilinear filtering
* Built-in GIF and WAV converters
* Works in web browser and NodeJS environments
* Exports full Typescript types
* Less than 20kb when minified & gzipped

## Projects using flipnote.js

* [Flipnote Archive](https://archive.sudomemo.net/) - an archive of Flipnote animations posted to Flipnote Hatena before its closure in 2013
* [Flipnote Player](http://flipnote.rakujira.jp/) - web-based browser, player and converter for Flipnote animations
* [Kaeru Gallery](https://gallery.kaeru.world/) - fan-made replacement online service for Flipnote Studio 3D
* [flipnote-video](https://github.com/jaames/flipnote-video) - command line tool for converting Flipnotes to video
* [IPGFlip](https://ipgflip.xyz/) - fa