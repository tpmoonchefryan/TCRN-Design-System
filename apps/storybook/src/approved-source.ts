// Exact published-source identities; candidate package version is a separate fact.
export const approvedSource = {
  "site": {
    "projectId": "appgprj_6ad4ec31ec7c8191aa3b577750b37a34",
    "versionNumber": 2,
    "versionId": "appgprj_6ad4ec31ec7c8191aa3b577750b37a34~appgver_d2ede1fba6088191ab19e40407436d67",
    "deploymentId": "appgdep_6af139e94a488191b76843d9bd904deb",
    "deploymentStatus": "succeeded",
    "url": "https://tcrn-ds-visual-standards.zbnubhmldz3270.chatgpt.site",
    "sourceCommit": "e76b7272d98c0359a57c42d49bf70d64e5b4c2ad",
    "originalDocumentSha256": "6c8a9f442a59632744f4af97ae9ae66223197098e3b87f5506381a771211731d"
  },
  "boards": [
    {
      "slug": "01-tokens",
      "sourceId": "db5cf377-a278-4e21-96e1-fe241768fe93",
      "title": "01 · 底盘 Token"
    },
    {
      "slug": "02-typography",
      "sourceId": "78ffb0ce-6861-4895-a5b3-e33607db0200",
      "title": "02 · 字体 Typography"
    },
    {
      "slug": "03-icons",
      "sourceId": "9cf67430-d184-45f0-a3bd-8da8447d7e79",
      "title": "03 · 图标 Icon"
    },
    {
      "slug": "04-brand",
      "sourceId": "ee0f582f-d81c-47f4-8a5b-d16631584d81",
      "title": "04 · 品牌 Brand · 产品标"
    },
    {
      "slug": "05-actions",
      "sourceId": "f3436fe2-995c-46d6-aa73-f121fac5db2d",
      "title": "05 · 动作 Actions"
    },
    {
      "slug": "06-inputs",
      "sourceId": "eced7b64-8310-442f-8b69-3696360269eb",
      "title": "06 · 表单控件 Inputs"
    },
    {
      "slug": "07a-shell-upper",
      "sourceId": "74786e48-536f-4d84-9894-1bc55df2ab45",
      "title": "07a · 壳层 · 顶带壳 · 标三版、三态、矩阵、动效"
    },
    {
      "slug": "07b-shell-lower",
      "sourceId": "19d5fc40-2c24-4b4c-a9fa-784c2e5ae161",
      "title": "07b · 壳层 · 顶带壳 · 几何、契约、token、门"
    }
  ]
} as const;
export type ApprovedBoardId=(typeof approvedSource.boards)[number]["slug"];
export const supportedLocales=["zh-CN","en","ja","ko","fr"] as const;
export type DocsLocale=(typeof supportedLocales)[number];
export function resolveDocsLocale(value:string):DocsLocale{return supportedLocales.includes(value as DocsLocale)?value as DocsLocale:"en";}
