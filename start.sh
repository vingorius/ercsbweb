#/usr/bin/bash
#nodemon ./bin/cluster.js
#forever ercsbweb
#tail -f /tmp/ercsbweb.log
forever start  --minUptime 1000 --spinSleepTime 1000 --uid "ercsbweb" -l "/tmp/ercsbweb.log" -a  -w bin/cluster.js
