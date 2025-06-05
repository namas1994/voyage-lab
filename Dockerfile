FROM node:22.14.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN rm -rf node_modules pnpm-lock.yaml package-lock.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN pnpm run -r build
RUN pnpm deploy --filter=@vl/brain-api --prod /prod/brain-api
RUN pnpm deploy --filter=@vl/brain-ui --prod /prod/brain-ui

FROM base AS brain-api
COPY --from=build /prod/brain-api/dist /app/brain-api/dist
COPY --from=build /prod/brain-api/node_modules /app/brain-api/node_modules
COPY --from=build /prod/brain-api/package.json /app/brain-api/package.json
WORKDIR /app/brain-api
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM nginx:1.28-alpine AS brain-ui
COPY --from=build /prod/brain-ui/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]