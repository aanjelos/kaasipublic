---
layout: post.njk
title: "Kaasi V5: Cloud Backups & Cross-Device Sync"
date: 2025-12-15
author: "Aanjelo Salgado"
image: "/blog/img/kaasi-v5-changelog.jpg"
excerpt: "Kaasi V5 introduces optional Cloud Backups! Sync data across devices, customize dashboard shortcuts, and enjoy improved data management."
tags: post
---

<p>
                Since day one, Kaasi has focused on keeping your data private and local. 
                However, a common request has been the ability to move that data between a laptop and a phone seamlessly. 
                Today, I'm thrilled to announce <strong>Kaasi V5</strong>, bringing optional cloud capabilities to your expense tracking.
              </p>

              <h2 class="feature-title">Cloud Backups Are Here!</h2>
              <p>
                You can now securely backup your financial data to the cloud. 
                This feature is <strong>completely optional</strong>. 
                If you prefer to keep everything offline on your device as before, nothing changes for you. 
                Kaasi remains fully functional with offline data.
              </p>
              <p>
                To get started, simply log in using your Google account by heading to 
                <strong>Settings -> Data -> Cloud Backup</strong>.
              </p>

              <h2 class="feature-title">Cross-Device Sync (The Manual Way)</h2>
              <p>
                With cloud backups comes the ability to sync your data across multiple devices. 
                Imagine adding an expense on your phone and reviewing it later on your PC.
              </p>
              <p>
                However, there is a small catch: <strong>syncing is currently a manual process.</strong>
              </p>
              <p>
                To keep Kaasi completely free for everyone, we are utilizing the free tier of Supabase for our backend. 
                This comes with certain limitations that prevent real-time, automatic syncing in the background. 
                To stick within these limits while still offering cloud functionality, you will need to manually hit "Backup" on one device and "Restore" on the other.
              </p>

              <h2 class="feature-title">Streamlined Dashboard Actions</h2>
              <p>
                To make this manual process as smooth as possible, I've revamped the dashboard. 
                You will now find dedicated buttons for <strong>Import</strong> and <strong>Export</strong> directly on the main screen.
              </p>
              <p>
                Even better, these buttons are smart. You can configure them in the settings to perform either 
                <strong>Local Backups</strong> (downloading a JSON file) or <strong>Cloud Backups</strong> (sending data to your account). 
                Customize it to fit your workflow.
              </p>

              <h2 class="feature-title">Don't Forget the Shortcuts</h2>
              <p>
                For our power users on PC, a quick reminder from our previous patch notes: 
                efficiency is just a keystroke away.
              </p>
              <ul>
                <li><strong>Ctrl + E</strong>: Instantly Export Data</li>
                <li><strong>Ctrl + I</strong>: Instantly Import Data</li>
              </ul>

              <h2 class="feature-title">Data Privacy & Account Deletion</h2>
              <p>
                Your privacy remains my top priority. While we now offer cloud storage, you retain full control. 
                If you ever wish to delete your user data or your account entirely from our servers, 
                simply send me a request at <a href="mailto:aanjelo99@gmail.com">aanjelo99@gmail.com</a>, and I will handle it immediately.
              </p>

              <p>
                Kaasi V5 is a big step towards making financial tracking more accessible across all your devices without compromising on the promise of a free, user-first tool. 
                Log in and give the new cloud features a spin!
