nohup node index.js > /data/app_hs/var/log/remote-log 2>&1 &
echo $! > pid
echo "PID: [$(cat pid)]"
