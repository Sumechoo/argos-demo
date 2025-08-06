import * as Storybook from "@storybook/react-native";
import "./doctools";
import "./storybook.requires";
import { StatusBar } from "react-native";
const StorybookUIRoot = Storybook.getStorybookUI({
    onDeviceUI: true,
});

StatusBar.setHidden(true);

const modifiedStorybook = Storybook as any;

const allStoryIds = Object.keys(modifiedStorybook.store.storyIndex.stories).slice(0, 10);
const ws = new WebSocket('ws://localhost:8082');

console.info(Object.keys(modifiedStorybook));

ws.onopen = () => {
    console.info('allStoryIds', allStoryIds);
    setTimeout(() => {
        ws.send(`allStoryIds:${JSON.stringify(allStoryIds)}`);
    }, 4000);
};

const captureStory = async ({ data }: WebSocketMessageEvent) => {
    try {
        const { type, storyId } = JSON.parse(data);

        if (type === 'capture' && storyId) {
            console.info('Capturing story:', storyId);
            const alertStory = await modifiedStorybook.store.loadStory({storyId})
            const storyContext = await modifiedStorybook.store.getStoryContext(alertStory);
            modifiedStorybook.View._setStory(storyContext);

            ws.send(`snap:${storyId}`);
        }
    } catch (e) {
        console.error(e, data);
    }    
}

ws.onmessage = (e: WebSocketMessageEvent) => captureStory(e);

export default StorybookUIRoot;
