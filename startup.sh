#!/bin/bash
PORT=3000
LOG_PATH=/data/app_hs/var/log/remote-logger2
mkdir -p $LOG_PATH
nohup node index.js > "$LOG_PATH/output" 2>&1 &
echo $! > pid
echo "PID: [$(cat pid)]"

