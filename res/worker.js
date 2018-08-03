(async () => {
    'use strict';

    const sha256 = require('sha256');
    const { parentPort, workerData } = require('worker_threads');

    parentPort.on('message', (msg) => {
        let { range } = msg;
        const shaArray = [];
        while(range-- > 0) {
            const hexStr = sha256(Math.random().toString());
            const hexBin = Buffer.from(hexStr);
            shaArray.push(hexBin);
        }

        parentPort.postMessage({ id: workerData.id, shaResult: Buffer.concat(shaArray) });
    });
})();