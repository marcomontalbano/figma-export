# MOCKS

## Files Endpoint

https://www.figma.com/developers/api#files-endpoints

```sh
curl -H "X-FIGMA-TOKEN: $FIGMA_TOKEN" "https://api.figma.com/v1/files/RSzpKJcnb6uBRQ3rOfLIyUs5" > ./packages/core/src/lib/_mocks_/figma.files.json
```

## Get File Nodes Endpoint

https://www.figma.com/developers/api#get-file-nodes-endpoint

```sh
curl -H "X-FIGMA-TOKEN: $FIGMA_TOKEN" "https://api.figma.com/v1/files/RSzpKJcnb6uBRQ3rOfLIyUs5/nodes?ids=121:10,121:12,121:16,121:17,121:18,122:14,122:16,122:18,124:8,124:18,296:7,330:1,336:5,339:0,339:1,339:2,339:3,339:5,339:7,341:2,376:2,376:9,376:13,376:15,400:33,254:1,254:2,254:3" > ./packages/core/src/lib/_mocks_/figma.fileNodes.json
```
