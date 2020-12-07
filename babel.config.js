module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        debug: false,
        modules: false,
        useBuiltIns: 'entry',
        corejs: 3,
        shippedProposals: true,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
  ]
  const plugins = [
    // [
    //   '@babel/plugin-transform-runtime',
    //   {
    //     regenerator: true,
    //   },
    // ],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // [
    //   'effector/babel-plugin',
    //   {
    //     exportMetadata: true,
    //     addLoc: true,
    //   },
    // ],
  ]
  const env = {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    },
  }

  return {
    presets,
    plugins,
    env,
  }
}
