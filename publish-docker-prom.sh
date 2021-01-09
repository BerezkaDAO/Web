docker tag rg.fr-par.scw.cloud/easychain/berezka/berezka-dashboard-new:latest cr.yandex/crplb38ladkov5f9q8bv/berezka-ui:prod
docker push cr.yandex/crplb38ladkov5f9q8bv/berezka-ui:prod

ssh toor@178.154.234.156 <<'ENDSSH'
    sh update.sh
ENDSSH