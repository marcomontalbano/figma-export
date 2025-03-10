module.exports = {
  reject: [],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      name === '@types/node' &&
      Number.parseInt(upgradedVersionSemver?.major) >= 22
    ) {
      return false;
    }

    return true;
  },
};
