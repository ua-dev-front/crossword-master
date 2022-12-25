# Crossword Master
[Crossword Master](https://crossword-master.org) is a web crossword generator &amp; solver with an intuitive UI.

# What it can do

https://user-images.githubusercontent.com/53875005/209468785-38f21cc5-4b63-4277-b6cb-310e31b9f406.mp4

# Technologies used

The app is written in TypeScript/Python and makes use of the following technologies:
 - [`React`](https://reactjs.org) - for building UI.
 - [`Redux`](https://redux.js.org) - for state management.
 - [`Flask`](https://palletsprojects.com/p/flask) - for setting up the backend API.
 - [`ESlint`](https://eslint.org) - for keeping code clean.

Crossword generation and solving are implemented with the [backtracking algorithm](https://en.wikipedia.org/wiki/Backtracking), getting word definitions from [Datamuse API](https://www.datamuse.com/api).
