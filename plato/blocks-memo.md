# MAGELLAN BLOCKS メモ

# 接続URL
```
https://magellan-iot-<*****>-dot-<プロジェクトID>.appspot.com
```

## <*****>  
- エントリポイントを特定するための文字列
- 15〜27文字

## <プロジェクトID>
- GCPプロジェクトID
- 6〜30文字
- 先頭はアルファベット小文字でなければならない


# APIトークン
- 64文字(多分)


# データ
```JSON
{
  "api_token": "************************",
  "logs": [
    {
      "type": "message",
      "attributes": {
        "date": 1473642000,
        "name": "device_001",
        "message": "hello"
      }
    }
  ]
}
```

### "date"
- UNIX時間で指定する(1970/1/1 00:00:00からの経過時間) (EPOCH_DAYS = 719163)
- グレゴリオ暦元年元日からの経過日数はフェアフィールドの公式で求められる
```
365*(y-1)+(y/4)-(y/100)+(y/400)+31+28+1+(306*(m+1)/10)-122+(d-1)
```
- 日数 * 24*60*60 + (時間-GMTとの時差)*3600 + 分*60 + 秒

# フローの実行  
https://www.magellanic-clouds.com/blocks/guide/execution-flow/web-api/

