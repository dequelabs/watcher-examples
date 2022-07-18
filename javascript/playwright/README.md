# axe DevTools Watcher Playwright Example

Using axe DevTools Watcher Playwright, you can integrate axe DevTools Watcher into your existing testing environment. 
This example project demonstrates how axe DevTools Watcher works with Playwright to detect accessibility issues.

## Prerequisites
- yarn (1.22.x)
- NodeJS (6.10 or higher)

## Clone Project

Follow these steps to clone and navigate to the directory:
1. Clone this repo from GitHub.
2. Open the project in your favourite editor.
3. Navigate from the root of the repo to this example with the following command:

```sh
cd javascript/playwright
```

## Install Dependencies

Install the dependencies including **axe DevTools Watcher** for the project.

> **_NOTE:_**
>You need a valid license to use our APIs. For more information, see [Install from Deque’s Agora](https://docs.deque.com/devtools-html/4.0.0/en/node-pl-install-agora) page. After configuring the access to Deque's private registry, you can install the dependencies for this project.

The following command installs all the required dependencies to run this example project.

```sh
yarn
```

## Test Configuration

The axe server url to and axe watcher api key can be configured by setting 
environmental variables named `AXE_SERVER_URL` and `AXE_WATCHER_API_KEY`, respectively.

## Run Tests

The **_tests_** directory contains the example test file **`heroku.e2e.ts`** that analyzes the page `https://the-internet.herokuapp.com/login` for accessibility issues.

The following command runs the test file in the **_tests_** directory.

```sh
yarn test
```

## Test Results

The test results will report directly to an axe server as the test is run.