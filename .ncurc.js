module.exports = {
  reject: [],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      (name === '@types/node' &&
        Number.parseInt(upgradedVersionSemver?.major) >= 22) ||
      // https://github.com/nock/nock/issues/2789
      (name === 'nock' && Number.parseInt(upgradedVersionSemver?.major) >= 14)
    ) {
      return false;
    }

    return true;
  },
};
