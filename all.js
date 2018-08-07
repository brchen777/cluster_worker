(async () => {
    'use strict';

    const cluster = require('cluster');
    const cpu_num = require('os').cpus().length / 2;
    
    const masterProcess = async () => {
        console.log(`Master ${process.pid} is running.`);

        for (var i = 1; i <= cpu_num; i++) {
            console.log(`Forking process number ${i}...`);

            // path: `./${cwd_path}/${exec_path}`
            cluster.setupMaster({
                cwd: './another_project',
                exec: './c_worker.js',
                args: ['arg1', 'arg2']
            });
            
            const cluster_args = { id: i };
            cluster.fork(cluster_args);
        }
    }

    masterProcess();
})();


