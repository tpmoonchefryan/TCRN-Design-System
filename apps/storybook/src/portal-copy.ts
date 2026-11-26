import type { DocsLocale } from "./approved-source.js";

export type ExtraDocsPageId =
  | "seasonal-halloween"
  | "brand-tms"
  | "brand-einzbern"
  | "brand-mana-orchestrate"
  | "brand-design-system"
  | "brand-voxward"
  | "brand-platform"
  | "feedback-data"
  | "layout-overlays"
  | "public-site"
  | "shell-extended";

type ExtraPageMeta = { readonly title: string; readonly summary: string };

export const portalCopy = {
  "zh-CN": {
    storybookNavigation: "组件开发与测试", home: "首页", overview: "概览", chapters: "章节", skip: "跳到正文",
    title: ['从设计基础', '到产品界面'],
    lead: '查阅 TCRN 的色彩、排版、品牌与组件用法，以及产品工作台的布局和交互规范。',
    browse: '浏览设计规范',
    topics: {
      foundations: ['视觉基础', '查看色彩、排版、图标与季节主题如何搭配，建立一致的视觉层级。'],
      brand: ['品牌标志', '查看品牌规范与六枚产品标的三主题、字标及标语组合，选择适合场景的锁定块。'],
      components: ['交互组件', '从真实表单、动作、反馈、数据展示与浮层示例查找状态、行为及组件接口。'],
      shell: ['产品壳层', '查看顶带、菜单、固定项、扩展后台导航与纸面工作区如何配合。'],
    },
    captions: ['排版与色彩', '产品锁定块', '表单与动作'],
    extraPages: {
      "seasonal-halloween": {
        title: "季节主题 · 万圣节",
        summary: "可选万圣节季节层与浅色、夜间三主题的语义令牌、控件表面和壳层对照。",
      },
      "brand-tms": {
        title: "TCRN TMS",
        summary: "TCRN TMS 的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "brand-einzbern": {
        title: "Einzbern",
        summary: "Einzbern 的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "brand-mana-orchestrate": {
        title: "Mana Orchestrate",
        summary: "Mana Orchestrate 的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "brand-design-system": {
        title: "TCRN Design System",
        summary: "TCRN Design System 的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "brand-voxward": {
        title: "VoxWard",
        summary: "VoxWard 的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "brand-platform": {
        title: "TCRN Platform",
        summary: "TCRN Platform 母标的三主题变体、锁定块组合与彩色标尺寸阶梯。",
      },
      "feedback-data": {
        title: "反馈与数据展示",
        summary: "状态点、徽标、提示条、统计卡、自定义列宽表格、流程阶段与原始载荷框。",
      },
      "layout-overlays": {
        title: "布局与浮层",
        summary: "容器响应式设置布局、分栏视图、分段导航、底右锚定菜单、气泡与内联确认条。",
      },
      "public-site": {
        title: "公开站点与长文阅读",
        summary: "公开门户顶栏、页脚、长文政策纸面、左侧强调提示块及外部品牌图标。",
      },
      "shell-extended": {
        title: "扩展壳层 · VoxWard",
        summary: "右对齐后台图钉、分隔线、外链与禁用态、顶部环境横幅及可选季节主题切换。",
      },
    } satisfies Record<ExtraDocsPageId, ExtraPageMeta>,
  },
  "en": {
    storybookNavigation: "Component development and testing", home: "Home", overview: "Overview", chapters: "Chapters", skip: "Skip to content",
    title: ['Design standards', 'for TCRN products'],
    lead: 'Explore the foundations, brand marks, interactive components, and workspace patterns used across TCRN products.',
    browse: 'Browse the standards',
    topics: {
      foundations: ['Visual foundations', 'See how color, type, icons, and seasonal themes work together to organize an interface.'],
      brand: ['Brand marks', 'Explore brand guidelines and all six product marks across three themes, wordmarks, and taglines.'],
      components: ['Interactive components', 'Find control states, feedback, data display, layout, overlays, and component APIs.'],
      shell: ['Product shell', 'See how the top band, menus, pins, backoffice navigation, and workspace fit together.'],
    },
    captions: ['Typography and color', 'Product lockups', 'Forms and actions'],
    extraPages: {
      "seasonal-halloween": {
        title: "Seasonal theme · Halloween",
        summary: "Opt-in Halloween seasonal layer compared alongside Day and Night across tokens, controls, and shell.",
      },
      "brand-tms": {
        title: "TCRN TMS",
        summary: "TCRN TMS mark renditions, lockups across three themes, and full color size ladder.",
      },
      "brand-einzbern": {
        title: "Einzbern",
        summary: "Einzbern mark renditions, lockups across three themes, and full color size ladder.",
      },
      "brand-mana-orchestrate": {
        title: "Mana Orchestrate",
        summary: "Mana Orchestrate mark renditions, lockups across three themes, and full color size ladder.",
      },
      "brand-design-system": {
        title: "TCRN Design System",
        summary: "TCRN Design System mark renditions, lockups across three themes, and full color size ladder.",
      },
      "brand-voxward": {
        title: "VoxWard",
        summary: "VoxWard mark renditions, lockups across three themes, and full color size ladder.",
      },
      "brand-platform": {
        title: "TCRN Platform",
        summary: "TCRN Platform mother mark renditions, lockups across three themes, and full color size ladder.",
      },
      "feedback-data": {
        title: "Feedback & Data Display",
        summary: "Status dots, badges, alerts, banners, stat cards, custom-track tables, pipelines, and raw payload boxes.",
      },
      "layout-overlays": {
        title: "Layout & Overlays",
        summary: "Container-responsive settings and split views, pill segmented nav, floating menus, popovers, tooltips, and confirmation bars.",
      },
      "public-site": {
        title: "Public Site & Editorial",
        summary: "Public portal headers and footers, wrapping editorial policy sheets, left-ruled notes, and external brand icons.",
      },
      "shell-extended": {
        title: "Extended shell · VoxWard",
        summary: "Right-aligned backoffice pins, hairline divider, external and disabled pins, top banner, and opt-in seasonal theme switching.",
      },
    } satisfies Record<ExtraDocsPageId, ExtraPageMeta>,
  },
  "ja": {
    storybookNavigation: "コンポーネントの開発とテスト", home: "ホーム", overview: "概要", chapters: "章", skip: "本文へ移動",
    title: ['デザインの基礎から', 'プロダクトの画面へ'],
    lead: 'TCRN の配色、タイポグラフィ、ブランド、コンポーネント、作業画面の仕様を確認できます。',
    browse: 'デザイン仕様を見る',
    topics: {
      foundations: ['ビジュアルの基礎', '色、文字、アイコン、季節テーマを組み合わせて、情報に一貫した階層をつけます。'],
      brand: ['ブランドマーク', 'ブランド規定と 6 つのプロダクトマークの 3 テーマ・ワードマーク・タグラインを確認します。'],
      components: ['操作コンポーネント', 'フォーム、アクション、フィードバック、データ表示、レイアウトとオーバーレイの仕様と API を確認します。'],
      shell: ['プロダクトシェル', '上部バー、メニュー、ピン、拡張ナビゲーション、作業領域の構成を確認します。'],
    },
    captions: ['タイポグラフィと配色', 'ブランドの組み合わせ', 'フォームと操作'],
    extraPages: {
      "seasonal-halloween": {
        title: "季節テーマ · ハロウィン",
        summary: "オプトインのハロウィン層とライト・ナイトの 3 テーマにおけるトークン、コントロール、シェルの比較。",
      },
      "brand-tms": {
        title: "TCRN TMS",
        summary: "TCRN TMS の 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "brand-einzbern": {
        title: "Einzbern",
        summary: "Einzbern の 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "brand-mana-orchestrate": {
        title: "Mana Orchestrate",
        summary: "Mana Orchestrate の 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "brand-design-system": {
        title: "TCRN Design System",
        summary: "TCRN Design System の 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "brand-voxward": {
        title: "VoxWard",
        summary: "VoxWard の 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "brand-platform": {
        title: "TCRN Platform",
        summary: "TCRN Platform マザーマークの 3 テーマ比較、バリアント、ロックアップ、カラーサイズ一覧。",
      },
      "feedback-data": {
        title: "フィードバックとデータ表示",
        summary: "ステータスドット、バッジ、アラート、統計カード、可変幅テーブル、ステージ進捗、生ペイロード表示。",
      },
      "layout-overlays": {
        title: "レイアウトとオーバーレイ",
        summary: "コンテナ対応の設定レイアウト、分割ビュー、セグメントナビ、フローティングメニュー、ポップオーバーと確認バー。",
      },
      "public-site": {
        title: "公開サイトと長文ドキュメント",
        summary: "公開ポータル用ヘッダー・フッター、折り返し見出しの長文紙面、左線コールアウト、外部ブランドアイコン。",
      },
      "shell-extended": {
        title: "拡張シェル · VoxWard",
        summary: "右寄せバックオフィスピン、区切り線、外部リンク・無効状態、上部バナー、季節テーマ切替。",
      },
    } satisfies Record<ExtraDocsPageId, ExtraPageMeta>,
  },
  "ko": {
    storybookNavigation: "컴포넌트 개발 및 테스트", home: "홈", overview: "개요", chapters: "장", skip: "본문으로 이동",
    title: ['디자인 기초부터', '제품 화면까지'],
    lead: 'TCRN 제품의 색상, 타이포그래피, 브랜드, 컴포넌트, 작업 화면 규격을 살펴보세요.',
    browse: '디자인 규격 보기',
    topics: {
      foundations: ['시각적 기초', '색상, 글꼴, 아이콘과 시즌 테마로 일관된 시각 위계를 만듭니다.'],
      brand: ['브랜드 마크', '브랜드 가이드라인과 여섯 가지 제품 마크의 3테마, 워드마크, 태그라인 조합을 확인합니다.'],
      components: ['인터랙션 컴포넌트', '폼, 동작, 피드백, 데이터 표시, 레이아웃, 오버레이 예제와 API를 확인합니다.'],
      shell: ['제품 셸', '상단 바, 메뉴, 고정 항목, 확장 백오피스 내비게이션과 작업 영역의 구성을 살펴봅니다.'],
    },
    captions: ['타이포그래피와 색상', '제품 로고 조합', '폼과 동작'],
    extraPages: {
      "seasonal-halloween": {
        title: "시즌 테마 · 할로윈",
        summary: "선택형 할로윈 시즌 레이어와 라이트·나이트 3테마의 토큰, 컨트롤 및 셸 비교.",
      },
      "brand-tms": {
        title: "TCRN TMS",
        summary: "TCRN TMS의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "brand-einzbern": {
        title: "Einzbern",
        summary: "Einzbern의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "brand-mana-orchestrate": {
        title: "Mana Orchestrate",
        summary: "Mana Orchestrate의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "brand-design-system": {
        title: "TCRN Design System",
        summary: "TCRN Design System의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "brand-voxward": {
        title: "VoxWard",
        summary: "VoxWard의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "brand-platform": {
        title: "TCRN Platform",
        summary: "TCRN Platform 마더 마크의 3테마 비교, 변형, 로고 조합 및 컬러 크기 단계.",
      },
      "feedback-data": {
        title: "피드백 및 데이터 표시",
        summary: "상태 점, 배지, 알림, 배너, 통계 카드, 가변 열 테이블, 파이프라인 및 원본 페이로드 상자.",
      },
      "layout-overlays": {
        title: "레이아웃 및 오버레이",
        summary: "컨테이너 반응형 설정 및 분할 뷰, 세그먼트 내비게이션, 플로팅 메뉴, 팝오버 및 확인 바.",
      },
      "public-site": {
        title: "공개 사이트 및 문서 읽기",
        summary: "공개 포털 헤더와 푸터, 줄바꿈 장문 문서 시트, 좌측 강조 노트 및 외부 브랜드 아이콘.",
      },
      "shell-extended": {
        title: "확장 셸 · VoxWard",
        summary: "우측 정렬 백오피스 핀, 구분선, 외부 링크 및 비활성 핀, 상단 배너, 선택형 시즌 테마 전환.",
      },
    } satisfies Record<ExtraDocsPageId, ExtraPageMeta>,
  },
  "fr": {
    storybookNavigation: "Développement et test des composants", home: "Accueil", overview: "Aperçu", chapters: "Chapitres", skip: "Aller au contenu",
    title: ['Des fondations', 'aux interfaces produit'],
    lead: 'Retrouvez les couleurs, la typographie, les marques, les composants et les modèles de navigation des produits TCRN.',
    browse: 'Consulter les normes',
    topics: {
      foundations: ['Fondations visuelles', 'Associez couleurs, typographie, icônes et thèmes saisonniers pour structurer une interface.'],
      brand: ['Marques produit', 'Découvrez le guide de marque et les six symboles produit en trois thèmes, signatures et slogans.'],
      components: ['Composants interactifs', 'Retrouvez les formulaires, actions, retours, affichage de données, mises en page, superpositions et API.'],
      shell: ['Structure produit', 'Explorez le bandeau supérieur, les menus, les épingles, la navigation back-office et l’espace de travail.'],
    },
    captions: ['Typographie et couleurs', 'Signatures de marque', 'Formulaires et actions'],
    extraPages: {
      "seasonal-halloween": {
        title: "Thème saisonnier · Halloween",
        summary: "Couche saisonnière Halloween optionnelle comparée à Clair et Nuit sur les tokens, contrôles et coque.",
      },
      "brand-tms": {
        title: "TCRN TMS",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles de TCRN TMS.",
      },
      "brand-einzbern": {
        title: "Einzbern",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles d’Einzbern.",
      },
      "brand-mana-orchestrate": {
        title: "Mana Orchestrate",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles de Mana Orchestrate.",
      },
      "brand-design-system": {
        title: "TCRN Design System",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles de TCRN Design System.",
      },
      "brand-voxward": {
        title: "VoxWard",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles de VoxWard.",
      },
      "brand-platform": {
        title: "TCRN Platform",
        summary: "Variantes, blocs de marque en trois thèmes et échelle de tailles de TCRN Platform.",
      },
      "feedback-data": {
        title: "Retours et affichage de données",
        summary: "Points d’état, badges, alertes, bannières, cartes statistiques, tableaux flexibles, étapes et charge utile brute.",
      },
      "layout-overlays": {
        title: "Mise en page et superpositions",
        summary: "Réglages et vues scindées adaptatives, navigation segmentée, menus flottants, infobulles et barres de confirmation.",
      },
      "public-site": {
        title: "Site public et pages éditoriales",
        summary: "En-tête et pied de page publics, feuilles éditoriales longues, notes à filet latéral et icônes de marque externes.",
      },
      "shell-extended": {
        title: "Coque étendue · VoxWard",
        summary: "Épingles back-office alignées à droite, séparateur, liens externes et désactivés, bandeau supérieur et thème saisonnier.",
      },
    } satisfies Record<ExtraDocsPageId, ExtraPageMeta>,
  },
} as const satisfies Record<DocsLocale, object>;
