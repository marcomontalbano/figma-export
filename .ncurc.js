module.exports = {
  reject: [],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      (name === '@types/node' &&
        Number.parseInt(upgradedVersionSemver?.major) >= 22) ||
      (name === 'nock' && Number.parseInt(upgradedVersionSemver?.major) >= 14)
    ) {
      return false;
    }

    return true;
  },
};
