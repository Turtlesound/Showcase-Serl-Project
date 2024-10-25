# ShowcaseSERL

ShowcaseSERL is a curated collection of student and researcher- developed projects. It serves as a public portfolio for finished projects and inspires students to contribute their project ideas.

## prerequisites

You need node 18.17.0 or newwer for the project to run

nvm install node

## install

First, install the development server:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

## Vercel

I have had the project hosted on vercel and i would highly recommend them.

Here is the project currently hosted by them.

https://showcase-serl-project.vercel.app/

## kiosk

```
http://localhost:3000/kiosk goes to a standard kiosk mode that change project automatically going though all the available projects.
http://localhost:3000/kiosk/search/yoursearch will show all projects that have "yoursearch" in them. You can change it to poke and it will show all projects with poke in them.
http://localhost:3000/kiosk/pokedex if you change pokedex to another id of the project it will show the project in kiosk mode.

For example you can go to
http://localhost:3000/projects/
enter the generative-ai-for-beginners project, You will be redirected to http://localhost:3000/projects/generative-ai-for-beginners then go to
http://localhost:3000/kiosk/generative-ai-for-beginners to get the kiosk for the project.
```

## Development

To ensure a consistent code style, this project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). You can run the following command to check for linting errors and format the code:

```bash
npm run lint
npm run format:fix
```

## Starting the project in build.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
