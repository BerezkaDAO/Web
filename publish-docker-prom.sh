docker tag rg.fr-par.scw.cloud/easychain/berezka/berezka-dashboard-new:latest cr.yandex/crplb38ladkov5f9q8bv/berezka-ui:prod
docker push cr.yandex/crplb38ladkov5f9q8bv/berezka-ui:prod

ssh toor@84.201.151.165 <<'ENDSSH'
    sh update.sh
ENDSSH
