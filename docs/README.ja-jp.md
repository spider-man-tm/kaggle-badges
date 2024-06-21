# Profile Kaggle Badges

[English](../README.md) | [Japanese](./README.ja-jp.md)

## 概要

このプロジェクトは、Kaggle ランクに基づいてバッジを自動生成します。各カテゴリ（コンペティション、データセット、ノートブック、ディスカッション）に対して様々なスタイルのバッジを作成します。GitHub Actions Workflow として利用することで、あなたの GitHub プロフィールページを充実させることができます。

(例: https://github.com/spider-man-tm)

以下はコンペティション用のバッジのリストです。同様のスタイルのバッジがデータセット、ノートブック、ディスカッション用にも自動生成されます。

| Grandmaster                                                    | Master                                               | Expert                                               | Contributor                                                    |
| -------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| [![Grandmaster](./images/Grandmaster/plastic-black.svg)]()     | [![Master](./images/Master/plastic-black.svg)]()     | [![Expert](./images/Expert/plastic-black.svg)]()     | [![Contributor](./images/Contributor/plastic-black.svg)]()     |
| [![Grandmaster](./images/Grandmaster/plastic-white.svg)]()     | [![Master](./images/Master/plastic-white.svg)]()     | [![Expert](./images/Expert/plastic-white.svg)]()     | [![Contributor](./images/Contributor/plastic-white.svg)]()     |
| [![Grandmaster](./images/Grandmaster/flat-square-black.svg)]() | [![Master](./images/Master/flat-square-black.svg)]() | [![Expert](./images/Expert/flat-square-black.svg)]() | [![Contributor](./images/Contributor/flat-square-black.svg)]() |
| [![Grandmaster](./images/Grandmaster/flat-square-white.svg)]() | [![Master](./images/Master/flat-square-white.svg)]() | [![Expert](./images/Expert/flat-square-white.svg)]() | [![Contributor](./images/Contributor/flat-square-white.svg)]() |

## 使用方法

### 1. 専用リポジトリの作成

あなたの GitHub ユーザー名と同じ名前のリポジトリを作成してください。このリポジトリはあなたの GitHub プロフィールに表示されます。例えば、私の GitHub ユーザー名は spiderman-tm ですが、その場合リポジトリ名は spiderman-tm になります。

- 参考：[Managing your profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)

### 2. ワークフローの権限設定

リポジトリの設定で GitHub Actions を有効にする必要があります。設定 > Actions > General > Workflow Permissions > Read and write access から設定を変更してください。

<img src="./images/workflow-permissions.png" width="50%">

### 3. ワークフローディレクトリとファイルの作成

リポジトリのルートディレクトリに.github/workflows という名前のディレクトリを作成してください。その後、.github/workflows ディレクトリに YAML ファイルを作成してください。YAML ファイルの名前は任意で構いません。例えば、kaggle-badges.yml とします。

### 4. YAML ファイルに以下のコードを追加

以下のコードをコピーして YAML ファイルに貼り付けてください。{ Your Kaggle Username }をあなたの Kaggle ユーザー名に置き換えてください。Kaggle ユーザー名を直接 YAML ファイルに含めたくない場合は、GitHub Secrets に値を保存する方法もあります。お好みの方法を使用してください。

- ref. [Using secrets in workflow](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

```yaml
name: Profile Kaggle Badges

on:
  schedule:
    # You can change the cron expression to suit your needs
    - cron: "11 11 1 * *" # 11:11 AM on the 1st of every month
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install Puppeteer browser
        run: npx puppeteer browsers install chrome

      - name: Use Profile Kaggle Badges Action
        uses: spider-man-tm/kaggle-badges@v0.1.0
        with:
          # ex. user_name: spidermandance
          user_name: { Your Kaggle Username }
          # example of using GitHub Secrets
          # user_name: ${{ secrets.KAGGLE_USERNAME }}

      - name: Commit and Push SVG files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add ./kaggle-badges/*
          git commit -m "Add generated SVG files" || echo "No changes to commit"
          git push
```

### 5. 変更をリモートリポジトリにプッシュ

YAML ファイルをリポジトリにコミットおよびプッシュしてください。これにより、ワークフローが自動的に開始され、バッジが生成されてリポジトリにプッシュされます。

### 6. README.md にバッジを追加

以下のように README.md にリンクを追加してください。

例：

```markdown
# Markdown

![](./kaggle-badges/CompetitionsRank/plastic-black.svg)
```

```html
<!-- HTML -->
<img src="./kaggle-badges/CompetitionsRank/plastic-black.svg" />
```

以下は参考例です

- 例：[https://github.com/spider-man-tm](https://github.com/spider-man-tm)

## ローカル開発

最初に Node.js と Yarn が必要になるので準備してください。

以下のコマンドで必要なパッケージをインストールできるとともに、テストやジョブの実行が可能です。これらのコマンドは`package.json`に記載されています。

```shell
# Install dependencies
yarn install

# build
yarn build

# test
yarn test

# generate badges
yarn local-run
```

## License

MIT License

(C) 2024 Takayoshi MAKABE
