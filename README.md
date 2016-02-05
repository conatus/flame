Flame
=====================

Opinionated single-state-tree immutable Flux

_Note: This is most certainly a work in progress, so things will change._

[![Build Status](https://travis-ci.org/ben-davis/flame.svg?branch=master)](https://travis-ci.org/ben-davis/flame)

Flame is an implementation of Flux that, while it remains true to the core spirit of Flux, enhances it with a more rigid, opinionated structure built on top of a single immutable state tree. Flame is designed to overcome the many issues that crop up when using a vinalla traditional implementation of Flux in a large-scale production environment, without hugely diverting from its principles.

# What about Redux
Redux is great, it's done a lot to move front end dev forward and has brought a lot of useful software engineering concepts into the minds of many developers. However it's overwhelming desire to strip out all that is not necessary has lead to a structureless system that unless placed in the hands of a developer that understands the pain points of a production app once you scale to a large team with huge product demands, will lead to difficult to maintain code with a large learning curve for anyone new to the project. Flame is my attempt to fix that, based on the experience I've had building the Flux-based web app for YPlan from scratch and my subsequent experience building a large team around that app.

The primary issue Redux has when it comes to scaling to a large production app is that of scope and interfaces. Stores in traditional Flux were very specifically defined: they held onto and provided an interface to a data domain in your app. Take for example YPlan, we have many stores in our system but each store has a specific purpose, whether to hold onto raw event data, raw normalized data with relational links to data in other stores, or purely UI stores that provide state for our various UI systems. Each store had a purpose. I built various helpers that provided easy-to-use base classes for each of the different types of stores we might have, with each store representing a different logical domain in the app.

One of the key principles of goof software design is well-defined interfaces. Flux stores adhered to this concept. Each store would provide initial state, functions that would mutate that state, and accessors that provided access to the state. In other words, everything related to that data was in one place, isolated from each other. Redux on the other hand, does away with this idea. Reducing of data is separate to the accessing of data, with the modifications done by the reducers unrestrained in what they can modify. Components decide what data they want to access, with no interface between it and the raw data, whilst reducers themselves are entrusted with the reponsiblity to not modify data outside of its domain.

# What about Flame
Flame keeps the concept of stores. At least in as much as stores that define intial state, describe functions that modify that state, and a simple accessor to that state. The key difference between Flux and Flame, is that the stores themselves do not hold onto any state whatsoever, instead they are provided access to a subtree of a single, immutable global tree which they are able to modify. Components are not able to access the raw state tree, instead they request access to a store(s) subtree within that tree. That's it.

Redux makes the mistake of obsessing about data storage, wheras Flame obsesses about interfaces and leaves the data storage as an implementation detail.

# Benefits of Flame
Flame keeps it like Flux. Anyone with an existing Flux implementation will be able to use and understand Flame with very little modifications or additional learning curve. But, and this is the most important part, Flame still provides all the benefits of Redux: the much loved and adored "time travel debugging", predicatable state changes that occur synchrounsly and preditably, and any other benefits you can think of that when using a single object for your application state (like an easy Flux-over-the-wire or replayable user stack traces). It also is immutable by design, which is nice, and is trivial to get working on the server, which is extra nice.

As mentioned, Flame's state tree is immutable - every action handler inside a store is expected to provide a new ImmutableJS instance for every action it handles, with a history of changes recorded. What's unique about Flame however is how that history is stored - each of those changes described by a store's handler is recorded as a diff between two immutable states, instead of another instance of the entire state tree. This not only makes it very efficient to record a large number of history states of your application, but also makes features like undo/redo and server/client state sharing trivial to implement. See `index.html` in the example to see how it's possible to serialise state changes in a Flame app and send them over the wire to be synced with any number of other slave Flame apps.

Compare `app.js` implementation of undo/redo compared with how redux does it: http://redux.js.org/docs/recipes/ImplementingUndoHistory.html

# What Now
It's still very much a work in progress, but I hope that it eventually proves useful. Please let me know what you think, especially if any of the above you find to be utter nonsense.
