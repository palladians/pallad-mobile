const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot, {
	isCSSEnabled: true,
});

const { transformer, resolver } = config;

// 1. Watch all files within the monorepo
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

config.transformer = {
	...transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};
config.resolver = {
	...resolver,
	assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg")],
	sourceExts: [...resolver.sourceExts, "svg"],
};

// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (moduleName === "o1js") {
//     return context.resolveRequest(context, "o1js/dist/web", platform);
//   }
//   return context.resolveRequest(context, moduleName, platform);
// };

module.exports = withNativeWind(config, { input: "./src/global.css" });
