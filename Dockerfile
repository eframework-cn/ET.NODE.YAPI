# build phase
FROM node:12.22.8 AS BUILD_IMAGE

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /build
COPY . /build

RUN yarn install --registry https://registry.npmmirror.com && \
    npm run build-client && \
    npm prune --production

# runtime phase
FROM node:12-alpine

WORKDIR /var/yapi
COPY --from=BUILD_IMAGE /build /var/yapi

EXPOSE 3000
ENV TZ="Asia/Shanghai"

CMD npm run start