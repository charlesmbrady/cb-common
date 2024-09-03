# Myorg

Uses Nx.dev

## Generate NEXT app

1. run `yarn nx g @nx/next:app app-name`
2. in the new app next.config.js, add the "output: 'export'" line
3. copy the entire "targets" for the @nx/next generator from nx.json and paste it over the "targets" in the new app project.js

TODO:

- [ ] Add a `@nx/next:component` generator
- [ ] Add a `@nx/next:page` generator
- [ ] Add a `@nx/next:api` generator
- [ ] Add a `@nx/next:lib` generator
- [ ] Add a `@nx/next:util` generator
- [ ] Add a `@nx/next:hook` generator
- [ ] Add a `@nx/next:context` generator
- [ ] Add a `@nx/next:service` generator
- [ ] Add a `@nx/next:middleware` generator
- [ ] Add a `@nx/next:config` generator
- [ ] Add a `@nx/next:plugin` generator
- [ ] Add a `@nx/next:theme` generator
- [ ] Add a `@nx/next:style` generator
- [ ] Add a `@nx/next:layout` generator
- [ ] Add a `@nx/next:component` generator

## Generate React App

1. run `yarn nx g @nx/react:app app-name`
2. copy the entire "targets" for the @nx/react generator from nx.json and paste it over the "targets" in the new app project.js

TODO:

- [ ] Add a `@nx/react:component` generator
- [ ] Add a `@nx/react:page` generator
- [ ] Add a `@nx/react:api` generator
- [ ] Add a `@nx/react:lib` generator
- [ ] Add a `@nx/react:util` generator
- [ ] Add a `@nx/react:hook` generator
- [ ] Add a `@nx/react:context` generator

General todo:

- make a script that does those project.json replacements for us and make a generator for that?
- make a script that does the next.config.js changes for us and make a generator for that?
- make a script that does the config.json changes for us for react apps and make a generator for that?
- make react have storybook for lib generators and component generators
- make react generator have HMR hot module replacement

- turn off node-e2e from generator for node bc idk how to work it
- see how to make node generator work with hot reload and nodemon
