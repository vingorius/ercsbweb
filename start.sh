#/usr/bin/bash
#nodemon ./bin/cluster.js
#forever ercsbweb
#tail -f /tmp/ercsbweb.log
forever start  --minUptime 1000 --spinSleepTime 1000 \
               --uid "ercsbweb" -l "/tmp/ercsbweb.log" --append \
               -c "/usr/local/bin/nodemon" \
               bin/cluster.js
#forever start  --minUptime 1000 --spinSleepTime 1000 \
               #--uid "ercsbweb" -l "/tmp/ercsbweb.log" --append \
               #-c "/usr/local/bin/nodemon" \
               #bin/www
