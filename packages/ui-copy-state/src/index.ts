export type ReadinessState =
  | "ready"
  | "local_only"
  | "fixture_only"
  | "external_proof_needed"
  | "proof_required"
  | "review_required"
  | "blocked"
  | "unavailable"
  | "not_claimed"
  | "not_configured"
  | "unknown";

export const tcrnSupportedLocales = ["zh-CN", "en", "ja", "ko", "fr"] as const;
export type TcrnLocale = (typeof tcrnSupportedLocales)[number];

export interface LocaleMetadata {
  locale: TcrnLocale;
  nativeName: string;
  englishName: string;
  textDirection: "ltr";
  copyCoverage: "required";
}

export const tcrnDefaultLocale: TcrnLocale = "en";
export const tcrnFallbackLocale: TcrnLocale = "en";

export const tcrnLocaleMetadata: readonly LocaleMetadata[] = [
  { locale: "zh-CN", nativeName: "简体中文", englishName: "Simplified Chinese", textDirection: "ltr", copyCoverage: "required" },
  { locale: "en", nativeName: "English", englishName: "English", textDirection: "ltr", copyCoverage: "required" },
  { locale: "ja", nativeName: "日本語", englishName: "Japanese", textDirection: "ltr", copyCoverage: "required" },
  { locale: "ko", nativeName: "한국어", englishName: "Korean", textDirection: "ltr", copyCoverage: "required" },
  { locale: "fr", nativeName: "Français", englishName: "French", textDirection: "ltr", copyCoverage: "required" }
] as const;

export const tcrnI18nContract = {
  supportedLocales: tcrnSupportedLocales,
  defaultLocale: tcrnDefaultLocale,
  fallbackLocale: tcrnFallbackLocale,
  rawEnumLabelsAllowed: false,
  untranslatedCopyStateAllowed: false,
  textDirections: ["ltr"]
} as const;

export interface CopyStateInput {
  state?: string;
  label?: string;
  evidenceScope?: "local" | "external" | "none";
}

export interface CopyStatePresentation {
  state: ReadinessState;
  tone: "positive" | "neutral" | "warning" | "danger";
  label: string;
  description: string;
  locale: TcrnLocale;
  productAcceptanceClaim: false;
  finalMvpAcceptanceClaim: false;
  releaseReadinessClaim: false;
  publicationClaim: false;
  ownerIntentActionClaim: false;
}

type CopyText = Pick<CopyStatePresentation, "label" | "description">;
type CopyStateContract = Omit<CopyStatePresentation, "state" | "label" | "description" | "locale">;

const nonClaimFlags = {
  productAcceptanceClaim: false,
  finalMvpAcceptanceClaim: false,
  releaseReadinessClaim: false,
  publicationClaim: false,
  ownerIntentActionClaim: false
} as const;

const presentations: Record<ReadinessState, CopyStateContract> = {
  ready: {
    tone: "positive",
    ...nonClaimFlags
  },
  local_only: {
    tone: "neutral",
    ...nonClaimFlags
  },
  fixture_only: {
    tone: "neutral",
    ...nonClaimFlags
  },
  external_proof_needed: {
    tone: "warning",
    ...nonClaimFlags
  },
  proof_required: {
    tone: "warning",
    ...nonClaimFlags
  },
  review_required: {
    tone: "warning",
    ...nonClaimFlags
  },
  blocked: {
    tone: "danger",
    ...nonClaimFlags
  },
  unavailable: {
    tone: "neutral",
    ...nonClaimFlags
  },
  not_claimed: {
    tone: "neutral",
    ...nonClaimFlags
  },
  not_configured: {
    tone: "neutral",
    ...nonClaimFlags
  },
  unknown: {
    tone: "neutral",
    ...nonClaimFlags
  }
};

const localizedCopy: Record<TcrnLocale, Record<ReadinessState, CopyText>> = {
  "zh-CN": {
    ready: { label: "本地可用", description: "本地组件契约可用于示例证明。" },
    local_only: { label: "仅本地证明", description: "证据仅限于此设计系统脚手架。" },
    fixture_only: { label: "仅示例数据", description: "示例内容为合成数据，不能视为产品证据。" },
    external_proof_needed: { label: "需要外部证明", description: "必须由此包之外的路线提供外部证明后才能依赖。" },
    proof_required: { label: "需要证明", description: "仍需要外部、产品或发布证据。" },
    review_required: { label: "需要评审", description: "必须由归属评审路线确认后才能进入下一步。" },
    blocked: { label: "已阻止", description: "操作会保持阻止，直到归属评审或路线解除。" },
    unavailable: { label: "不可用", description: "此路线中不可使用该操作或证据路径。" },
    not_claimed: { label: "未声明", description: "此证明界面有意不声明任何下游验收。" },
    not_configured: { label: "未配置", description: "尚未配置产品或外部集成。" },
    unknown: { label: "未知", description: "状态未知或不受支持，并以 fail-closed 方式显示。" }
  },
  en: {
    ready: { label: "Ready for local use", description: "Local component contract is available for fixture proof." },
    local_only: { label: "Local proof only", description: "Evidence is local to this design-system scaffold." },
    fixture_only: { label: "Fixture only", description: "Example content is synthetic and cannot be treated as product evidence." },
    external_proof_needed: { label: "External proof needed", description: "A route outside this package must provide external proof before reliance." },
    proof_required: { label: "Proof required", description: "External, product, or release evidence is still required." },
    review_required: { label: "Review required", description: "An owning review route must confirm this before the next step." },
    blocked: { label: "Blocked", description: "Action is held until the owning review or route clears it." },
    unavailable: { label: "Unavailable", description: "The action or evidence path is unavailable in this route." },
    not_claimed: { label: "Not claimed", description: "This proof surface intentionally makes no downstream acceptance claim." },
    not_configured: { label: "Not configured", description: "No product or external integration is configured." },
    unknown: { label: "Unknown", description: "State is unknown or unsupported and is displayed fail-closed." }
  },
  ja: {
    ready: { label: "ローカル利用可", description: "ローカルコンポーネント契約はフィクスチャ証明に使用できます。" },
    local_only: { label: "ローカル証明のみ", description: "証拠はこのデザインシステムのスキャフォールド内に限定されます。" },
    fixture_only: { label: "フィクスチャのみ", description: "サンプル内容は合成データであり、製品証拠として扱えません。" },
    external_proof_needed: { label: "外部証明が必要", description: "依存する前に、このパッケージ外のルートが外部証明を提供する必要があります。" },
    proof_required: { label: "証明が必要", description: "外部、製品、またはリリース証拠がまだ必要です。" },
    review_required: { label: "レビューが必要", description: "次の手順に進む前に、所有するレビュールートの確認が必要です。" },
    blocked: { label: "ブロック中", description: "所有するレビューまたはルートが解除するまで操作は保留されます。" },
    unavailable: { label: "利用不可", description: "このルートでは操作または証拠パスを利用できません。" },
    not_claimed: { label: "未主張", description: "この証明サーフェスは下流の受け入れを意図的に主張しません。" },
    not_configured: { label: "未設定", description: "製品または外部連携は設定されていません。" },
    unknown: { label: "不明", description: "状態は不明または未対応であり、fail-closed として表示されます。" }
  },
  ko: {
    ready: { label: "로컬 사용 가능", description: "로컬 컴포넌트 계약을 픽스처 증명에 사용할 수 있습니다." },
    local_only: { label: "로컬 증명만", description: "증거는 이 디자인 시스템 스캐폴드 안의 로컬 범위로 제한됩니다." },
    fixture_only: { label: "픽스처 전용", description: "예시 콘텐츠는 합성 데이터이며 제품 증거로 취급할 수 없습니다." },
    external_proof_needed: { label: "외부 증명 필요", description: "의존하기 전에 이 패키지 외부 경로가 외부 증명을 제공해야 합니다." },
    proof_required: { label: "증명 필요", description: "외부, 제품 또는 릴리스 증거가 아직 필요합니다." },
    review_required: { label: "리뷰 필요", description: "다음 단계로 진행하기 전에 담당 리뷰 경로의 확인이 필요합니다." },
    blocked: { label: "차단됨", description: "담당 리뷰나 경로가 해제할 때까지 작업은 보류됩니다." },
    unavailable: { label: "사용할 수 없음", description: "이 경로에서는 작업 또는 증거 경로를 사용할 수 없습니다." },
    not_claimed: { label: "주장하지 않음", description: "이 증명 화면은 하위 수락 상태를 의도적으로 주장하지 않습니다." },
    not_configured: { label: "구성되지 않음", description: "제품 또는 외부 통합이 구성되지 않았습니다." },
    unknown: { label: "알 수 없음", description: "상태가 알 수 없거나 지원되지 않아 fail-closed 방식으로 표시됩니다." }
  },
  fr: {
    ready: { label: "Utilisable localement", description: "Le contrat local du composant est disponible pour une preuve avec fixture." },
    local_only: { label: "Preuve locale seulement", description: "La preuve reste locale à ce scaffold de design system." },
    fixture_only: { label: "Fixture seulement", description: "Le contenu d'exemple est synthétique et ne peut pas servir de preuve produit." },
    external_proof_needed: { label: "Preuve externe requise", description: "Une route hors de ce package doit fournir une preuve externe avant toute dépendance." },
    proof_required: { label: "Preuve requise", description: "Une preuve externe, produit ou de publication reste nécessaire." },
    review_required: { label: "Revue requise", description: "La route de revue propriétaire doit confirmer cet élément avant l'étape suivante." },
    blocked: { label: "Bloqué", description: "L'action reste bloquée jusqu'à validation par la revue ou la route propriétaire." },
    unavailable: { label: "Indisponible", description: "L'action ou le chemin de preuve est indisponible dans cette route." },
    not_claimed: { label: "Non revendiqué", description: "Cette surface de preuve ne revendique volontairement aucune acceptation aval." },
    not_configured: { label: "Non configuré", description: "Aucune intégration produit ou externe n'est configurée." },
    unknown: { label: "Inconnu", description: "L'état est inconnu ou non pris en charge et s'affiche en fail-closed." }
  }
};

export const forbiddenPositiveClaims = [
  "product accepted",
  "final mvp accepted",
  "release ready",
  "deployment ready",
  "public ready",
  "legal complete",
  "dependency clean",
  "docs published",
  "canonical knowledge promoted",
  "live dispatch enabled",
  "resource materialized"
] as const;

export function presentCopyState(input: CopyStateInput, locale?: string): CopyStatePresentation {
  const normalized = normalizeState(input.state);
  const resolvedLocale = resolveTcrnLocale(locale);
  const fallback = localizedCopy[resolvedLocale][normalized].label;
  return {
    state: normalized,
    locale: resolvedLocale,
    ...presentations[normalized],
    label: sanitizeCopyStateLabel(input.label, fallback),
    description: localizedCopy[resolvedLocale][normalized].description
  };
}

export function normalizeState(state: string | undefined): ReadinessState {
  switch (state?.trim()) {
    case "ready":
    case "local_only":
    case "fixture_only":
    case "external_proof_needed":
    case "proof_required":
    case "review_required":
    case "blocked":
    case "unavailable":
    case "not_claimed":
    case "not_configured":
      return state.trim() as ReadinessState;
    default:
      return "unknown";
  }
}

export function resolveTcrnLocale(locale: string | undefined): TcrnLocale {
  const normalized = locale?.trim();
  return tcrnSupportedLocales.includes(normalized as TcrnLocale) ? (normalized as TcrnLocale) : tcrnFallbackLocale;
}

export function findForbiddenPositiveClaimHits(body: string): string[] {
  const lower = body.toLowerCase();
  return forbiddenPositiveClaims.filter((phrase) => lower.includes(phrase));
}

export function findRawEnumLabelHits(body: string): string[] {
  return Array.from(new Set(body.match(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g) ?? []));
}

export function sanitizeCopyStateLabel(label: string | undefined, fallback: string): string {
  const trimmed = label?.trim();
  if (!trimmed || findForbiddenPositiveClaimHits(trimmed).length > 0 || findRawEnumLabelHits(trimmed).length > 0) {
    return fallback;
  }
  return trimmed;
}
