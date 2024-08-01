# Introduction

## What is Filenest and who is it for

Filenest is a TypeScript library designed to seamlessly integrate a file manager into your app or admin dashboard.
This library is ideal for developers who:
- Need to connect a file hosting provider to their app
- Require a way to select images for database entities (e.g., articles)
- Want to manage externally hosted files directly within their site

## Background

### tl;dr (sort of)
Developers often choose to build their own admin dashboards instead of using a CMS for various reasons.
Even when creating a simple blog backend, you may need to view, select,
or manage images and other files — like selecting a header image for a blog article.

While it's possible to use a simple text field to paste an image link,
having a fully-featured media gallery, like those found in content management systems,
offers a better user experience. However, implementing such functionality can be tedious and time-consuming.

Filenest significantly reduces the effort required to build these features.
By using providers and adapters for your backend and frontend components for your UI,
you can easily integrate Filenest’s asset management capabilities into your existing project.
This approach allows you to maintain full control over backend permissions and frontend styles.

### The story behind it
A personal project of mine ([@nordowl](https://github.com/nordowl)), with a custom backend,
required a way to connect images to database entities. Let's just say they were blog articles.
I needed some way to upload and manage images and be able to choose an image for each article.
Cloudinary turned out to be my file hoster of choice because of its generous free tier, SDK and web interface (#NotSponsored).
A text field holding an image link would be the simplest to implement and would suffice for my articles -
but did I really want to open up Cloudinary everytime I wanted to copy an image URL? Nope.

And so I built some API routes to get my data from Cloudinary, and built a beautiful
custom file management component in React - tailored to my needs specifically.
Everything worked well. I could fetch and display my remote images in my app and get all the file URLs.
Some time passed and another project arose, which turned out to need a media library as well.

_"Do I just copy everything over?"_

Yup. I copied all the API routes but redid and improved the React components.
Being halfway done I was wondering, what if I needed another file manager in the future?
I couldn't be copying dozens of files everytime. I searched the web for a library
that fulfills my use case, but couldn't find one. And I thought
I was probably not the only developer building custom dashboards that need an image / file manager.

_"Might aswell turn this into a library."_

And this is why Filenest exist. It extends your existing API by adding a few endpoints,
which the frontend components use to talk to your third party file hosting provider.
Minimal backend setup required - and the components come unstyled,
meaning you can style them to your needs, matching the rest of your UI.

## Try out Filenest now
Check out the [quick start quide](/docs/getting-started/quick-start).