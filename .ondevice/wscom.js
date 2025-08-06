const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8082 });
const { exec } = require('child_process');

console.log('WebSocket server running on ws://localhost:8082');

exec('mkdir screenshots');

wss.on('connection', (ws) => {
  console.log('Client connected');

  let currentStoryIndex = 0;
  let allStoryIds = [];

  const captureNextStory = () => {
    const nextIndex = currentStoryIndex++;
    const nextId = allStoryIds[nextIndex];
    ws.send(JSON.stringify({ type: 'capture', storyId: nextId }));
  }

  ws.on('message', (msg) => {
    if(msg.startsWith('allStoryIds')) {
        allStoryIds = JSON.parse(msg.split(':')[1]);
        console.info('allStoryIds', allStoryIds);
        captureNextStory();
    }

    if(msg.startsWith('snap')) {
        const storyId = msg.split(":")[1];
        console.log('snap of ', storyId);
        exec(`adb exec-out screencap -p > ./screenshots/${storyId}.png`, () => {
            console.info('snap taken for', storyId);
            captureNextStory();
        });
    }
  });
});