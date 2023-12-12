# GitHub Actions Workflow for Bit Demo
This demo showcase how you can implement Git feature branching workflow with Bit components.

# Step 1: Building and Testing Feature Branches
When you start implementing a new feature, you may create a new branch in Git. And, once the feature is complete, you can commit the modified components and push the changes to GitHub feature branch.

This GitHub Actions task [verify](/.github/workflows/1-verify.yml) is there to check whether all the components are in order.

```
name: Demo Bit Verify
on:
  push:
    branches:
      - '*' # all feature branches
      - '!main' # excludes main
jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
            ws-dir: 'demo'
      - name: Bit Verify
        uses: bit-tasks/verify@v1
```

**Note:** This tasks runs after pushing to a feature branch except `main`.

# Step 2: Building and Testing Pull Request
Once your feature branch is ready to send a Pull Request, you can create one using GitHub. After creating it, the GitHub Actions task [pull-request](/.github/workflows/2-pull-request.yml) get trigged. It does several important things.

```
name: Demo Bit Pull Request
on:
  pull_request:
    types:
      - opened
      - synchronize
permissions:
  pull-requests: write
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1 
        with:
            ws-dir: 'demo'
      - name: Bit Pull Request
        uses: bit-tasks/pull-request@v1
```

1. Runs the component build and tests to ensure the components are in order.
2. Creates a **test lane** in Bit cloud and push the modified components to it and finally creates a GitHub comment inside the Pull Request with the link to the lane. This lane is useful for the Pull Request reviewer to check all the modified components that includes in the Pull Request.
3. Additionally, cleans up the **test lane** and create a new one, upon changing the branch code.


# Step 3: Tag and Export Components and Commit updated Bitmap file
Once the Pull Request is merged to the `main` branch in Git, the GitHub Actions task [tag-export-commit-bitmap](/.github/workflows/3-tag-export-commit-bitmap.yml) gets trigged, which tags and export the modified component into Bit cloud. After that, it commits back the updated `.bitmap` file that contains the newly tagged versions of the components.

```
name: Demo Bit Tag and Export and Commit Bitmap
on:
  push:
    branches:
      - main
permissions:
  contents: write
jobs:
  release:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
            ws-dir: 'demo'
      - name: Bit Tag and Export
        uses: bit-tasks/tag-export@v1
      - name: Commit Bitmap
        uses: bit-tasks/commit-bitmap@v1
```

# Step 4: Cleanup Test lanes
After merging the Pull Request, you may find several danggling lanes in Bit cloud. If you want to clean them up, you can do it by running the GitHub Actions task [lane-cleanup](/.github/workflows/4-lane-cleanup.yml) which get trigged upon merging (closing) the Pull Request.

```
name: Demo Bit Lane Cleanup
on:
  pull_request:
    types:
      - closed
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GIT_USER_NAME: ${{ secrets.GIT_USER_NAME }}
      GIT_USER_EMAIL: ${{ secrets.GIT_USER_EMAIL }}
      BIT_CONFIG_USER_TOKEN: ${{ secrets.BIT_CONFIG_USER_TOKEN }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Initialize Bit
        uses: bit-tasks/init@v1
        with:
            ws-dir: 'demo'
      - name: Bit Lane Cleanup
        uses: bit-tasks/lane-cleanup@v1
```