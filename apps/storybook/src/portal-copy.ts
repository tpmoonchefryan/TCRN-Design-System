import type { DocsLocale } from "./approved-source.js";

export const portalCopy = {
  "zh-CN": {
    home: "首页", chapters: "章节", references: "参考资料", skip: "跳到正文", footer: "Sites v1 · 规范内容",
    title: ['从设计基础', '到产品界面'],
    lead: '查阅 TCRN 的色彩、排版、品牌与组件用法，以及产品工作台的布局和交互规范。',
    browse: '浏览设计规范', source: '正式来源与版本信息',
    topics: {
      foundations: ['视觉基础', '查看色彩、排版与图标如何搭配，建立界面一致的视觉层级。'],
      brand: ['品牌标志', '查看四枚产品标及其字标和标语组合，选择适合场景的锁定块。'],
      components: ['交互组件', '从真实表单和动作示例查找控件状态、行为及组件接口。'],
      shell: ['产品壳层', '查看顶带、菜单、固定项和纸面工作区在产品中如何配合。'],
    },
    captions: ['排版与色彩', '产品锁定块', '表单与动作'],
  },
  "en": {
    home: "Home", chapters: "Chapters", references: "References", skip: "Skip to content", footer: "Sites v1 · Standard specimens",
    title: ['Design standards', 'for TCRN products'],
    lead: 'Explore the foundations, brand marks, interactive components, and workspace patterns used across TCRN products.',
    browse: 'Browse the standards', source: 'Published source and version',
    topics: {
      foundations: ['Visual foundations', 'See how color, type, and icons work together to organize an interface.'],
      brand: ['Brand marks', 'Explore the four product marks and their approved wordmark and tagline lockups.'],
      components: ['Interactive components', 'Find control states, behavior, and APIs through form and action examples.'],
      shell: ['Product shell', 'See how the top band, menus, pins, and workspace fit together.'],
    },
    captions: ['Typography and color', 'Product lockups', 'Forms and actions'],
  },
  "ja": {
    home: "ホーム", chapters: "章", references: "参考資料", skip: "本文へ移動", footer: "Sites v1 · 仕様のサンプル",
    title: ['デザインの基礎から', 'プロダクトの画面へ'],
    lead: 'TCRN の配色、タイポグラフィ、ブランド、コンポーネント、作業画面の仕様を確認できます。',
    browse: 'デザイン仕様を見る', source: '公開ソースとバージョン',
    topics: {
      foundations: ['ビジュアルの基礎', '色、文字、アイコンを組み合わせて、画面の情報に階層をつけます。'],
      brand: ['ブランドマーク', '4 つのプロダクトマークと、ワードマークやタグラインの組み合わせを確認します。'],
      components: ['操作コンポーネント', 'フォームと操作のサンプルから、状態、動作、API を確認します。'],
      shell: ['プロダクトシェル', '上部バー、メニュー、ピン、作業領域の構成を確認します。'],
    },
    captions: ['タイポグラフィと配色', 'ブランドの組み合わせ', 'フォームと操作'],
  },
  "ko": {
    home: "홈", chapters: "장", references: "참고 자료", skip: "본문으로 이동", footer: "Sites v1 · 규격 예제",
    title: ['디자인 기초부터', '제품 화면까지'],
    lead: 'TCRN 제품의 색상, 타이포그래피, 브랜드, 컴포넌트, 작업 화면 규격을 살펴보세요.',
    browse: '디자인 규격 보기', source: '공개 소스 및 버전',
    topics: {
      foundations: ['시각적 기초', '색상, 글꼴, 아이콘으로 화면의 정보에 일관된 위계를 만듭니다.'],
      brand: ['브랜드 마크', '네 가지 제품 마크와 워드마크, 태그라인 조합을 확인합니다.'],
      components: ['인터랙션 컴포넌트', '폼과 동작 예제에서 상태, 동작, API를 확인합니다.'],
      shell: ['제품 셸', '상단 바, 메뉴, 고정 항목, 작업 영역의 구성을 살펴봅니다.'],
    },
    captions: ['타이포그래피와 색상', '제품 로고 조합', '폼과 동작'],
  },
  "fr": {
    home: "Accueil", chapters: "Chapitres", references: "Références", skip: "Aller au contenu", footer: "Sites v1 · Exemples des normes",
    title: ['Des fondations', 'aux interfaces produit'],
    lead: 'Retrouvez les couleurs, la typographie, les marques, les composants et les modèles de navigation des produits TCRN.',
    browse: 'Consulter les normes', source: 'Source publiée et version',
    topics: {
      foundations: ['Fondations visuelles', 'Associez couleurs, typographie et icônes pour structurer une interface.'],
      brand: ['Marques produit', 'Découvrez les quatre marques produit, leurs signatures et leurs slogans.'],
      components: ['Composants interactifs', 'Retrouvez les états, les comportements et les API à partir des exemples de formulaires.'],
      shell: ['Structure produit', 'Explorez la barre supérieure, les menus, les favoris et l’espace de travail.'],
    },
    captions: ['Typographie et couleurs', 'Signatures de marque', 'Formulaires et actions'],
  },
} as const satisfies Record<DocsLocale, object>;
