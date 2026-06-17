---
layout: post.njk
title: "Why Kaasi is Free (And How We Keep It That Way)"
date: 2026-06-18
author: "Aanjelo Salgado"
image: "/blog/img/why-kaasi-is-free.jpg"
excerpt: "No ads, no paywalls, and no hidden data harvesting. Discover the philosophy behind Kaasi, how it was built using AI, and how we keep operating costs at zero."
tags: post
---

If you look at the landscape of modern apps, especially personal finance and expense trackers, almost everything comes with a catch. You are either hit with a paywall after logging a few transactions, forced to watch intrusive ads, or signing away your private data to third-party advertisers. 

When Kaasi was launched, one of the most common questions I received was: "Why is this free?" In a world where software is almost always monetized, it is natural to look for the catch. But with Kaasi, there is no catch. Here is the story behind why the app is free, how it was built, and how it runs at virtually zero operational cost.

## A Tool Built for Personal Use First

The simple truth is that Kaasi was not built as a commercial venture. It started as a personal project to replace my own messy Google Sheets. For about three years, I managed my finances in a spreadsheet. It worked, but it was tedious. I wanted a private, efficient, and clean way to manage my rupees.

I am not a professional software engineer, so I pair-programmed with Google's Gemini to write the code. Over a span of twenty days, I worked closely with Gemini to design, write, test, and launch the initial version of the app. Now, nearly a year later, the project remains in active development with regular updates, and Kaasi v6 is coming soon.

Because the app was already built, fully functional, and serving my own daily needs, keeping it locked to my own browser felt like a waste. Since it was already functional, I decided to make it public for anyone to use.

## The Zero-Cost Infrastructure

Many modern apps cost thousands of rupees a month to run, forcing developers to charge users just to break even. Kaasi is engineered differently. By designing the app to be lightweight and leveraging free tiers, the monthly operating cost is kept at zero:

*   **Free Web Hosting:** The landing page and the web app itself are hosted on free static hosting platforms.
*   **Local-First Storage:** By default, all of your financial logs are stored directly inside your own web browser. Because the data lives on your device, Kaasi does not need expensive servers to store your transactions.
*   **Manual Cloud Backups:** For users who want to sync across devices, Kaasi uses Supabase. To stay comfortably within the free tier rate limits and avoid monthly server bills, backups are set to manual rather than automatic syncing. This protects the database from constant, costly requests.
*   **A Cheaper Domain:** Even the choice of domain was deliberate. Choosing a `.com.lk` domain name is about 4 to 6 times cheaper than buying a standard `.com` domain, and it is also significantly cheaper than buying a regular `.lk` domain.

## Where the Costs Actually Go

While hosting and database services are completely free, Kaasi is not entirely free to maintain. My primary investment has been:

*   **Personal Time:** The hours spent designing, testing, and updating the application.
*   **AI Subscriptions:** Access to the advanced AI systems used to write and maintain the code requires paid subscriptions, which are quite expensive.

I hate products cluttered with ads, and I refused to let Kaasi become one of them. An expense tracker should be a quiet, private, and focused space to look at your money, not a place to be sold credit cards or personal loans. 

Although I do not currently receive regular donations, voluntary contributions are always welcome to help offset the cost of the AI subscriptions and support ongoing development. If Kaasi has helped you get a better handle on your finances and you would like to support the journey, you can find the bank details in the donation section on the home page.
