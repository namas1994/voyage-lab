# Instructions

```sh
# pushing docker images to gcp

pnpm sh ./scripts/docker-tag-push.sh gcr.io/YOUR-PROJECT-ID
```

``` sh
# install in gcp using helm
helm install my-release ./chart-name --set global.registry.url="gcr.io/YOUR-PROJECT-ID"
```

