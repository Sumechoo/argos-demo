import { getStorybookUI } from "@storybook/react-native";
import "./doctools";
import "./storybook.requires";
const StorybookUIRoot = getStorybookUI({
    onDeviceUI: true,
});

export default StorybookUIRoot;
