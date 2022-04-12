# Competl
Competl is a [Next.js](https://nextjs.org/) project built by Group 10, Oscar Wong, Jan Jelinek, Michael Jeremy Olea, and Antonio Santos.

The code is hosted on GitHub at https://github.com/oscarwong67/Competl.

## Getting Started

First, ensure you have [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). 

Optionally, you can also get the global package, [pnpm](https://pnpm.io/installation), which makes node_modules smaller via hard-linking.

First, install dependencies:
```bash
npm install
# or, if you want a smaller node_modules size
pnpm install
# more info: https://pnpm.io/installation
```

Next, make sure you have the `.env.development` file included in the ZIP folder submitted on D2L. This file is NOT included in the public GitHub repository, as that is bad security practice (and GitHub is currently rolling out automatic secret detection to prevent secrets from ever being pushed). 

The entries in it should look like the following:

```bash
# env example

vNEXTAUTH_URL=
NEXTAUTH_SECRET=

# the following entries are REQUIRED to sign in and connect to the db

GOOGLE_ID=
GOOGLE_SECRET=

GITHUB_ID=
GITHUB_SECRET=

MONGODB_URI=
```

Make sure it's named `.env.development` - the dot at the beginning is important!

Next, run the development server:

```bash
npm run dev
# or
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result, once the above server is finished compiling.