# Instructions
```sh
# build pushing docker images to gcp

pnpm sh ./scripts/docker-build-push.sh
```

```sh
# pushing docker images to gcp

pnpm sh ./scripts/docker-tag-push.sh asia-southeast1-docker.pkg.dev/sustained-hold-460714-m3
```

``` sh
# install in gcp using helm
helm install my-release ./chart-name --set global.registry.url="asia-southeast1-docker.pkg.dev/sustained-hold-460714-m3"
```


gcloud container clusters get-credentials autopilot-cluster-2 --region asia-south1 --project sustained-hold-460714-m3