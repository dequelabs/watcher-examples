# axe Watcher Examples

## Running an Example

1. [Set up an axe Watcher API key](https://axe.deque.com/settings)
1. [Set up an axe Watcher project ID](https://axe.deque.com/axe-watcher/projects)
1. Select an example (eg `cypress/basic`)
1. Install the example's dependencies
   ```sh
   cd cypress/basic
   npm install
   ```
1. Set your API key and project ID as environment variables, and run `npm test`
   ```sh
   API_KEY="YOUR API KEY" PROJECT_ID="YOUR PROJECT ID" npm test
   ```
1. If you are using an axe DevTools server other than [axe.deque.com](https://axe.deque.com), specify its URL as an environment variable as well
   ```sh
   SERVER_URL="https://axe.yourcompany.com" API_KEY="YOUR API KEY" PROJECT_ID="YOUR PROJECT ID" npm test
   ```

## Java examples

The [`java`](./java) directory holds Maven projects built and run with `mvn test` instead of npm.
See [`java/playwright`](./java/playwright) for the Playwright Java examples (auto analysis, manual
mode, and context wrapping) and its [README](./java/playwright/README.md) for prerequisites and run
instructions.
