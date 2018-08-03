(async () => {
    'use strict';

    const cluster = require('cluster');
    const http = require('http');
    const cpu_num = require('os').cpus().length;
    
    const masterProcess = async () => {
        console.log(`Master ${process.pid} is running.`);

        for (var i = 0; i < cpu_num; i++) {
            console.log(`Forking process number ${i}...`);
            cluster.fork();
        }

        clusterEventHandle();
    }
    
    const workerProcess = async () => {
        console.log(`Worker ${process.pid} started.`);
        
        // Create server
        http.createServer((req, res) => {
            res.writeHead(200);
            res.end('Hello World!\n');
        }).listen(7000, 'localhost');

        workerEventHandle();
    }

    const clusterEventHandle = () => {
        cluster.on('fork', (worker) => {
            console.log(`Worker ${worker.process.pid} is fork.`);
        });

        // Master receives message from worker
        cluster.on('message', (worker, msg) => {
            console.log(`Master ${process.pid} receives message '${JSON.stringify(msg)}' from worker ${worker.process.pid}`);
        });
        
        cluster.on('online', (worker) => {
            console.log(`Worker ${worker.process.pid} is online.`);
        });

        cluster.on('disconnect', (worker) => {
            console.log(`Worker ${worker.process.pid} has disconnected.`);
        });
        
        // If worker exit, trigger restart
        cluster.on('exit', (worker, code, signal) => {
            if (worker.exitedAfterDisconnect === true) {
                console.log(`Worker ${worker.process.pid} active exit, no need to worry.`);
                return;
            }

            // If worker is not Active exit, trigger restart, trigger restart
            console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}.`);
            console.log('Starting a new worker.');
            cluster.fork();
        });

        cluster.on('listening', (worker, address) => {
            console.log(`Worker ${worker.process.pid} is now connected to ${address.address}:${address.port}.`);
            
            // worker.send('shutdown');
            worker.send({a: 123, b: 'qq'});
        });
    }

    const workerEventHandle = () => {
        // Worker receives message from master
        process.on('message', (msg) => {
            console.log(msg);
            if (msg === 'shutdown') {
                console.log(`Worker ${process.pid} receives message '${msg}' from master.`);

                // Worker sends message to master
                process.send({ msg: `Message from worker ${process.pid}` });

                // Worker disconnect and kill
                cluster.worker.disconnect();
                setTimeout(() => {
                    cluster.worker.kill();
                }, 1500);
            }
        });

        process.on('exit', (code, signal) => {
            if (signal) {
              console.log(`Worker ${process.pid} was killed by signal: ${signal}`);
            }
            else if (code !== 0) {
              console.log(`Worker ${process.pid} exited with error code: ${code}`);
            }
            else {
              console.log(`Worker ${process.pid} exited success!`);
            }
        });
    };

    if (cluster.isMaster) {
        masterProcess();
    }
    else if (cluster.isWorker) {
        workerProcess();
    }
})();


