// The Icon roster: every name of the package roster (tcrnIconNames, 38 icons) at the three
// package sizes, sm 14, md 16 and lg 20. Each entry is a package Text holding three package Icon
// renditions and the machine name, so the roster inherits the secondary ink of its host the way an
// icon inherits the text colour around it. The first entry carries the roster contrast cell.
import { Icon, Text, tcrnIconNames } from "@tcrn/ui-react";
import { cellAttributes, type MatrixTheme } from "./matrix-renderer.js";

export const iconRosterSizes = ["sm", "md", "lg"] as const;

export const iconRosterPixelSizes: Record<(typeof iconRosterSizes)[number], number> = { sm: 14, md: 16, lg: 20 };

export function IconRoster({ theme }: { theme: MatrixTheme }) {
  return (
    <div className="tcrn-doc-locale-grid" data-gplus-icon-roster={tcrnIconNames.length}>
      {tcrnIconNames.map((name, index) => (
        <Text key={name} data-gplus-icon-roster-item={name} {...(index === 0 ? cellAttributes("icon", "roster", theme) : {})}>
          {iconRosterSizes.map((size) => (
            <Icon key={size} name={name} size={size} data-gplus-icon-size={iconRosterPixelSizes[size]} />
          ))}
          <code>{name}</code>
        </Text>
      ))}
    </div>
  );
}
