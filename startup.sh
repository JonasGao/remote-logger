#! /bin/bash
LOG_PATH=$1

if [ -z "$LOG_PATH" ]; then
  LOG_PATH="./logs"
fi

# /data/app_hs/var/log/remote-log
nohup node index.js > "$LOG_PATH/output" 2>&1 &
echo $! > pid
echo "PID: [$(cat pid)]"
