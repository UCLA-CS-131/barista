# barista

This is a monorepo for *barista*, a companion tool for UCLA's CS 131. It helps students create and debug test cases for the course's quarter-wide project, building an interpreter for the "Brewin" language.

Overall, *barista* is a small "web wrapper" around the core project interpreter code; it has

- a small [Flask](https://github.com/pallets/flask) server that runs arbitrary Brewin code and returns the result/error
- a tiny [React](https://reactjs.org/) app that provides an interface to use the server

Broadly, we package the React app as a static HTML page with [Create React App](https://create-react-app.dev/), and then serve that HTML with Flask as a root.

This is nothing fancy (or bleeding-edge), and it's probably not the best way to do this --- but, it works :)

Have any questions or concerns? [Open an issue](https://github.com/UCLA-CS-131/barista/issues) or shoot matt an email at [matt@matthewwang.me](mailto:matt@matthewwang.me).

## development setup

This project blends a typical Python and Node workflow. To run the entire app locally, you'll need both. As of writing, we require at least Python 3.9 and Node 16.

First, set up the environment; we've added some `npm` helpers:

```sh
$ npm install
$ npm run setup-py # sets up a venv and installs with pip
```

To run the Flask server in dev mode,

```sh
$ source venv/bin/activate # activate the venv
$ npm run start-api
```

To then run the frontend,

```sh
$ npm start
```

A flag in the React app hard-codes a development path to ping, which relies on the port; if you change ports, make sure to change the code there too!

## deployment

There are a few ways to deploy this app; since it's so small, a variety of solutions work (ex Heroku / Fly / EC2 / running your own server). Since no state is necessary, you can probably even run this as a lambda!

We've deployed a copy of *barista* at [https://barista.fly.dev](https://barista.fly.dev/), using [Fly](https://fly.io/). The included `Dockerfile` is a self-contained build process for the entire application: it builds the React app first, copies it into the next stage, and then builds and serves the Flask server with [gunicorn](https://gunicorn.org/).

## some other notes

### general project structure

- `src` roots the React app; all of the logic lives in `src/App.js`, and the React app's public folder is `public` (this gets copied into the Flask static serve)
- `app.py` is the root of the Flask server, and only handles parameter parsing and "general" webserver stuff
- `interpreters` has all the code related to execution
  - we've added an `executor.py` that wraps the entire interpreter run process (init, validate program, run)
  - the other code can be directly copy-pasted from a canonical solution; ensure that imports to be relative to filepath (ex `from . import intbase`)

### python & venv

We recommend using [venv](https://docs.python.org/3/library/venv.html) to manage your local Python installation.

After adding a new library to the venv, add it to `requirements.txt`:

```sh
$ pip freeze -l > requirements.txt
```

### this seems inefficient, why don't you ___

You're probably right :sweat_smile:. This is more of a quick-and-dirty solution than a thoroughly thought-through production app.

There's some low-hanging fruit:

- the `Dockerfile` stages are not as efficient/slim as they could be
- the `interpreters` structure is not well-designed; making it a module is probably a good first step
- we haven't configured web vitals, manifests, etc.
- the site is not mobile-friendly :(

And bigger picture,

- React is overkill for the frontend; we could certainly accomplish the same thing with preact or Flask templates, both of which would significantly reduce the bundle size and complexity of the build
- and, if we did stick with React, using a framework that's a bit more powerful/customizable than Create React App would let us eke out better performance / bundle size / ergonomics
- the code editing experience *could* be better -- for example, if we wrote a custom syntax highlighter for the language
- it may be possible to do *all* of this in WASM instead!


If you have any ideas, a PR is always welcome!
