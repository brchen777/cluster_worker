(async () => {
    'use strict';

    // Worker Threads Worker
    const { parentPort, workerData } = require('worker_threads');

    parentPort.postMessage(`process_id: ${workerData.process_id}, thread_id: ${workerData.thread_id} in another_project`);
})();