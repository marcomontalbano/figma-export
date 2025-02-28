module.exports = {
  "reject": [],
  filterResults: (name, { upgradedVersionSemver }) => {
    if (
      name === '@types/node' && parseInt(upgradedVersionSemver?.major) >= 22 ||
      name === 'eslint' && parseInt(upgradedVersionSemver?.major) >= 9 ||
      name === '@typescript-eslint/eslint-plugin' && parseInt(upgradedVersionSemver?.major) >= 8 ||
      name === '@typescript-eslint/parser' && parseInt(upgradedVersionSemver?.major) >= 8 ||
      name === 'nock' && parseInt(upgradedVersionSemver?.major) >= 14
    ) {
      return false
    }

    return true
  }
}