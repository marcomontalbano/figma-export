# Contributing

## Developing

### Release Life Cycle

1. Create a pull request for each development
1. Add a label to each pull request
1. Create a new version from `master` with `npm run lerna:version`
1. `release` workflow will attach the release notes to a brand new draft release
1. Manually publish the release from GitHub
1. `publish` workflow will publish the release to NPM registry
