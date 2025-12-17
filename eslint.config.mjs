import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  nextjs: true,
  react: true,
  typescript: true,
}, {
  rules: {
    'no-console': 'off',
    'ts/no-explicit-any': 'warn',
  },
})
