(async () => {
    'use strict';

    const { Worker } = require('worker_threads');

    const arrayCount = 2000000;
    const threadCount = require('os').cpus().length;
    const range = (arrayCount / threadCount);
    const initialTime = new Date();
    let finishCount = 0;
    let allShaResult = [];

    for (let i = 0; i < threadCount; i++) {
        const worker = new Worker('./res/worker.js', { workerData: { id: i } });
        worker.on('message', (msg) => {
            // get sha256 result from each worker
            const { shaResult } = msg;
            allShaResult.push(shaResult);

            const now = new Date();
            console.log(`[worker ${worker.threadId} finish]: ${now - initialTime} ms`);

            finishCount++;
            // join all sha256 result
            if (finishCount === threadCount) {
                allShaResult = Buffer.concat(allShaResult);
                console.log(`All workers are finish`);
            }
        });
        worker.postMessage({ range });
    }
})();