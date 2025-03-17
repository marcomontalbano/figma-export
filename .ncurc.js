module.exports = {
  reject: [],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      (name === '@types/node' &&
        Number.parseInt(upgradedVersionSemver?.major) >= 22) ||
      (name === 'undici' && Number.parseInt(upgradedVersionSemver?.major) >= 7)
    ) {
      return false;
    }

    return true;
  },
};
