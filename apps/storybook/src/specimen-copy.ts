import type { DocsLocale } from "./approved-source.js";

type SpecimenCopy = {
  themes: { light: string; dark: string };
  tokens: {
    token: string; themed: string; fixed: string; spacing: string;
    spacingIntro: string; paragraphs: string; groups: string; sections: string;
  };
  layout: {
    title: string; intro: string; standard: string; wide: string; wideInset: string; narrowInset: string;
  };
  matrix: string;
  icons: {
    sizes: string; geometry: string; glyph: string; hitArea: string;
    sm: string; md: string; lg: string; states: string;
    groups: Record<"navigation" | "find" | "actions" | "appearance" | "status" | "shell", string>;
  };
  brand: {
    guide: string; ladder: string; color: string; mono: string; tint: string; deep: string;
    tileUse: string; monoUse: string; lockups: string; shellUse: string; shellScale: string;
    full: string; compact: string; fullLine: string; compactLine: string;
  };
  shell: {
    marks: string; geometry: string; intro: string; band: string; menu: string;
    drop: string; "phone-closed": string; phone: string;
    original: string; fit: string; pan: string;
  };
};

export const specimenCopy = {
  "zh-CN": {
    themes: { light: "浅色", dark: "夜间" },
    tokens: {
      token: "令牌", themed: "主题值", fixed: "固定值",
      spacing: "文档中的间距",
      spacingIntro: "本页用已有间距值组织文字、样例和章节。",
      paragraphs: "段落间距", groups: "标题到内容、样例组间距", sections: "章节间距",
    },
    layout: {
      title: "Storybook 文档版式",
      intro: "文档栏居中，占满两侧留白之间的可用宽度，直至达到上限。07a 和 07b 的页头、正文、预览控件与桌面样张共用宽栏。手机样张从同一侧对齐，宽度最多 390 px。样张的原始尺寸由正式发布的 07 定义。",
      standard: "常规文档栏上限", wide: "宽栏上限（07a 和 07b）",
      wideInset: "视口宽于 750 px 时的单侧留白", narrowInset: "视口宽 750 px 及以下时的单侧留白",
    },
    matrix: "来源对比度矩阵",
    icons: {
      sizes: "图形尺寸与使用场景",
      geometry: "绘制坐标为 20 × 20，活动区为 16 × 16 单位，四边各留 2 格。三档描边恒为 1.25 px，颜色继承宿主。",
      glyph: "图形", hitArea: "独立按钮热区",
      sm: "带文字的按钮、说明文字或小号独立按钮。",
      md: "导航、大号带文字按钮或中号独立按钮。",
      lg: "大号独立操作按钮。",
      states: "控件与状态样例",
      groups: { navigation: "导航与布局", find: "查找与参照", actions: "操作与编辑", appearance: "设置与外观", status: "状态与反馈", shell: "产品壳层图钉（07）" },
    },
    brand: {
      guide: "产品标的尺寸与用法",
      ladder: "彩色标尺寸阶梯",
      color: "彩色标", mono: "单色标", tint: "淡底贴片", deep: "深底贴片",
      tileUse: "淡底贴片用于应用图标与产品切换菜单，深底贴片用于 favicon 和深色场合。",
      monoUse: "单色标用于打印、水印和限制用色的场合。",
      lockups: "锁定块与首行",
      shellUse: "07a 的桌面顶带使用 22 px 紧凑首行。展开的完整菜单在右下角用带描述的 22 px 紧凑锁定块作装饰。登入页使用带描述的 44 px 完整锁定块，44 px 首行用作完整尺度对照。",
      shellScale: "登入动效将标从 128 px 收至 22 px。这里的尺寸指图形标的大小。例如 TMS 的完整与紧凑字标分别为 16 和 12.5 px，描述行分别为 11.5 和 10.5 px。",
      full: "完整锁定块", compact: "紧凑锁定块", fullLine: "完整尺度首行", compactLine: "紧凑尺度首行",
    },
    shell: {
      marks: "顶带标与锁定块", geometry: "顶带与纸面的几何", intro: "登入动效",
      band: "桌面 · 顶带", menu: "桌面 · 完整菜单", drop: "桌面 · 固定项下拉与级联",
      "phone-closed": "手机 · 顶带", phone: "手机 · 底部菜单（Sheet）",
      original: "查看原尺寸", fit: "显示完整画面", pan: "原尺寸画面可左右滚动。",
    },
  },
  en: {
    themes: { light: "Light", dark: "Night" },
    tokens: {
      token: "Token", themed: "Theme values", fixed: "Fixed values",
      spacing: "Spacing in these docs",
      spacingIntro: "These pages use existing spacing values to separate prose, samples and sections.",
      paragraphs: "Between paragraphs", groups: "Between headings and content or sample groups", sections: "Between sections",
    },
    layout: {
      title: "Storybook document layout",
      intro: "The centered document column fills the space between the page insets up to its cap. In 07a and 07b, the header, text, preview controls and desktop specimens share the wide column. Phone previews share its start edge and are at most 390 px wide. Published 07 defines the original scene sizes.",
      standard: "Standard column cap", wide: "Wide column cap (07a and 07b)",
      wideInset: "Inset per side above 750 px viewport width", narrowInset: "Inset per side at viewport widths up to 750 px",
    },
    matrix: "Source contrast matrix",
    icons: {
      sizes: "Glyph sizes and uses",
      geometry: "The drawing uses a 20 × 20 viewBox with a 16 × 16 active area and 2 units of inset on each side. All three sizes keep a 1.25 px stroke and inherit color.",
      glyph: "Glyph", hitArea: "Standalone button hit area",
      sm: "Labeled buttons, captions or small standalone buttons.",
      md: "Navigation, large labeled buttons or medium standalone buttons.",
      lg: "Large standalone actions.",
      states: "Control and state examples",
      groups: { navigation: "Navigation and layout", find: "Find and reference", actions: "Actions and editing", appearance: "Settings and appearance", status: "Status and feedback", shell: "Product shell pin (07)" },
    },
    brand: {
      guide: "Product mark sizes and uses",
      ladder: "Color mark size ladder",
      color: "Color mark", mono: "Mono mark", tint: "Tint tile", deep: "Deep tile",
      tileUse: "Use tint tiles for app icons and product switchers. Use deep tiles for favicons and dark contexts.",
      monoUse: "Use mono marks for print, watermarks and restricted-color contexts.",
      lockups: "Lockups and first lines",
      shellUse: "In 07a, the desktop top band uses the 22 px compact first line. The expanded menu uses a decorative 22 px compact lockup with its description in the bottom-right corner. The sign-in screen uses the 44 px full lockup with its description. The 44 px first line shows the full size for comparison.",
      shellScale: "The sign-in intro scales the mark from 128 to 22 px. These sizes refer to the mark. For example, the full and compact TMS wordmarks use 16 and 12.5 px type, and the descriptions use 11.5 and 10.5 px type.",
      full: "Full lockup", compact: "Compact lockup", fullLine: "Full first line", compactLine: "Compact first line",
    },
    shell: {
      marks: "Band marks and lockups", geometry: "Band and paper geometry", intro: "Sign-in intro",
      band: "Desktop · Top band", menu: "Desktop · Full menu", drop: "Desktop · Pin dropdown and cascade",
      "phone-closed": "Phone · Top band", phone: "Phone · Bottom sheet",
      original: "Inspect original size", fit: "Show full scene", pan: "Scroll sideways to inspect the scene at original size.",
    },
  },
  ja: {
    themes: { light: "ライト", dark: "ナイト" },
    tokens: {
      token: "トークン", themed: "テーマ値", fixed: "固定値",
      spacing: "このドキュメントの余白",
      spacingIntro: "既存の余白値で、本文、サンプル、セクションを区切ります。",
      paragraphs: "段落間", groups: "見出しと内容の間、サンプル群の間", sections: "セクション間",
    },
    layout: {
      title: "Storybook のドキュメントレイアウト",
      intro: "ドキュメントのカラムは中央に配置し、両側の余白を除いた幅いっぱいに、上限まで広がります。07a と 07b のページヘッダー、本文、プレビュー操作部、デスクトップの見本には幅広のカラムを使います。モバイルの見本は同じ側に揃え、最大幅は 390 px です。見本の原寸は公開済みの 07 で定義されています。",
      standard: "標準カラムの最大幅", wide: "幅広カラムの最大幅（07a と 07b）",
      wideInset: "表示幅が 750 px を超える場合の片側の余白", narrowInset: "表示幅が 750 px 以下の場合の片側の余白",
    },
    matrix: "公開元のコントラスト表",
    icons: {
      sizes: "アイコンの寸法と用途",
      geometry: "描画は 20 × 20 の viewBox を使い、描画領域は 16 × 16、周囲の余白は各 2 単位です。3 サイズとも線幅は 1.25 px で、色は親要素から継承します。",
      glyph: "アイコン", hitArea: "単独ボタンの操作領域",
      sm: "ラベル付きボタン、キャプション、小型の単独ボタン。",
      md: "ナビゲーション、大型のラベル付きボタン、中型の単独ボタン。",
      lg: "大型の単独操作ボタン。",
      states: "コントロールと状態の例",
      groups: { navigation: "ナビゲーションと配置", find: "検索と参照", actions: "操作と編集", appearance: "設定と外観", status: "状態と通知", shell: "製品シェルのピン（07）" },
    },
    brand: {
      guide: "製品マークの寸法と用途",
      ladder: "カラーマークのサイズ一覧",
      color: "カラー", mono: "単色", tint: "淡色タイル", deep: "濃色タイル",
      tileUse: "淡色タイルはアプリアイコンと製品切り替えに、濃色タイルは favicon と暗色の場面に使います。",
      monoUse: "単色マークは印刷、透かし、使用色に制約がある場面に使います。",
      lockups: "ロックアップと先頭行",
      shellUse: "07a のデスクトップ頂帯には 22 px のコンパクト版の先頭行を使います。展開した全体メニューの右下には、説明文付きの 22 px コンパクト版を装飾として配置します。サインイン画面には説明文付きの 44 px フル版を使い、44 px の先頭行はフルサイズの比較用に示します。",
      shellScale: "サインイン演出ではマークが 128 px から 22 px に縮小します。これらの寸法はマークの大きさです。たとえば TMS のフル版とコンパクト版のワードマークは 16 と 12.5 px、説明文は 11.5 と 10.5 px です。",
      full: "フル版", compact: "コンパクト版", fullLine: "フル版の先頭行", compactLine: "コンパクト版の先頭行",
    },
    shell: {
      marks: "頂帯のマークとロックアップ", geometry: "頂帯と紙面の寸法", intro: "サインイン演出",
      band: "デスクトップ · 頂帯", menu: "デスクトップ · 全体メニュー", drop: "デスクトップ · 固定項目の階層メニュー",
      "phone-closed": "モバイル · 頂帯", phone: "モバイル · ボトムシート",
      original: "原寸で確認", fit: "全体を表示", pan: "横にスクロールして原寸で確認できます。",
    },
  },
  ko: {
    themes: { light: "라이트", dark: "나이트" },
    tokens: {
      token: "토큰", themed: "테마 값", fixed: "고정 값",
      spacing: "이 문서의 간격",
      spacingIntro: "기존 간격 값을 사용해 본문, 예시, 섹션을 구분합니다.",
      paragraphs: "문단 사이", groups: "제목과 내용 사이, 예시 그룹 사이", sections: "섹션 사이",
    },
    layout: {
      title: "Storybook 문서 레이아웃",
      intro: "문서 열은 가운데 정렬되며 양쪽 여백 안의 공간을 최대 너비까지 채웁니다. 07a와 07b의 페이지 머리글, 본문, 미리보기 컨트롤, 데스크톱 예시는 같은 넓은 열을 사용합니다. 모바일 예시도 같은 시작선에 맞추며 최대 너비는 390 px입니다. 예시의 원본 크기는 게시된 07에서 정합니다.",
      standard: "기본 열 최대 너비", wide: "넓은 열 최대 너비(07a와 07b)",
      wideInset: "뷰포트가 750 px를 초과할 때 한쪽 여백", narrowInset: "뷰포트가 750 px 이하일 때 한쪽 여백",
    },
    matrix: "게시 원본 대비 표",
    icons: {
      sizes: "아이콘 크기와 용도",
      geometry: "20 × 20 viewBox의 실제 그리기 영역은 16 × 16이며 네 변에 2단위 여백을 둡니다. 세 크기 모두 선 굵기는 1.25 px이고 색상은 상속됩니다.",
      glyph: "아이콘", hitArea: "독립 버튼의 조작 영역",
      sm: "레이블이 있는 버튼, 설명 문구, 소형 독립 버튼.",
      md: "탐색, 레이블이 있는 대형 버튼, 중형 독립 버튼.",
      lg: "대형 독립 동작 버튼.",
      states: "컨트롤과 상태 예시",
      groups: { navigation: "탐색과 배치", find: "검색과 참조", actions: "동작과 편집", appearance: "설정과 모양", status: "상태와 알림", shell: "제품 셸 고정 핀(07)" },
    },
    brand: {
      guide: "제품 마크 크기와 용도",
      ladder: "컬러 마크 크기 단계",
      color: "컬러 마크", mono: "단색 마크", tint: "밝은 타일", deep: "짙은 타일",
      tileUse: "밝은 타일은 앱 아이콘과 제품 전환 메뉴에, 짙은 타일은 favicon과 어두운 환경에 사용합니다.",
      monoUse: "단색 마크는 인쇄, 워터마크, 색상 사용이 제한된 환경에 사용합니다.",
      lockups: "로고 조합과 첫 줄",
      shellUse: "07a에서 데스크톱 상단 바는 22 px 소형 첫 줄을 사용합니다. 펼친 전체 메뉴의 오른쪽 아래에는 설명을 포함한 22 px 소형 조합을 장식으로 배치합니다. 로그인 화면에는 설명을 포함한 44 px 전체 조합을 사용하며, 44 px 첫 줄은 전체 크기를 비교하기 위한 예시입니다.",
      shellScale: "로그인 동작에서는 마크가 128 px에서 22 px로 줄어듭니다. 이 치수는 마크의 크기입니다. 예를 들어 TMS의 전체 및 소형 워드마크 글자는 16 및 12.5 px, 설명 줄은 11.5 및 10.5 px입니다.",
      full: "전체 조합", compact: "소형 조합", fullLine: "전체 크기 첫 줄", compactLine: "소형 첫 줄",
    },
    shell: {
      marks: "상단 바 마크와 로고 조합", geometry: "상단 바와 본문 영역 치수", intro: "로그인 동작",
      band: "데스크톱 · 상단 바", menu: "데스크톱 · 전체 메뉴", drop: "데스크톱 · 고정 항목 계단 메뉴",
      "phone-closed": "모바일 · 상단 바", phone: "모바일 · 하단 시트",
      original: "원본 크기로 보기", fit: "전체 화면 보기", pan: "가로로 스크롤하면 원본 크기로 확인할 수 있습니다.",
    },
  },
  fr: {
    themes: { light: "Clair", dark: "Nuit" },
    tokens: {
      token: "Token", themed: "Valeurs par thème", fixed: "Valeurs fixes",
      spacing: "Espacement dans cette documentation",
      spacingIntro: "Les valeurs d’espacement existantes séparent les textes, les exemples et les sections.",
      paragraphs: "Entre les paragraphes", groups: "Entre titres et contenus ou groupes d’exemples", sections: "Entre les sections",
    },
    layout: {
      title: "Mise en page des documents Storybook",
      intro: "La colonne centrée occupe l’espace entre les marges de page jusqu’à sa largeur maximale. Dans 07a et 07b, l’en-tête, le texte, les commandes d’aperçu et les exemples sur ordinateur partagent la colonne large. Les aperçus mobiles partent du même bord et mesurent au plus 390 px de large. Les planches 07 publiées définissent les dimensions d’origine des scènes.",
      standard: "Largeur maximale de la colonne standard", wide: "Largeur maximale de la colonne large (07a et 07b)",
      wideInset: "Marge par côté au-delà de 750 px de largeur d’affichage", narrowInset: "Marge par côté à 750 px de largeur d’affichage ou moins",
    },
    matrix: "Matrice de contraste publiée",
    icons: {
      sizes: "Tailles et usages des icônes",
      geometry: "Le dessin utilise un viewBox de 20 × 20, avec une zone active de 16 × 16 et un retrait de 2 unités par côté. Le trait reste à 1,25 px pour les trois tailles. La couleur est héritée.",
      glyph: "Icône", hitArea: "Zone active du bouton seul",
      sm: "Boutons avec libellé, légendes ou petits boutons seuls.",
      md: "Navigation, grands boutons avec libellé ou boutons seuls moyens.",
      lg: "Grandes actions sans libellé.",
      states: "Exemples de contrôles et d’états",
      groups: { navigation: "Navigation et disposition", find: "Recherche et référence", actions: "Actions et édition", appearance: "Réglages et apparence", status: "État et retour", shell: "Épingle de la coque produit (07)" },
    },
    brand: {
      guide: "Tailles et usages des symboles",
      ladder: "Échelle du symbole couleur",
      color: "Couleur", mono: "Monochrome", tint: "Tuile claire", deep: "Tuile foncée",
      tileUse: "Les tuiles claires servent aux icônes d’application et au sélecteur de produits. Les tuiles foncées servent aux favicons et aux contextes sombres.",
      monoUse: "Le monochrome convient à l’impression, aux filigranes et aux contextes à couleurs limitées.",
      lockups: "Blocs de marque et premières lignes",
      shellUse: "Dans 07a, le bandeau sur ordinateur utilise la première ligne compacte de 22 px. Le menu déployé présente en bas à droite un bloc compact décoratif de 22 px avec son descriptif. L’écran de connexion utilise le bloc complet de 44 px avec son descriptif. La première ligne de 44 px sert de repère à la taille complète.",
      shellScale: "L’animation de connexion réduit le symbole de 128 à 22 px. Ces tailles désignent le symbole. Par exemple, les noms TMS complet et compact sont composés en 16 et 12,5 px, et les signatures en 11,5 et 10,5 px.",
      full: "Bloc complet", compact: "Bloc compact", fullLine: "Ligne complète", compactLine: "Ligne compacte",
    },
    shell: {
      marks: "Symboles du bandeau et blocs de marque", geometry: "Géométrie du bandeau et du papier", intro: "Animation de connexion",
      band: "Bureau · Bandeau", menu: "Bureau · Menu complet", drop: "Bureau · Menu épinglé et cascade",
      "phone-closed": "Mobile · Bandeau", phone: "Mobile · Panneau inférieur",
      original: "Inspecter à taille réelle", fit: "Afficher la scène entière", pan: "Faites défiler horizontalement pour inspecter la scène à taille réelle.",
    },
  },
} as const satisfies Record<DocsLocale, SpecimenCopy>;
