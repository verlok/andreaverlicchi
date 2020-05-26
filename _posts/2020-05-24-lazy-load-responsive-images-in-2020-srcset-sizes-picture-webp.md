---
layout: post
title: Lazy load responsive images in 2020
date: 2020-05-24 08:00:00 +01:00
categories:
- libraries
tags: [srcset, responsive images, lazy load]
image: lazy-load-responsive-images-2020__2x.jpg
---

In this article I'm going to show you **what HTML, CSS and JavaScript code** you need to write to serve **responsive images** _and_ **lazy load** them in your website, how to make browsers use both **the WebP image format** and **native lazy load** where supported, plug give you some advice based on my latest years of experience as a front-end developer at <a href="https://www.ynap.com" target="_blank" noopener>YNAP</a> and as a maintainer of a [popular lazyload script](https://github.com/verlok/vanilla-lazyload).

<figure>
  <picture>
    <source
      type="image/webp"
      data-srcset="
        /assets/post-images/lazy-load-responsive-images-2020__600w.webp 600w,
        /assets/post-images/lazy-load-responsive-images-2020__698w.webp 698w,
        /assets/post-images/lazy-load-responsive-images-2020__1047w.webp 1047w,
        /assets/post-images/lazy-load-responsive-images-2020__1200w.webp 1200w
      " 
    />
    <img
      class="lazy post-image"
      alt="Lazy loading responsive images (2020)" 
      src="/assets/post-images/lazy-load-responsive-images-2020__50w.jpg" 
      data-src="/assets/post-images/lazy-load-responsive-images-2020__600w.jpg" 
      data-srcset="
        /assets/post-images/lazy-load-responsive-images-2020__600w.jpg 600w,
        /assets/post-images/lazy-load-responsive-images-2020__698w.jpg 698w,
        /assets/post-images/lazy-load-responsive-images-2020__1047w.jpg 1047w,
        /assets/post-images/lazy-load-responsive-images-2020__1200w.jpg 1200w
      "
      data-sizes="(min-width: 630px) 600px, calc(100vw - 26px)"
    >
  </picture>
  <figcaption>
    Photo by <a href="https://unsplash.com/@domenicoloia">Domenico Loia</a> on <a href="https://unsplash.com/s/photos/website">Unsplash</a>
  </figcaption>
</figure>

## Some definitions

**Responsive images** are images that adapt to the users screens _while_ keeping our websites fast by downloading the right image size for the browser's **viewport width** (from small devices to large desktop computers), also considering the device **screen density** (hiDPI, retina display, etc.).

**Lazy loading images** is a technique to make your website faster by **avoiding to load below-the-fold images**, then loading them **as they enter the viewport**. Beyond performance, this also allows you to save bandwith and money, e.g. if you're paying a CDN service for your images.

## Important note

Bare in mind that using a script to **lazy load images is a Javascript-based task** and it's **relevantly slower than the regular image loading** (*eager loading* from now on) which starts while the HTML document is being parsed.

☝️ For this reason, the best practice is to **eagerly load above-the-fold images**, then **lazy load below-the-fold images** and **only those**.

A good way to understand how many images will appear *above-the-fold* in your responsively designed page, **open it in a browser** and **test it at the most common viewports** of smartphones, computers and tablets.

If you used native lazy loading you wouldn't have these problems, but as of Jun 2020 you can't just use that without detecting browser support first, so... you still have these problems.

## The result

[Take a look 👀 at the result](http://verlok.github.io/vanilla-lazyload/demos/image_srcset_lazy_sizes.html) you will achieve. Open your browser's **developer tools** and switch to the **network panel**. You will see that the first 2 images are loaded *eagerly* just after page landing, while the rest of the images are loaded **as you scroll down** the page.

## Now to some code!

### HTML

Here's the HTML markup of an **eagerly loaded** responsive image.

```html
<!-- Eagerly loaded responsive image -->
<!-- Only for above-the-fold images!!! -->
<img
  alt="Image 01"
  src="https://via.placeholder.com/220x280?text=Img+01"
  srcset="
    https://via.placeholder.com/220x280?text=Img+01 220w,
    https://via.placeholder.com/440x560?text=Img+01 440w
  "
  sizes="220px"
/>
```

And here's the markup you're going to need in order to **lazy load** a responsive image.

```html
<!-- Lazy loaded responsive image -->
<!-- Only for below-the-fold images!!! -->
<img
  alt="Image 03"
  class="lazy"
  data-src="https://via.placeholder.com/220x280?text=Img+03"
  data-srcset="https://via.placeholder.com/220x280?text=Img+03 220w, 
    https://via.placeholder.com/440x560?text=Img+03 440w"
  data-sizes="220px"
/>
```

Want a low resolution preview while your lazy images load? You can do that by using a small, low-quality image in the `src` tag, like this:

```html
<!-- Lazy loaded responsive image + low-res preview -->
<!-- Only for below-the-fold images!!! -->
<img
  alt="Image 03"
  class="lazy"
  src="https://via.placeholder.com/11x14?text=Img+03"
  data-src="https://via.placeholder.com/220x280?text=Img+03"
  data-srcset="https://via.placeholder.com/220x280?text=Img+03 220w, 
    https://via.placeholder.com/440x560?text=Img+03 440w"
  data-sizes="220px"
/>
```

We're using the `img` HTML tag and not the `picture` tag, since the latter is not necessary in this case. I'll dig into the `picture` tag use cases [down below](#picture-tag-use-cases).

_But hey, what about Internet Explorer?_

It's true, Internet Explorer does not support responsive images, but given that only its latest version stuck around and it's slowly disappearing from our radars (in the websites we manage, its share is around 4%), I'd suggest NOT to use a responsive images polyfill for it, and just rely on the image specified in the `src` (or `data-src`) attribute instead.

### Script inclusion

To load the lazy images as they enter the viewport, you need a lazy load script such as [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) which is a lightweight-as-air (1.9 kb gzipped), configurable, SEO-friendly script that I've been developing and improving since 2014. It's also based on the IntersectionObserver browser API so it's blazing fast and grants jank-free scrolling also on slower devices.

Here is the simplest way to include the script in your page.

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@16.1.0/dist/lazyload.min.js"></script>
```

Other ways to include LazyLoad in your web pages, like using an `async` script with auto-init, using RequireJS, using WebPack or Rollup, are [documented here](https://github.com/verlok/vanilla-lazyload/#include-lazyload-in-your-project).

### LazyLoad initialization

You need LazyLoad to manage and load all the images with the `.lazy` class in the page. You can initialize `LazyLoad` like this:

```js
var lazyLoad = new LazyLoad({
  elements_selector: ".lazy"
  cancel_on_exit: true //optimize for fast readers on slow connections
});
```

### Some CSS Tricks

There are also some features that you can achieve using CSS only. You need to:

- **Make not-yet-loaded lazy images to occupy some space**. If you don't do so, those images will have height `0` and they'll collapse one next to another. As a result, all of them will enter the viewport all at the same time, nullifying our efforts to load them as they enter the viewport.
- Avoid empty images to appear as broken images
- Resolve a Firefox anomaly that displays the broken image icon while images are loading

You can do all that using these CSS rules:

```css
/*
Makes images container to occupy some space 
when the images aren't loaded yet.
This value depends on your layout.
*/
.imageList li {
  min-height: 300px;
}

/*
Avoid empty images to appear as broken
*/
img:not([src]):not([srcset]) {
  visibility: hidden;
}
```

## Picture tag use cases

Until now, I wrote about the `img` tag with the `srcset` and `sizes` attributes, which is the solution to the vast majority of the responsive images you might need and use on a website or web application. Now, in which cases should you use the `picture` tag?

### Different width/height ratio

Use case: you need to show images with different **width/height ratio** depending on a media query. e.g. you want to show _portrait_ images on mobile, vertical devices, _landscape_ on wider viewports, like tablets and computers.

&rarr; [Take a look at the results](http://verlok.github.io/vanilla-lazyload/demos/picture_media.html) &larr;

Here's the code you're gonna need in this case. In order to have eagerly loaded images, just use the plain `src` and `srcset` attributes, without `data-` prefix.

```html
<picture>
  <source
    media="(min-width: 1024px)"
    data-srcset="https://via.placeholder.com/1024x576?text=Horizontal+Image 1x,
      https://via.placeholder.com/2048x1152?text=Horizontal+Image 2x"
  />
  <source
    media="(max-width: 1023px)"
    data-srcset="https://via.placeholder.com/640x960?text=Vertical+Image 1x,
      https://via.placeholder.com/1280x1920?text=Vertical+Image 2x"
  />
  <img
    class="lazy"
    alt="Stivaletti"
    data-src="https://via.placeholder.com/1024x576?text=Horizontal+Image"
  />
</picture>
```

### Automatically switch to WebP

Use case: you want the browser to **automatically pick the WebP format** depending on its support for that format.

&rarr; [Take a look at the results](http://verlok.github.io/vanilla-lazyload/demos/picture_type_webp.html) &larr;

Here's the code! Again, in order to obtain eagerly loaded images, just use the plain `src`, `srcset` and `sizes` attributes, without `data-` prefix.

```html
<picture>
  <source
    type="image/webp"
    data-srcset="https://via.placeholder.com/1024x576?text=WebP+Image 1x, 
      https://via.placeholder.com/2048x1152?text=WebP+Image 2x"
    data-sizes="220px"
  />
  <img
    data-src="https://via.placeholder.com/256.jpg?text=1024x576+Jpg+Image"
    data-srcset="https://via.placeholder.com/1024x576?text=Jpg+Image 1x, 
      https://via.placeholder.com/2048x1152?text=Jpg+Image 2x"
    data-sizes="220px"
    alt="An image"
    class="lazy"
  />
</picture>
```

## _One more thing_

The vanilla [LazyLoad script](https://github.com/verlok/vanilla-lazyload) leverages the IntersectionObserver API so, in browser not supporting it like Internet Explorer and older versions of Safari, it will load all images as soon as it executes, which leads more or less to the same result as if no LazyLoad was ever used on the page.

If you want to load your content lazily in the 100% of the browsers out there (I wouldn't, but it's up to you), you need to include the [IntersectionObserver Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) script before LazyLoad.

You can either you put the script in the page just before the LazyLoad one, as it follows...

```html
<script src="https://cdn.jsdelivr.net/npm/intersection-observer@0.10.0/intersection-observer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanilla-lazyload@16.1.0/dist/lazyload.min.js"></script>
```

...or you can load it the polyfill as a dependency of LazyLoad using _RequireJS_ or another AMD module loader. [More info here](https://github.com/verlok/vanilla-lazyload/blob/master/README.md#include-via-requirejs-without-intersectionobserver-polyfill).

## Conclusions

Here is a summary:

1. Don't load all the images lazily, just the ones _below the fold_
2. Use the `img` tag to do simple responsive images
3. Use the `picture` tag to conditinally serve the WebP version of your images, or to change your images ratio
4. Use [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload/) to load your lazy images.
5. Optionally use the IntersectionObserver polyfill if you want to load lazily on 100% of the browsers.

If something is unclear or could be improved, let me know in the comments. Or [tweet me](https://twitter.com/verlok/).

If you did find this useful, feel free to share it!

### Useful resources

- [Responsive images in practice](http://alistapart.com/article/responsive-images-in-practice) @ A List Apart
- [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) @ Mozilla Developer Network
- [Responsive images in CSS](https://css-tricks.com/responsive-images-css/) @ CSS Tricks
- [Responsive images community group](https://responsiveimages.org) website