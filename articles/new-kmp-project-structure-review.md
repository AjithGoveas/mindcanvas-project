---
title: "The 2026 KMP Update: Why We Are Finally Saying Goodbye to 'composeApp'"
category: "Mobile Development"
date: "19-05-2026"
author: "Ajith Goveas"
tags: [ "Kotlin Multiplatform", "Android", "Clean Architecture", "Compose 1.11" ]
image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2000&auto=format&fit=crop"
excerpt: "JetBrains just overhauled the Kotlin Multiplatform default template. Here is a simple, no-nonsense breakdown of why the old monolithic structure had to go, and how the new multi-module default makes building scalable apps easier than ever."
---

If you have spun up a new Kotlin Multiplatform (KMP) project in the last couple of years, you know the drill. You open
the KMP wizard, select your platforms, and it hands you a project centered around one giant, heavy module: `composeApp`.

It was great for a quick weekend prototype. But for production apps? It was like throwing all your clothes, shoes, and
kitchen appliances into a single suitcase. Sure, everything is in one place, but good luck finding your toothbrush
without making a mess.

This week, JetBrains officially announced
a [massive structural overhaul in their May 2026 update](https://blog.jetbrains.com/kotlin/2026/05/new-kmp-default-structure/).
They have finally killed the `composeApp` monolith, replacing it with a clean, multi-module architecture right out of
the box.

Here is a simple breakdown of what changed, why the old way was holding us back, and why this new blueprint is a massive
win for developers.

---

## 🏗️ The Problem with the Old Way

To understand why this update is so exciting, let's look at the headache we used to deal with.

In the old template, almost everything—your UI screens, your database logic, and your platform-specific code (like
Android Activities or iOS ViewControllers)—lived inside `:composeApp`.

Because everything was in one bucket, it was incredibly easy to accidentally write "spaghetti code." Your UI buttons
could directly fetch data from your database, completely ignoring **Clean Architecture** (the golden rule that different
parts of your app shouldn't know too much about each other).

![A perfectly organized tool wall](https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2000&auto=format&fit=crop)
<figcaption>Fig 1: Good architecture is like a well-organized workshop—every tool has its specific place, and nothing is tangled together.</figcaption>

To fix this, we used to have to manually rip the project apart. If you’ve ever watched Philipp Lackner’s brilliant video
on [Multi-Module Architecture in KMP](https://www.youtube.com/watch?v=hY09fygeLoY), you remember the struggle:

1. Manually create a new `:shared` or `:core` module.
2. Move your pure business logic over to it.
3. Write custom, complex Gradle scripts so your main app could "talk" to that shared module.

It worked, and it gave us faster build times, but it was a massive chore just to get a clean starting point.

---

## 🚀 The 2026 Default: Clean by Design

With the new wizard update, JetBrains is handing us a perfectly organized filing cabinet from day one. Alongside massive
upgrades like **Compose Multiplatform 1.11.0**, **Gradle 9.5.1**, and **Stable Multiplatform Navigation 3**, the folder
structure itself has been entirely reimagined.

Here is what your project looks like now:

```text
/
├── androidApp/          # ONLY Android-specific setup (Activities, AndroidManifest)
├── iosApp/              # ONLY IOS-specific setup (Acts as a separate XCode Project and entry point for iOS)
├── desktopApp/          # ONLY Desktop setup (Main.kt for JVM)
├── webApp/              # ONLY Web/Wasm setup
├── shared/              # 🧠 Your core logic and shared UI lives here!
│   ├── src/
│   │   ├── commonMain/  
│   │   ├── androidMain/ 
│   │   └── iosMain/    
├── build.gradle.kts
├── gradlew
├── gradlew.bat
└── settings.gradle.kts

```

### What Actually Changed?

1. **`composeApp` is gone.** It has been sliced up into dedicated, lightweight platform entry points (`:androidApp`,
   `:desktopApp`, `:webApp`).
2. **The `:shared` module is standard.** Your API calls, local databases (like Room or SQLiteNow), and shared Compose UI
   components now live in their own isolated library module.
3. **Out-of-the-box Previews:** The new structure perfectly supports the new **Compose Multiplatform Previews**, so you
   don't have to fight the IDE to see your UI components.

---

## 🎯 Why This is a Game Changer

This isn't just about making the folders look prettier. This structural shift solves some very real, very frustrating
engineering problems:

### 1. Ready for AGP 9.0

The Android build tools are getting extremely strict. **Android Gradle Plugin (AGP) 9.0.0** is here, and it demands that
modules are properly isolated. The old hybrid structure was bound to break under these new rules. This new template
natively respects AGP 9.0 boundaries, keeping your project future-proof.

### 2. Instant Readability for Beginners

Studying open-source code used to be overwhelming because every developer had their own custom way of splitting up
modules. Now, because everyone will be using this standard blueprint, you can open any 2026 KMP project and instantly
know exactly where the business logic lives versus the platform UI code.

### 3. Blazing Fast Builds

Because the code is split into logical modules, Gradle doesn't have to recompile your entire app when you just change
one line of UI code. It only rebuilds the specific module you touched.

## The Takeaway

Building a robust, multi-platform app is hard enough without fighting your own folder structure. By making this clean,
multi-module approach the default, JetBrains is taking away the initial friction. We no longer need to spend our first
hour writing boilerplate Gradle scripts to separate our code.

If you have an older project, I highly recommend checking out the migration guides and moving toward this structure. It
might take an afternoon to refactor, but the speed and cleanliness you gain are absolutely worth it.
