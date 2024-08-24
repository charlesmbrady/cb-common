# cb-common

monorepo for portfolio apps and other shared code

Uses Nx.dev

## Generate NEXT app

1. run `yarn nx g @nx/next:app app-name`
2. in the new app next.config.js, add the "output: 'export'" line
3. copy the entire "targets" for the @nx/next generator from nx.json and paste it over the "targets" in the new app project.js

TODO:

1. run `yarn nx g @nx/react:app app-name`
2. copy the entire "targets" for the @nx/react generator from nx.json and paste it over the "targets" in the new app project.js
