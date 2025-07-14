// =================================================================
// K A A S I   B L O G   D A T A
// =================================================================
// This is the single source of truth for all your blog posts.
// To add a new post:
// 1. Create your new post's HTML file in the /blogs/ directory.
// 2. Add a new object to the TOP of this `blogPosts` array.
//
// The script will automatically handle the rest.
// The `id` should be unique for each post.
// The `date` should be in 'YYYY-MM-DD' format for correct sorting.
// =================================================================

const blogPosts = [
  {
    id: "kaasi-v3-changelog",
    title: "Kaasi v3 is Here: A New Home, New Features, and More!",
    date: "2025-07-15",
    author: "Aanjelo Salgado",
    image: "blog/img/kaasi-v3-changelog.jpg",
    image_alt: "Image showing v3 in a black background.",
    url: "blog/kaasi-v3-changelog.html",
    excerpt:
      "Announcing the Kaasi v3 update! Discover our new home at kaasi.com.lk, a brand new website, and exciting new app features.",
  },
  {
    id: "sri-lanka-digital-tax-guide",
    title:
      "The Upcoming 18% VAT in Sri Lanka: How It Affects Your Subscriptions",
    date: "2025-07-10",
    author: "Aanjelo Salgado",
    image: "blog/img/sri-lanka-digital-tax-guide.jpg",
    image_alt: "Image showing v3 in a black background.",
    url: "blog/sri-lanka-digital-tax-guide.html",
    excerpt:
      "Sri Lanka is preparing to implement an 18% VAT on digital services like Netflix, Spotify, and more. Learn which services will be affected and how to prepare your budget.",
  },

  {
    id: "the-story-of-kaasi",
    title: "From a Spreadsheet to an App: The Story Behind Kaasi",
    date: "2025-07-01",
    author: "Aanjelo Salgado",
    image: "blog/img/the-story-of-kaasi.jpg",
    image_alt:
      "Two laptops, with one showing the old spreadsheet and the other showing Kaasi UI.",
    url: "blog/the-story-of-kaasi.html",
    excerpt:
      "Discover the origin story of Kaasi, a personal finance app built for Sri Lankans out of a personal need for something better.",
  },
];
