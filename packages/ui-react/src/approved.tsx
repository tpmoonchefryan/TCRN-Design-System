// Explicit documentation and adopted-consumption boundary. Engineering exports are not a design catalogue.
export { Button, IconButton, LinkButton } from "./components/Button/index.js";
export type { ButtonProps, IconButtonProps, LinkButtonProps } from "./components/Button/index.js";
export { ButtonGroup } from "./components/ButtonGroup/index.js";
export type { ButtonGroupProps } from "./components/ButtonGroup/index.js";
export { ClipboardCopyButton } from "./components/Clipboard/index.js";
export type { ClipboardCopyButtonProps, ClipboardCopyState } from "./components/Clipboard/index.js";
export { Heading, Text, Highlight } from "./components/Typography/index.js";
export type { HeadingProps, TextProps, HighlightProps } from "./components/Typography/index.js";
export { Icon, tcrnIconNames, BrandIcon, tcrnBrandIconNames, tcrnBrandIcons } from "./components/Icon/index.js";
export type { IconName, IconProps, BrandIconName, BrandIconProps, BrandIconSize, TcrnBrandIconDefinition } from "./components/Icon/index.js";
export {
  Input,
  Textarea,
  SearchInput,
  SuggestInput,
  Select,
  MultiSelect,
  NumberInput,
  DatePicker,
  Checkbox,
  RadioGroup,
  Switch,
  mountStaticMultiSelect
} from "./components/Form/index.js";
export type {
  InputProps,
  TextareaProps,
  SearchInputProps,
  SuggestInputProps,
  SelectProps,
  SelectOption,
  MultiSelectProps,
  NumberInputProps,
  DatePickerProps,
  CheckboxProps,
  RadioGroupProps,
  RadioOption,
  SwitchProps
} from "./components/Form/index.js";
export {
  Badge,
  StatusBadge,
  StatusDot,
  InlineAlert,
  EnvironmentBanner,
  EmptyState,
  ErrorState,
  StateSurface
} from "./components/Feedback/index.js";
export type {
  Tone,
  BadgeProps,
  StatusBadgeProps,
  StatusDotProps,
  InlineAlertProps,
  EnvironmentBannerProps,
  StateSurfaceProps,
  EmptyStateProps,
  ErrorStateProps
} from "./components/Feedback/index.js";
export {
  Card,
  Avatar,
  avatarInitials,
  StatCard,
  TableShell,
  TableToolbar,
  KeyValueList,
  RawPayloadBox
} from "./components/DataDisplay/DataDisplay.js";
export type {
  CardTone,
  CardProps,
  AvatarSize,
  AvatarProps,
  StatCardTone,
  StatCardProps,
  TableColumn,
  TableShellProps,
  TableToolbarFilterOption,
  TableToolbarProps,
  KeyValueItem,
  RawPayloadBoxProps,
  Density
} from "./components/DataDisplay/DataDisplay.js";
export { PageHeader, RecordTable, SplitView, StagePipeline } from "./components/DataDisplay/DomainDisplay.js";
export type {
  PageHeaderBreadcrumb,
  ActionDescriptor,
  PageHeaderProps,
  RecordField,
  RecordRowProps,
  RecordTableProps,
  SplitViewProps,
  PipelineStage,
  StagePipelineProps
} from "./components/DataDisplay/DomainDisplay.js";
export {
  Surface,
  Divider,
  CollapsibleRegion,
  SettingsLayout,
  PublicSiteHeader,
  PublicSiteFooter,
  EditorialArticle,
  EditorialNote
} from "./components/Layout/index.js";
export type {
  SurfaceProps,
  CollapsibleRegionProps,
  SettingsLayoutProps,
  PublicSiteNavLink,
  PublicSiteHeaderProps,
  PublicSiteFooterLink,
  PublicSiteFooterProps,
  EditorialNoteTone,
  EditorialNoteProps,
  EditorialRelatedLink,
  EditorialArticleProps
} from "./components/Layout/index.js";
export {
  TcrnBrandMark,
  ProductLogo,
  ProductLockup,
  ProductShell,
  ProductShellSearch,
  ShellBrandLockup,
  ShellLocaleMenu,
  ShellThemeMenu,
  ShellThemeToggle,
  SkipLink,
  tcrnProductMarkIds,
  tcrnProductMarks,
  tcrnAdoptedProductMarks,
  tcrnRegisteredProductMarks,
  tcrnProductMarkVariants,
  tcrnProductMarkSvg,
  tcrnProductTagline,
  tcrnProductLogoRegistry,
  getTcrnProductLogoAsset,
  productShellCopyFor,
  resolveEnabledShellThemes,
  Tabs,
  SegmentedNav,
  readPreferenceCookieValues,
  useProductShellController
} from "./components/Navigation/Navigation.js";
export type {
  TcrnProductMark,
  TcrnProductMarkId,
  TcrnProductMarkVariant,
  TcrnProductLogoId,
  ProductLogoProps,
  ProductLockupProps,
  ProductShellProps,
  ProductShellNavGroup,
  ProductShellNavItem,
  ProductShellAccount,
  ProductShellProduct,
  ProductShellNotifications,
  ProductShellControllerConfig,
  ProductShellRequestPreferences,
  ProductShellChromeCopy,
  ProductShellCopy,
  ProductShellLocaleDefinition,
  TcrnShellCopy,
  ShellLocaleOption,
  ShellThemeMenuProps,
  ShellThemeMode,
  SeasonalShellThemeMode,
  ShellSeasonalThemeOptions,
  TabsProps,
  TabItem,
  TabsVariant,
  SelectableNavProps,
  NavItem
} from "./components/Navigation/Navigation.js";
export { ShellBrandButton } from "./components/Navigation/ShellBrandButton.js";
export type { ShellBrandButtonProps, ShellBrandButtonVersion } from "./components/Navigation/ShellBrandButton.js";
export { ShellMenu, shellMenuPresentationContext, useShellMenuPresentation } from "./components/Navigation/ShellMenu.js";
export type { ShellMenuGroup, ShellMenuItem, ShellMenuProps } from "./components/Navigation/ShellMenu.js";
export { ShellDropdown } from "./components/Navigation/ShellDropdown.js";
export type { ShellDropdownProps } from "./components/Navigation/ShellDropdown.js";
export { ShellPins } from "./components/Navigation/ShellPins.js";
export type { ShellPinItem, ShellPinPlacement, ShellPinsProps } from "./components/Navigation/ShellPins.js";
export { ShellIntro } from "./components/Navigation/ShellIntro.js";
export type { ShellIntroProps } from "./components/Navigation/ShellIntro.js";
export {
  Menu,
  Popover,
  Tooltip,
  Dialog,
  ConfirmActionDialog,
  InlineConfirmBar,
  computeFloatingPosition,
  mountStaticOverlayBoundary
} from "./components/Overlay/index.js";
export type {
  PopoverPlacement,
  TooltipPlacement,
  FloatingPosition,
  FloatingRect,
  MenuItemTone,
  MenuItemDescriptor,
  MenuProps,
  PopoverProps,
  TooltipProps,
  DialogProps,
  ConfirmTone,
  ConfirmActionDialogProps,
  InlineConfirmBarProps
} from "./components/Overlay/index.js";
export { tcrnComponentCss } from "./styles/index.js";
