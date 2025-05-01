# ncsuguessr

ncsuguessr is a North Carolina State University-themed geography game inspired by GeoGuessr. Test your knowledge of the NC State campus as you guess locations based on images and landmarks.

## Features

- Explore and guess iconic NC State landmarks.
- Test your knowledge of the campus layout.
- Contribute photos to be featured in future puzzles.

## Game Rules

- Each day, you'll be shown a random location from the NC State campus.
- Guess the correct location by placing a marker on the map.
- Earn points based on accuracy—the closer your guess, the higher your score.

## Prerequisites

Before you begin developing, ensure you have the following installed:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en)
- [Expo Go](https://expo.dev/go) (on your phone)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (VSCode Extension)
- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (VSCode Extension)
- nvm
  - [Windows](https://github.com/coreybutler/nvm-windows)
  - [MacOS](https://github.com/nvm-sh/nvm)

Optional VSCode Extensions:

- [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
- [vscode-pets](https://marketplace.visualstudio.com/items?itemName=tonybaloney.vscode-pets)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/NCSU-App-Development-Club/ncsuguessr.git
   cd ncsuguessr
   cd mobile # enter the directory with the mobile app
   ```

2. Install and use Node.js version 22.9.0 with nvm:

   ```bash
   nvm install
   ```

   If you ever change Node.js versions for a different project, be sure to run `nvm use` from the project root to switch back to this project's Node.js version (22.9.0).

3. Install the necessary node modules:

   ```bash
   npm install
   ```

4. Start the application:

   ```
   npm run start
   ```

5. Scan the QR code in the terminal with your phone.

## Contribution - App Development Club Members Only

You and your small group will be assigned [issues](https://github.com/NCSU-App-Development-Club/ncsuguessr/issues) to work on as a team. For each issue, do the following:

1. Create a new branch from the development branch:
   ```bash
   git checkout development
   git checkout -b <feature-branch-name>
   ```
2. Push your new branch:
   ```bash
   git push --set-upstream origin <feature-branch-name>
   ```
3. Work on your new branch as usual.
4. When your branch is ready for review, open a Pull Request.

---

Wolfpack up and test your campus knowledge with **ncsuguessr**! Go Pack!

## Misc

```
npm install @tailwindcss/oxide-linux-x64-gnu lightningcss-linux-x64-gnu && npm install && npm run build-web && mv dist/assets/node_modules/* dist/assets/ && find dist/_expo/static/js/web/ -type f -print0 | xargs -0 sed -i 's/assets\/node_modules/assets/g'
```
