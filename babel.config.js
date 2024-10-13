const imageBabel = require("@unitools/babel-plugin-universal-image");
const path = require("node:path");

module.exports = (api) => {
	api.cache(true);
	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@unitools/image": "@unitools/image-expo",
						"@unitools/router": "@unitools/router-expo",
						"@unitools/link": "@unitools/link-expo",
						"@ledgerhq/devices/hid-framing":
							"@ledgerhq/devices/lib/hid-framing",
						"@ledgerhq/devices/ble": "@ledgerhq/devices/lib/ble",
						o1js: "o1js/dist/web",
					},
				},
			],
			"react-native-reanimated/plugin",
		],
	};
};
