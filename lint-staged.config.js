export default {
  '!(*.d).{js,ts}': () => ['yarn lint:fix', 'yarn coverage'],
};
