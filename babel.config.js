module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel']
    //plugins: ['expo-router/babel'] // Ensure this line is correctly included
  };
};
