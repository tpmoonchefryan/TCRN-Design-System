import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import {
  ActionDrawer,
  Badge,
  Button,
  ConfirmActionDialog,
  DetailDrawer,
  Dialog,
  EvidenceStrip,
  Heading,
  InlineAlert,
  Popover,
  ReadbackPanel,
  Surface,
  Text
} from "@tcrn/ui-react";
import { overlayFamilyLabCopy } from "./overlay-family-lab-copy.js";
import {
  overlayFamilyNoOverclaimMarkers,
  overlayFamilyScenarios,
  type OverlayFamilyScenario
} from "./overlay-family-lab-model.js";

const layoutStyle: CSSProperties = {
  display: "grid",
  gap: "var(--tcrn-space-5)",
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "var(--tcrn-space-6)"
};

const scenarioGridStyle: CSSProperties = {
  display: "grid",
  gap: "var(--tcrn-space-4)",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
};

const scenarioBodyStyle: CSSProperties = {
  display: "grid",
  gap: "var(--tcrn-space-3)"
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--tcrn-space-2)",
  alignItems: "center"
};

const overlayStageStyle: CSSProperties = {
  display: "grid",
  gap: "var(--tcrn-space-3)",
  padding: "var(--tcrn-space-3)",
  border: "1px solid var(--tcrn-color-border-subtle)",
  borderRadius: "var(--tcrn-radius-md)",
  background: "var(--tcrn-color-surface-muted)"
};

function CapabilityReadback({ scenario }: { scenario: OverlayFamilyScenario }) {
  return (
    <div style={scenarioBodyStyle} data-overlay-lab-capability={scenario.id}>
      <div>
        <Badge tone="positive">{overlayFamilyLabCopy.packageProvidedLabel}</Badge>
        <ul>
          {scenario.packageProvided.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <Badge tone="warning">{overlayFamilyLabCopy.ownerWiringLabel}</Badge>
        <ul>
          {scenario.ownerWiring.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScenarioPanel({
  scenario,
  children
}: {
  scenario: OverlayFamilyScenario;
  children: ReactNode;
}) {
  return (
    <Surface data-overlay-family-scenario={scenario.id}>
      <Heading level={3}>{scenario.title}</Heading>
      <CapabilityReadback scenario={scenario} />
      {children}
    </Surface>
  );
}

function DialogScenario() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scenario = overlayFamilyScenarios.find((item) => item.id === "dialog");

  if (!scenario) {
    return null;
  }

  return (
    <ScenarioPanel scenario={scenario}>
      <div style={actionRowStyle}>
        <Button ref={triggerRef} onClick={() => setOpen(true)} variant="primary">
          Open dialog
        </Button>
        <Badge>{open ? "Dialog open" : "Dialog closed"}</Badge>
      </div>
      <Dialog
        title="Internal dialog focus check"
        open={open}
        triggerRef={triggerRef}
        initialFocusRef={closeRef}
        onOpenChange={setOpen}
      >
        <Text>Package metadata should show focus entry, owner-wired Escape close, and owner-wired focus return.</Text>
        <div style={actionRowStyle}>
          <Button ref={closeRef} onClick={() => setOpen(false)}>
            Close dialog
          </Button>
        </div>
      </Dialog>
    </ScenarioPanel>
  );
}

function PopoverScenario() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scenario = overlayFamilyScenarios.find((item) => item.id === "popover");

  if (!scenario) {
    return null;
  }

  return (
    <ScenarioPanel scenario={scenario}>
      <div style={actionRowStyle}>
        <Button ref={triggerRef} onClick={() => setOpen((current) => !current)} variant="secondary">
          Toggle popover
        </Button>
        <Badge>{open ? "Popover open" : "Popover closed"}</Badge>
      </div>
      <Popover
        title="Internal non-modal popover"
        open={open}
        triggerRef={triggerRef}
        initialFocusRef={closeRef}
        onOpenChange={setOpen}
        placement="bottom-start"
      >
        <Text>Popover keeps aria-modal=false and does not claim tab containment.</Text>
        <Button ref={closeRef} onClick={() => setOpen(false)}>
          Close popover
        </Button>
      </Popover>
    </ScenarioPanel>
  );
}

function ConfirmActionDialogScenario() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scenario = overlayFamilyScenarios.find((item) => item.id === "confirm-action-dialog");

  if (!scenario) {
    return null;
  }

  const closeWithFocusReturn = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeWithFocusReturn();
    }
  };

  return (
    <ScenarioPanel scenario={scenario}>
      <div style={actionRowStyle}>
        <Button ref={triggerRef} onClick={() => setOpen(true)} variant="danger">
          Open blocked confirmation
        </Button>
        <Badge>{open ? "Confirmation mounted" : "Confirmation unmounted"}</Badge>
      </div>
      {open ? (
        <div data-confirm-action-owner-wiring="escape-close-focus-return" onKeyDown={onKeyDown}>
          <ConfirmActionDialog
            title="Blocked publication action"
            message="This internal lab cannot publish packages, publish docs, move acceptance state, or claim release readiness."
            confirmLabel="Publish"
            cancelLabel="Close"
            disabled
          />
          <div style={actionRowStyle}>
            <Button onClick={closeWithFocusReturn}>Unmount confirmation</Button>
          </div>
        </div>
      ) : null}
    </ScenarioPanel>
  );
}

function DrawerFamilyScenario() {
  const [detailOpen, setDetailOpen] = useState(true);
  const [actionOpen, setActionOpen] = useState(false);
  const scenario = overlayFamilyScenarios.find((item) => item.id === "drawer-family");

  if (!scenario) {
    return null;
  }

  return (
    <ScenarioPanel scenario={scenario}>
      <Text>{overlayFamilyLabCopy.drawerSharedSemantics}</Text>
      <div style={actionRowStyle}>
        <Button onClick={() => setDetailOpen((current) => !current)}>
          Toggle detail drawer
        </Button>
        <Button onClick={() => setActionOpen((current) => !current)}>
          Toggle action drawer
        </Button>
      </div>
      <div style={overlayStageStyle} data-drawer-family-stage="true">
        <DetailDrawer title="Detail drawer read context" open={detailOpen}>
          <Text>Package-provided structural drawer for read-oriented context. It is complementary and non-modal.</Text>
        </DetailDrawer>
        <ActionDrawer title="Action drawer review context" open={actionOpen}>
          <Text>Package-provided structural drawer for action review. Owner routes must wire close, focus, and mutation authority.</Text>
        </ActionDrawer>
      </div>
    </ScenarioPanel>
  );
}

function MarkerReadback() {
  return (
    <ReadbackPanel title={overlayFamilyLabCopy.markersLabel}>
      <dl>
        {Object.entries(overlayFamilyNoOverclaimMarkers).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </ReadbackPanel>
  );
}

export function OverlayFamilyLab() {
  return (
    <section
      {...overlayFamilyNoOverclaimMarkers}
      aria-label="Internal overlay family developer lab"
      style={layoutStyle}
    >
      <Surface>
        <Badge tone="warning">{overlayFamilyLabCopy.eyebrow}</Badge>
        <Heading level={1}>{overlayFamilyLabCopy.title}</Heading>
        <Text>{overlayFamilyLabCopy.description}</Text>
        <InlineAlert tone="warning">{overlayFamilyLabCopy.boundary}</InlineAlert>
        <EvidenceStrip
          items={[
            "public @tcrn/ui-react imports only",
            "contract docs excluded",
            "one internal Storybook lab",
            "no package export change"
          ]}
        />
      </Surface>
      <MarkerReadback />
      <div style={scenarioGridStyle}>
        <DialogScenario />
        <PopoverScenario />
        <ConfirmActionDialogScenario />
        <DrawerFamilyScenario />
      </div>
      <InlineAlert tone="neutral">{overlayFamilyLabCopy.disabledConfirmationCopy}</InlineAlert>
    </section>
  );
}
