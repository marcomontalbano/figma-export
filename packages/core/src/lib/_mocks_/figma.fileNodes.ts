/* eslint-disable */

/**
 * https://www.figma.com/developers/api#get-file-nodes-endpoint
 * curl -H 'X-FIGMA-TOKEN: <personal access token>' 'https://api.figma.com/v1/files/RSzpKJcnb6uBRQ3rOfLIyUs5/nodes?ids=121:10,121:12,121:16,121:17,121:18,122:14,122:16,122:18,124:8,124:18,296:7,254:1,254:2,254:3'
 */

export const nodeIds = [
  '121:10',
  '121:12',
  '121:16',
  '121:17',
  '121:18',
  '122:14',
  '122:16',
  '122:18',
  '124:8',
  '124:18',
  '296:7',
  '254:1',
  '254:2',
  '254:3'
]

export const fileNodes = {
  "name": "Figma Export",
  "lastModified": "2020-08-07T19:41:05.27102Z",
  "thumbnailUrl": "https://s3-alpha-sig.figma.com/thumbnails/60531a63-8154-4541-a102-4866944dca19?Expires=1597622400&Signature=gl8THvbNcZgie-2qREIWgsNpGcsqoxrq-h2RXOZMOldSXbbJmOg9fG8Z9~wPU0YeEO9HwuMFs11RlEDt6xfhv4eSufFkrnKpcBB2DxZc29p4GumTtE4k~44Yz3VDIDFebYxChFTE2eGuMepwwxV3igPQSPkpbr5FreF-VwUL7e9neLlf8rVO34NoFx1141W6R8zyjSbLcA8Nn5qf-i6g7AkyFWVUzrJ383~demi7Ne3Z7yeVMaRp0pTiY3A73qa9tXswwrQW1kM~86K4uHHiSELuxf9zCke-I9-9xE9~-GE3pAf8ajPW~mfdP0qBfKAarEYqaKg~go3FENppv1U9xw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
  "version": "415432113",
  "role": "owner",
  "nodes": {
    "121:10": {
      "document": {
        "id": "121:10",
        "name": "color-1",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.9490196108818054,
              "g": 0.30588236451148987,
              "b": 0.11764705926179886,
              "a": 1
            }
          },
          {
            "blendMode": "NORMAL",
            "type": "GRADIENT_LINEAR",
            "gradientHandlePositions": [
              {
                "x": 0.5,
                "y": -3.0616171314629196e-17
              },
              {
                "x": 0.5,
                "y": 0.9999999999999999
              },
              {
                "x": 0,
                "y": 0
              }
            ],
            "gradientStops": [
              {
                "color": {
                  "r": 1,
                  "g": 1,
                  "b": 1,
                  "a": 1
                },
                "position": 0
              },
              {
                "color": {
                  "r": 1,
                  "g": 1,
                  "b": 1,
                  "a": 0
                },
                "position": 1
              }
            ]
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "121:12": {
      "document": {
        "id": "121:12",
        "name": "color-1-lighter",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 1,
              "g": 0.4470588266849518,
              "b": 0.3843137323856354,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "121:16": {
      "document": {
        "id": "121:16",
        "name": "color-2",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.6352941393852234,
              "g": 0.3490196168422699,
              "b": 1,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "121:17": {
      "document": {
        "id": "121:17",
        "name": "color-3",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.10196078568696976,
              "g": 0.7372549176216125,
              "b": 0.9960784316062927,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "121:18": {
      "document": {
        "id": "121:18",
        "name": "color-4",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.03921568766236305,
              "g": 0.8117647171020508,
              "b": 0.5137255191802979,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "122:14": {
      "document": {
        "id": "122:14",
        "name": "h1",
        "type": "TEXT",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 0,
          "height": 75
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [],
        "characters": "64px Roboto Regular",
        "style": {
          "fontFamily": "Roboto",
          "fontPostScriptName": null,
          "fontWeight": 400,
          "textAutoResize": "WIDTH_AND_HEIGHT",
          "fontSize": 24,
          "textAlignHorizontal": "LEFT",
          "textAlignVertical": "TOP",
          "letterSpacing": 0,
          "lineHeightPx": 28.125,
          "lineHeightPercent": 100,
          "lineHeightUnit": "INTRINSIC_%"
        },
        "characterStyleOverrides": [],
        "styleOverrideTable": {}
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "122:16": {
      "document": {
        "id": "122:16",
        "name": "h2",
        "type": "TEXT",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 0,
          "height": 75
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [],
        "characters": "64px Roboto Regular",
        "style": {
          "fontFamily": "Roboto",
          "fontPostScriptName": null,
          "fontWeight": 400,
          "textAutoResize": "WIDTH_AND_HEIGHT",
          "fontSize": 18,
          "textAlignHorizontal": "LEFT",
          "textAlignVertical": "TOP",
          "letterSpacing": 0,
          "lineHeightPx": 21.09375,
          "lineHeightPercent": 100,
          "lineHeightUnit": "INTRINSIC_%"
        },
        "characterStyleOverrides": [],
        "styleOverrideTable": {}
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "122:18": {
      "document": {
        "id": "122:18",
        "name": "regular-text",
        "type": "TEXT",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 0,
          "height": 56
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [],
        "characters": "48px Roboto Regular",
        "style": {
          "fontFamily": "Roboto",
          "fontPostScriptName": null,
          "fontWeight": 400,
          "textAutoResize": "WIDTH_AND_HEIGHT",
          "fontSize": 14,
          "textAlignHorizontal": "LEFT",
          "textAlignVertical": "TOP",
          "letterSpacing": 0,
          "lineHeightPx": 16.40625,
          "lineHeightPercent": 100,
          "lineHeightUnit": "INTRINSIC_%"
        },
        "characterStyleOverrides": [],
        "styleOverrideTable": {}
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "124:8": {
      "document": {
        "id": "124:8",
        "name": "drop-shadow",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [
          {
            "type": "DROP_SHADOW",
            "visible": true,
            "color": {
              "r": 0,
              "g": 0,
              "b": 0,
              "a": 0.25
            },
            "blendMode": "NORMAL",
            "offset": {
              "x": 3,
              "y": 4
            },
            "radius": 5
          }
        ]
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "124:18": {
      "document": {
        "id": "124:18",
        "name": "grid-12",
        "type": "FRAME",
        "blendMode": "PASS_THROUGH",
        "children": [],
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "clipsContent": true,
        "background": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 1,
              "g": 1,
              "b": 1,
              "a": 1
            }
          }
        ],
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 1,
              "g": 1,
              "b": 1,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "backgroundColor": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        },
        "layoutGrids": [
          {
            "pattern": "GRID",
            "sectionSize": 30,
            "visible": true,
            "color": {
              "r": 1,
              "g": 0,
              "b": 0,
              "a": 0.10000000149011612
            },
            "alignment": "MIN",
            "gutterSize": 0,
            "offset": 0,
            "count": -1
          }
        ],
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "296:7": {
      "document": {
        "id": "296:7",
        "name": "layer",
        "type": "RECTANGLE",
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [
          {
            "type": "DROP_SHADOW",
            "visible": true,
            "color": {
              "r": 0,
              "g": 0,
              "b": 0,
              "a": 0.25
            },
            "blendMode": "NORMAL",
            "offset": {
              "x": 0,
              "y": 4
            },
            "radius": 4
          },
          {
            "type": "LAYER_BLUR",
            "visible": true,
            "radius": 4
          }
        ]
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "254:1": {
      "document": {
        "id": "254:1",
        "name": "black",
        "visible": false,
        "type": "RECTANGLE",
        "locked": true,
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.10588235408067703,
              "g": 0.12156862765550613,
              "b": 0.13725490868091583,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "254:2": {
      "document": {
        "id": "254:2",
        "name": "f2",
        "visible": false,
        "type": "TEXT",
        "locked": true,
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.7686274647712708,
              "g": 0.7686274647712708,
              "b": 0.7686274647712708,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": [],
        "characters": "24px SF Pro Text Regular",
        "style": {
          "fontFamily": "SF Pro Text",
          "fontPostScriptName": "SFProText-Regular",
          "fontWeight": 400,
          "textAutoResize": "WIDTH_AND_HEIGHT",
          "fontSize": 24,
          "textAlignHorizontal": "LEFT",
          "textAlignVertical": "TOP",
          "letterSpacing": 0,
          "lineHeightPx": 36,
          "lineHeightPercent": 128,
          "lineHeightPercentFontSize": 150,
          "lineHeightUnit": "PIXELS"
        },
        "layoutVersion": 0,
        "characterStyleOverrides": [],
        "styleOverrideTable": {}
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    },
    "254:3": {
      "document": {
        "id": "254:3",
        "name": "#E1E4E8",
        "visible": false,
        "type": "RECTANGLE",
        "locked": true,
        "blendMode": "PASS_THROUGH",
        "absoluteBoundingBox": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": 100
        },
        "constraints": {
          "vertical": "TOP",
          "horizontal": "LEFT"
        },
        "fills": [
          {
            "blendMode": "NORMAL",
            "type": "SOLID",
            "color": {
              "r": 0.8823529481887817,
              "g": 0.8941176533699036,
              "b": 0.9098039269447327,
              "a": 1
            }
          }
        ],
        "strokes": [],
        "strokeWeight": 1,
        "strokeAlign": "INSIDE",
        "effects": []
      },
      "components": {},
      "schemaVersion": 0,
      "styles": {}
    }
  }
}
