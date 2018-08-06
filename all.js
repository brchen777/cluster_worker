(async () => {
    'use strict';

    const cluster = require('cluster');
    const cpu_num = require('os').cpus().length;
    
    const masterProcess = async () => {
        console.log(`Master ${process.pid} is running.`);

        for (var i = 1; i <= cpu_num; i++) {
            console.log(`Forking process number ${i}...`);

            const cluster_args = { id: i };
            cluster.fork(cluster_args);
        }
    }

    if (cluster.isMaster) {
        masterProcess();
    }
    else if (cluster.isWorker) {
        require('./res/c_worker.js');
    }
})();


