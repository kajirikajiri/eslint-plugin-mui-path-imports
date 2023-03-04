## generate paths
```
npm run generate
```

output `lib/rules/path-import-paths.json`

## generate pathsの仕組み
1. typescript-language-serverを起動
2. import { } from '${packageName}/'に対してcompletionを実行し、importできるパスを取得
3. 取得したパスを実際にimportした.tsxファイルを作成、ts-lintを実行し、importできないパスを削除

## TODO
- [ ] Muiのバージョンごとに生成する必要があるかも？
- [ ] 生成したファイルの精度を検証するために、Typescript Language Serverが構文エラーを出力する方法を調べる