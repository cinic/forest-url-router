module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
      },
    ],
  ]
  const plugins = [
    [
      'effector/babel-plugin',
      {
        addLoc: true,
      },
    ],
  ]
  const env = {
    test: {
      presets: ['@babel/preset-typescript'],
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
