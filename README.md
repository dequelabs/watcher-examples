# axe Watcher Examples

## Running an Example

1. [Set up an axe Watcher API key](https://axe.deque.com/settings)
1. Select an example (eg `cypress/basic`)
1. Install the example's dependencies
   ```sh
   cd cypress/basic
   npm install
   ```
1. Set your API key as an environment variable and run `npm test`
   ```sh
   API_KEY="YOUR API KEY" npm test
   ```
1. If you are using an axe DevTools server other than [axe.deque.com](https://axe.deque.com), specify its URL as an environment variable as well
   ```sh
   SERVER_URL="https://axe.yourcompany.com" API_KEY="YOUR API KEY" npm test
   ```
