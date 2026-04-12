export const MAX_AVAILABLE_LECTURE = 8;

export function isLocked(lid) {
  return parseInt(lid.replace('l', '')) > MAX_AVAILABLE_LECTURE;
}

export const DATA = {
  weeks: [
    { label: "Wk 1", topic: "Foundations", lectures: ["l1"] },
    { label: "Wk 2\u20133", topic: "UIKit & MVC", lectures: ["l2", "l3"] },
    { label: "Wk 4\u20135", topic: "Collections & Patterns", lectures: ["l4", "l5"] },
    { label: null, isBreak: true },
    { label: "Wk 6\u20137", topic: "SwiftUI", lectures: ["l6", "l7"] },
    { label: "Wk 8\u20139", topic: "Networking", lectures: ["l8", "l9"] },
    { label: "Wk 10\u201311", topic: "Architecture & ML", lectures: ["l10", "l11"] },
    { label: "Wk 12\u201313", topic: "Special Topics & Career", lectures: ["l12", "l13"] },
    { label: "Wk 14", topic: "Wrap-up", lectures: ["l14"] },
  ],
  lectures: {
    l1:  { num: "L1",  title: "Course Intro + Git + Swift Basics", body: "We\u2019ll start with introductions and get everyone set up with <strong>Xcode</strong> and <strong>Git</strong>. Then we\u2019ll jump straight into Swift \u2014 variables, types, optionals, control flow, functions. By the end of this one you\u2019ll have a GitHub repo and enough Swift to start building things." },
    l2:  { num: "L2",  title: "UIKit", body: "Now that you know some Swift, we\u2019ll use it to put stuff on screen. This lecture covers <strong>UIViewController</strong>, Auto Layout, and the view hierarchy. We\u2019ll talk about storyboards vs. doing everything in code, and you\u2019ll build your first single-screen app." },
    l3:  { num: "L3",  title: "MVC + Navigation Control", body: "Your app has one screen \u2014 let\u2019s give it more. We\u2019ll start with the <strong>Model-View-Controller</strong> pattern so you understand how to organize your code, then learn how <strong>navigation controllers</strong> let users move between screens. Finally, we\u2019ll take our project and split it into a proper MVC structure so nothing lives in one giant file." },
    l4:  { num: "L4",  title: "UICollectionView", body: "Now we need a way to show collections of content \u2014 grids, carousels, section-based layouts. That\u2019s <strong>UICollectionView</strong>. We\u2019ll cover compositional layout and diffable data sources, which is the modern way to build these UIs without the headaches." },
    l5:  { num: "L5",  title: "Delegation + Protocols", body: "You\u2019ve been using delegates all along (UICollectionViewDelegate, anyone?) but now we\u2019ll actually understand how they work. We\u2019ll break down <strong>protocols</strong>, build our own custom delegates, and talk about why this pattern shows up everywhere in iOS." },
    l6:  { num: "L6",  title: "SwiftUI I", body: "Time to switch gears. SwiftUI is Apple\u2019s newer, declarative way to build UIs \u2014 less boilerplate, more reactive. We\u2019ll cover <strong>VStack</strong>/<strong>HStack</strong>/<strong>ZStack</strong>, <strong>@State</strong>, <strong>@Binding</strong>, and talk about how the mental model differs from what we did in UIKit." },
    l7:  { num: "L7",  title: "SwiftUI II", body: "Building on last lecture, we\u2019ll get into <strong>NavigationStack</strong>, <strong>List</strong>, <strong>@Observable</strong>, environment values, and animations. The goal is a multi-screen SwiftUI app with shared state \u2014 something that actually feels like a real app." },
    l8:  { num: "L8",  title: "Networking I", body: "So far our apps have used hardcoded data. Now we\u2019ll pull from real APIs. We\u2019ll cover <strong>URLSession</strong>, HTTP methods, JSON decoding with <strong>Codable</strong>, and <strong>async/await</strong>. You\u2019ll fetch live data and display it in a list." },
    l9:  { num: "L9",  title: "Networking II", body: "Last time was the happy path. Now we deal with reality: error handling, loading spinners, pagination, caching images, and <strong>authentication</strong>. We\u2019ll also talk about structuring a reusable networking layer so you\u2019re not copy-pasting URLSession code everywhere." },
    l10: { num: "L10", title: "MVVM", body: "By now your view controllers or SwiftUI views are probably doing too much. <strong>MVVM</strong> fixes that by pulling presentation logic into a ViewModel. We\u2019ll refactor an earlier project to use this pattern and see how much cleaner things get, especially with <strong>@Observable</strong>." },
    l11: { num: "L11", title: "Embedded ML", body: "This one\u2019s fun \u2014 we\u2019ll run a machine learning model directly on the phone using <strong>Core ML</strong>. We\u2019ll grab a pre-trained model (image classification, text, etc.), drop it into an app, and talk about when on-device ML makes sense vs. calling a cloud API." },
    l12: { num: "L12", title: "Special Fun Topics", body: "This is the wildcard lecture. We\u2019ll pick from things like <strong>MapKit</strong>, <strong>ARKit</strong>, <strong>Core Animation</strong>, widgets, or whatever the class is most curious about. Good chance to explore stuff that might inspire your final project." },
    l13: { num: "L13", title: "Recruiting + Internship", body: "We\u2019ll bring in guest speakers and alumni to talk about what the <strong>recruiting process</strong> actually looks like \u2014 resumes, portfolios, how to present your iOS projects in interviews, and honest takes on internship life at different kinds of companies." },
    l14: { num: "L14", title: "AppDev + Career Talk", body: "Last class. We\u2019ll walk through the <strong>App Store submission</strong> flow \u2014 TestFlight, app review, monetization \u2014 then zoom out and talk about where to go from here: indie dev, big tech, startups, and how to keep growing as an iOS engineer after the course wraps." },
  },
  connections: [
    { from: "l1", to: "l2", label: "Swift fundamentals", desc: "Now that you can write Swift, you\u2019ll use it to build real UI with UIKit." },
    { from: "l2", to: "l3", label: "adds architecture", desc: "You have a single-screen app \u2014 next you\u2019ll learn to organize it with MVC and add navigation between screens." },
    { from: "l3", to: "l4", label: "advanced views", desc: "With navigation in place, you\u2019ll learn to display collections of content using UICollectionView." },
    { from: "l4", to: "l5", label: "design patterns", desc: "You\u2019ve been using delegates without knowing it \u2014 now you\u2019ll understand the protocol and delegation pattern behind them." },
    { from: "l5", to: "l6", label: "UIKit \u2192 SwiftUI", desc: "With a solid UIKit foundation, you\u2019ll switch to Apple\u2019s declarative framework and see how the mental model differs." },
    { from: "l6", to: "l7", label: "deeper SwiftUI", desc: "You know the basics of SwiftUI \u2014 now you\u2019ll add navigation, lists, shared state, and animations to build a full app." },
    { from: "l7", to: "l8", label: "adds data layer", desc: "Your apps use hardcoded data \u2014 next you\u2019ll pull from real APIs using URLSession and async/await." },
    { from: "l8", to: "l9", label: "advanced networking", desc: "You got the happy path working \u2014 now you\u2019ll handle errors, pagination, caching, and auth for production-ready networking." },
    { from: "l7", to: "l10", label: "SwiftUI + MVVM", desc: "SwiftUI views can get bloated \u2014 MVVM pulls logic into ViewModels, and @Observable makes it clean." },
    { from: "l9", to: "l10", label: "data \u2192 architecture", desc: "With a networking layer in place, MVVM gives you a proper structure to connect your data to your views." },
    { from: "l10", to: "l11", label: "integrate ML", desc: "You have a well-architected app \u2014 now you\u2019ll drop in a Core ML model and run inference directly on device." },
    { from: "l12", to: "l14", label: "ship it", desc: "The special topics you explored can inspire your final project \u2014 now learn how to actually ship it to the App Store." },
    { from: "l13", to: "l14", label: "career path", desc: "Recruiting prep meets the bigger picture \u2014 how to keep growing as an iOS engineer after the course." },
  ]
};
