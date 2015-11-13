#/usr/bin/bash
#nodemon ./bin/cluster.js
#forever ercsbweb
#tail -f /tmp/ercsbweb.log
#PORT=80 forever start  --minUptime 1000 --spinSleepTime 1000 \
               #--uid "ercsbweb" -l "/tmp/ercsbweb.log" --append \
               #-c "/usr/local/bin/nodemon -w routes" \
               #bin/cluster.js
# run as superuser
PORT=3000 forever start  --minUptime 1000 --spinSleepTime 1000 \
               --uid "ercsbweb" -l "/tmp/ercsbweb.log" --append \
               -c "/usr/local/bin/nodemon -w routes" \
               bin/www
