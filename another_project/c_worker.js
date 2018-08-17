(async () => {
    'use strict';

    // Cluster Worker
    const { Worker } = require('worker_threads');
    const { env } = process;
    const thread_cnt = 2;
    let finish_cnt = 0;

    console.log(process.argv.slice(2));
    for (let i = 1; i <= thread_cnt; i++) {
        const wt_worker_args = { process_id: env.id, thread_id: i };
        const wt_worker = new Worker('./wt_worker.js', { workerData: wt_worker_args });

        wt_worker.on('message', (msg) => {
            console.log(msg);

            ++finish_cnt;
            if (finish_cnt === thread_cnt) {
                console.log(`Process ${i} exiting.`);
                process.exit(0);
            }
        });
    }
})();