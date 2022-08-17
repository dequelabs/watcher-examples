# axe DevTools Watcher WebdriverIO Example

Using axe DevTools Watcher WebdriverIO, you can integrate axe DevTools Watcher into your existing testing environment.
This example project demonstrates how axe DevTools Watcher works with WebdriverIO to detect accessibility issues.

## Prerequisites

- Node.js (LTS)

## Clone Project

Follow these steps to clone and navigate to the directory:

1. Clone this repo from GitHub.
2. Open the project in your favorite editor.
3. Navigate from the root of the repo to this example with the following command:

```sh
cd javascript/wdio
```

## Install Dependencies

Install the dependencies including **axe DevTools Watcher** for the project.

> **_NOTE:_**
> You need a valid license to use our APIs. For more information, see [Install from Deque’s Agora](https://docs.deque.com/devtools-html/4.0.0/en/node-pl-install-agora) page. After configuring the access to Deque's private registry, you can install the dependencies for this project.

The following command installs all the required dependencies to run this example project.

```sh
npm install
```

## Test Configuration

The axe server url to and axe watcher api key can be configured by setting
environmental variables named `AXE_SERVER_URL` and `AXE_WATCHER_API_KEY`, respectively.

## Run Tests

The **_test_** directory contains the example test file **`heroku.e2e.js`** that analyzes the page `https://the-internet.herokuapp.com/login` for accessibility issues.

The following command runs the test file in the **_test_** directory.

```sh
npm test
```

## Test Results

The test results will report directly to an axe server as the test is run.
