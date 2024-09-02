echo "
cd /home/app && npm i $*
" | docker-compose run --rm -T node bash