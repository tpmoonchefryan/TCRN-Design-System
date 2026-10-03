{
  "baseProductionSource": "610680b81a950e91e9e1e77718ea7f3f3b19bc27",
  "sourceBaseline": "e099c69f2ad7e516e28b1a6b45e44033ae1f35be",
  "priorUnpublishedCommitCount": 13,
  "instrument": {
    "codegraph-ds": "not exposed in this Codex host; source/Git/current-production-contract used; no graph results claimed"
  },
  "families": [
    {
      "family": "MultiSelect dropdown",
      "reference": "Select trigger; Menu option; native Select serialization; shared overlay boundary",
      "changes": [
        "Select/Menu tokens and native control geometry reused",
        "current choices displayed while collapsed",
        "listbox multi-choice interaction",
        "same shared DOM bridge for React and static HTML"
      ],
      "source": [
        "packages/ui-react/src/components/Form/Form.tsx",
        "packages/ui-react/src/components/Form/multi-select-dropdown.ts"
      ],
      "consumer": [
        "Atelier retrieval.promptLanguages"
      ],
      "checks": [
        "multi-select-dropdown-proof",
        "full-surface-remediation-proof"
      ]
    },
    {
      "family": "MultiSelect native",
      "reference": "published native Select family",
      "changes": [
        "native multiple presentation retained for compatibility",
        "unique closed-set values and disabled native options retained"
      ],
      "source": [
        "packages/ui-react/src/components/Form/Form.tsx"
      ],
      "consumer": [
        "compatibility callers"
      ],
      "checks": [
        "Form.test",
        "full-surface-remediation-proof"
      ]
    },
    {
      "family": "MultiSelect checklist",
      "reference": "Checkbox and quiet small Button families",
      "changes": [
        "opt-in visible checklist remains distinct from ordinary dropdown choice",
        "raw inputs now use existing Checkbox class",
        "clear action now uses existing Button classes without a private button appearance"
      ],
      "source": [
        "packages/ui-react/src/components/Form/Form.tsx"
      ],
      "consumer": [
        "explicit checklist tasks; not Atelier language choice"
      ],
      "checks": [
        "multi-select.dom.spec",
        "multi-select-required-proof"
      ]
    },
    {
      "family": "Select/Input typography",
      "reference": "existing token-backed control family",
      "changes": [
        "shared inherited font and token foreground/panel background apply to all value controls",
        "border, spacing, radius and minimum height retain the Select geometry"
      ],
      "source": [
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier closed references, open fields and numeric values"
      ],
      "checks": [
        "dropdown computed-style comparison with Select",
        "tokens:proof",
        "internal-alpha:browser-proof"
      ]
    },
    {
      "family": "SettingRow/SettingRowList/SettingsLayout",
      "reference": "published settings layout and SettingRow family",
      "changes": [
        "one parent-owned grid with label/control/tools subgrids",
        "empty tools slots keep their column",
        "controls and wrappers use complete allocated control width",
        "narrow actual containers stack at existing threshold"
      ],
      "source": [
        "packages/ui-react/src/components/Form/Form.tsx",
        "packages/ui-react/src/components/Layout/Layout.tsx",
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier settings, system-variable settings"
      ],
      "checks": [
        "ds:consumption:proof settings geometry and value comparisons",
        "full-surface-remediation-proof localized layout examples"
      ]
    },
    {
      "family": "Surface",
      "reference": "published Surface heading/actions/content slots",
      "changes": [
        "heading/actions wrap separately within card",
        "long values retain full content"
      ],
      "source": [
        "packages/ui-react/src/components/Layout/Layout.tsx",
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier doctor, selected library, adjacent status cards"
      ],
      "checks": [
        "full-surface full-details positive and unwrapped negative"
      ]
    },
    {
      "family": "DefinitionList",
      "reference": "published key/value definition family",
      "changes": [
        "nested terms and values wrap inside same parent",
        "no data clipping or text substitution"
      ],
      "source": [
        "packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx",
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier selected-library metadata"
      ],
      "checks": [
        "DomainDisplay.test",
        "full-details nested-card geometry"
      ]
    },
    {
      "family": "OperationFeedback",
      "reference": "published StatusBadge and DisclosurePanel",
      "changes": [
        "long operation identity and structured receipt wrap in labeled details",
        "phase badges remain compact and truthful"
      ],
      "source": [
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier doctor and command receipt"
      ],
      "checks": [
        "full-details byte equality, positive containment and negative nowrap"
      ]
    },
    {
      "family": "TableShell/RecordRow/SettingRow transient target",
      "reference": "existing selection-fill and selection-edge grammar",
      "changes": [
        "same selection tokens",
        "one boundary owner avoids doubled edges",
        "target attribute does not claim selected/focused identity; consumer owns navigation timer"
      ],
      "source": [
        "packages/ui-react/src/components/Navigation/Navigation.tsx"
      ],
      "consumer": [
        "Atelier model-category count navigation, setting matches"
      ],
      "checks": [
        "Navigation.test",
        "ds:consumption:proof transient target geometry"
      ]
    },
    {
      "family": "Storybook static bridge and CSS placement",
      "reference": "published package CSS and static-overlay consumption contracts",
      "changes": [
        "build packages the same static dropdown bridge",
        "working translated dropdown example",
        "shared settings CSS remains in package truth"
      ],
      "source": [
        "apps/storybook/src/build.tsx",
        "apps/storybook/src/build/page-template.tsx",
        "apps/storybook/src/contract-stories/story-content.tsx"
      ],
      "consumer": [
        "production documentation and authorized static consumers"
      ],
      "checks": [
        "storybook:smoke",
        "full-surface:proof",
        "internal-alpha:browser-proof"
      ]
    },
    {
      "family": "Publication identity",
      "reference": "existing design-authority contract",
      "changes": [
        "source commit, component CSS and static bridge digests bind the artifact to the build"
      ],
      "source": [
        "apps/storybook/src/build/design-authority.ts"
      ],
      "consumer": [
        "authorized production readback and fixed consumption snapshot"
      ],
      "checks": [
        "public-docs:vercel-build",
        "production deployment SHA and artifact digest readback"
      ]
    }
  ],
  "changedFiles": [
    {
      "path": "apps/storybook/src/build.tsx",
      "beforeSha256": "2159d4f48a4d01951ce21a02cac58c0ae65dac44aaaa4bd3eea74125585386e3",
      "currentSha256": "a30e341226116d929f79a5b2a9a4bdcf5e6d37b2e45a72c72a8dde837ba32384",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/ai-consumption-contract.ts",
      "beforeSha256": "9a00c23c84675fc00924803e433edc19bace81586cba9babc5f5f806d419f38a",
      "currentSha256": "304f2f5b2ffb5cfad595e6eeffc1aaf1cf8ea839b1bf8ed9e040415a2fe5baf9",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/design-authority.ts",
      "beforeSha256": "cbca596ebae0ae28497e49fc1312d68af85cd79ac5247b84277200a8114ef414",
      "currentSha256": "de6603e3ccd487475a385400dd13bbe209ab2d0793cdaebb7a9a09b473672a73",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/foundation-visual-standards.ts",
      "beforeSha256": "636993503e8d57d87c3ab3e38a1f00ce5f984b2ceebf89f3bfc8c7edbd5f1537",
      "currentSha256": "e02539cc3870a6e17b22acd62c6c84c4e38cb968f88919bedc04c1c9527c4b9b",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/locales/storybook-content-text.ts",
      "beforeSha256": "18aad4f13bdb455ca70188fcf13e75d26ffba52ff0e7c613ecdf649f82b1a622",
      "currentSha256": "bbb7fa8cba6460639a1f682a3f9a4081a3bf2d6548e4194911d3846634025b92",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/locales/storybook-locale-text.ts",
      "beforeSha256": "0a27acccfd87da5d4bf1b6f7349a6778e83b13c9f1dee4ee4a34a045039f2780",
      "currentSha256": "ecf1f9fc4b717e49fc6284ed8ef79c5137eb48744d68a012e60366f49a545d5c",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/build/page-template.tsx",
      "beforeSha256": "b49c918d0c49e5fb6fdb19dcefd7e0a15a345f4bf4ffd9de2702e69441484039",
      "currentSha256": "b01fbca6a16c4453ba711008dd941bca1b365b926892607b43881d50b2fa640a",
      "changedClassReferences": [
        ".tcrn-setting-row",
        ".tcrn-setting-row-list",
        ".tcrn-setting-row__tools",
        ".tcrn-settings-layout__content",
        ".tcrn-settings-layout__form"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/contract-stories/content/component-rows.ts",
      "beforeSha256": "fc3af1a84c799b48da5e7ab30c2ab2c11ae97211e602d108667e81109276b8c8",
      "currentSha256": "9f04969f2db6f97b448d2b28c7887f49ff1fa1d90c0b3598378f3878173e9b59",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "apps/storybook/src/contract-stories/story-content.tsx",
      "beforeSha256": "c3bdf0548ca059d8c3cdb8871b3b35c994efb8d3a1d5e0ed634aeeac8e4dfd07",
      "currentSha256": "b30d325c94723034939485c6feff0711c464c9b581d2c050231a6148389763ad",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "docs/style-scale.md",
      "beforeSha256": "2e8545200fb76b457103985fd227148da913622e073e68a8b298ddc457d9e471",
      "currentSha256": "5606bfb85fff074a36c8c00ac1b30da7880b22734d3593ca8d218342db7badaa",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "docs/verification/internal-alpha/browser-proof-summary.json",
      "beforeSha256": "a24b2d4e74bc1d618f0fa7fe1121991700d3c7d1d789124bacde24b086f8c519",
      "currentSha256": "72c5c3646bae048f95dbc128cff8e8dccc86f781dc76efc7b5256aa9dd4cf6f9",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/component-api-manifest.json",
      "beforeSha256": "52e1bf9670a25bc33a02375754490af5cd14f453c5205ee23aa49cbdcf6cb595",
      "currentSha256": "c5e14b3ebdfc9530601f5fca213d2fb33f50ea4318d5a354fa730f2bc707364e",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/no-overclaim-scan.json",
      "beforeSha256": "dab75779f7a4706a5f79dbea8bb1d933f56eb6bacf9cf75aa8220ef8c6c73160",
      "currentSha256": "180b5d0dc819995783170803f78b03da00756e8b7a37b2c0a6f5b8a9abe51e12",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/package-contract-manifest.json",
      "beforeSha256": "8cbbe814db981ff227d8ff59e85970a5767745067d11a33c16c4f8ebb9368978",
      "currentSha256": "4061ce5e1dc8c36e07244c65138fb7e41c88d2a7b93bcf426d5f8cac3e687a0a",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/story-budget-proof.json",
      "beforeSha256": "58eb9a631a346390488c4ee27d8d8b812c6eed9b734bb63a1c07f67fb657dbdb",
      "currentSha256": "e7890a612c733cdf81bfe305eb91e23cf072bda0faac17579d3113ec636f78b2",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/story-coverage-manifest.json",
      "beforeSha256": "c7f2398e31d340eda3320671ae719129aeee9d3cf97e062375b9703149b0eb3a",
      "currentSha256": "399dea222c2a03d0433e04bcc5b5b5bc9f02caecba89e7691ab2599a9a7a7b63",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/visual-baseline-manifest.json",
      "beforeSha256": "0ea68d055ae8fecb6ce4e0ef46b28c72632141f2124bafc52f7c53c6ceb91195",
      "currentSha256": "82aa0b6c9e54fa19f5ebe7a0e9191b66fed23dc109530ed2ae077f5e4e26c45e",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/internal-alpha/visual-signature-baseline.json",
      "beforeSha256": "6377739f3eb8965e8830f51ae0a75a3f3b56837ea2d94bbcaeeefc33c7e9b9a4",
      "currentSha256": "a056064f92985bd5a0df279ff2b0440317e9fe99b8e7b3713e8f1f7726e4ed1b",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "docs/verification/scaffold-proof.json",
      "beforeSha256": "aedd5bcf9a528b0ef360b47cc2722d3beb80a8025e6a71c0be7aab94e63b91a3",
      "currentSha256": "1810e82212db73609fce1883e45b0cd08c8ef1f950216a3fd3cfc77b592a1619",
      "changedClassReferences": [],
      "classification": "generated verification"
    },
    {
      "path": "package.json",
      "beforeSha256": "5d84d8b0c9f8988f9c9ef42d71d4436556df5bdb251d3ce610f02e8594424bc4",
      "currentSha256": "872c2b0fb5c184ec6fb121dbb45b5304837c3082e064a8b1cdae9f2733ecfa11",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/README.md",
      "beforeSha256": "99b7e1c1698cab375fe5a5df87a83e934ef1c46a6b9e785d8ba93a52323504b1",
      "currentSha256": "2e64aee5707043eecd495fcc643efecc475986285b588b69cd719ebd2bae4e25",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx",
      "beforeSha256": "8c874cfeb5fc95bade0ec9ec9abed8b13ec1992f3fb7d1939175481942a66034",
      "currentSha256": "99fbb29f42c7bb250d81dc5578335a74921851194c634089f875f0f92367eaf6",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx",
      "beforeSha256": "bb81c570652f78c8fcc49e2fba7ab00f5da8d7756c9180aa933f8215e4ca1f86",
      "currentSha256": "d80d0220e164d0eeafa265ad052299696c973cf93a292f298c66d62b4ee24e94",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Form/Form.test.tsx",
      "beforeSha256": "94e496f3b4c583a6390149d13411b78c5d985b7a9356e8f13e789ec38aa7e54c",
      "currentSha256": "b1f0f85e17111cd71ffbdd160e36b4327bf73927350314807e3db6bf00697900",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Form/Form.tsx",
      "beforeSha256": "39b23766e114586e71323b21eaec28c8b9a66661da1c48277258ec4e67facad0",
      "currentSha256": "c3c58d520645fba4d72820df302f5c2fb9e0a8b4ae6c411ced58fdcacb88119b",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Form/index.ts",
      "beforeSha256": "70d259ce3682ae9d8c8273ffdeb0fd19e6cace1412b90b9e94055ed600656094",
      "currentSha256": "6c76f006b4539983d52339ce093d2bd7b7564edf9413a6303a7d1834f4fc9fe7",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Form/multi-select-dropdown.ts",
      "beforeSha256": null,
      "currentSha256": "e8e9ec588e870d062f8ba5f3cb8ee52019c375298c756e6b4cdc430e11fbccc5",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Layout/Layout.tsx",
      "beforeSha256": "a9ad7a2603fab3aab2da1080b4c7b9a52d3c72da4059a990528b776250b2ccbf",
      "currentSha256": "2f77a6145b4b133f394a5a8f37311df63b2fe13438287bde4d6a42a1dcb263ec",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Navigation/Navigation.test.tsx",
      "beforeSha256": "463441e2191c3b5b377266bb6d70db1afe420b3821594f1b5a83ec2ef2cd77c3",
      "currentSha256": "fc4d9ac82fdf2c0268cd9c555021585b4a609b9ba6effb0cd0f25b3e203a0c85",
      "changedClassReferences": [
        ".tcrn-field",
        ".tcrn-input",
        ".tcrn-number-input",
        ".tcrn-record-row",
        ".tcrn-select",
        ".tcrn-setting-row",
        ".tcrn-setting-row-list",
        ".tcrn-setting-row__control",
        ".tcrn-settings-layout__form",
        ".tcrn-table-shell__row"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/components/Navigation/Navigation.tsx",
      "beforeSha256": "651d1a672f8b68b7117fc9321e2d0ef97224c8febd760143f5e37e863a75ec9e",
      "currentSha256": "d67bed895c91cff3d5326f7f7dd71b0b90d5272acbbcb122fc171e12de95f1b4",
      "changedClassReferences": [
        ".tcrn-definition-list__item",
        ".tcrn-field",
        ".tcrn-icon",
        ".tcrn-input",
        ".tcrn-multi-select-dropdown",
        ".tcrn-multi-select-dropdown__list",
        ".tcrn-multi-select-dropdown__option",
        ".tcrn-multi-select-dropdown__trigger",
        ".tcrn-multi-select-group",
        ".tcrn-multi-select-group__actions",
        ".tcrn-multi-select-group__clear",
        ".tcrn-multi-select-group__option",
        ".tcrn-multi-select-group__options",
        ".tcrn-number-input",
        ".tcrn-number-input-field",
        ".tcrn-operation-feedback__details-body",
        ".tcrn-operation-feedback__identity",
        ".tcrn-record-row",
        ".tcrn-select",
        ".tcrn-setting-choice",
        ".tcrn-setting-row",
        ".tcrn-setting-row-list",
        ".tcrn-setting-row__control",
        ".tcrn-setting-row__tools",
        ".tcrn-settings-layout__form",
        ".tcrn-surface__head",
        ".tcrn-surface__head-actions",
        ".tcrn-surface__head-content",
        ".tcrn-table-shell__cell",
        ".tcrn-table-shell__row"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/index.tsx",
      "beforeSha256": "26642b9769f4de70bb5d107f63fbe9a5c0aedc4d3619292c862d15880577de61",
      "currentSha256": "0ba0f246eb13d478464bea213d65985cbc96440b0edf90edf13d3643fb9eee0b",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "packages/ui-react/src/test/multi-select.dom.spec.tsx",
      "beforeSha256": null,
      "currentSha256": "5bc079f88a37c15eded54c254e1a41f87de1f49e27e837f13112a03421d25a7c",
      "changedClassReferences": [
        ".tcrn-field__hint",
        ".tcrn-multi-select-group__clear"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/ds-consumption-proof.mjs",
      "beforeSha256": "705d87f5d78662a1f6db77bffe5b42cb78600a0eeaf5db6fb7f046182ed50ac6",
      "currentSha256": "73158b0f2a639b3a66468b42d3091d40365295650920042e56cb108200fd3847",
      "changedClassReferences": [
        ".tcrn-setting-row",
        ".tcrn-setting-row__control",
        ".tcrn-setting-row__label",
        ".tcrn-setting-row__tools",
        ".tcrn-settings-layout__content",
        ".tcrn-settings-layout__form",
        ".tcrn-sr-only"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/full-surface-remediation-proof.mjs",
      "beforeSha256": "d292c43648b6f69a656f98684bdb13f25e60990c619d4e75102263ab5906e612",
      "currentSha256": "3fc162a9821a582545d171f6b98fbbbe9130080b06fea34284d31ab9ee824219",
      "changedClassReferences": [
        ".tcrn-badge",
        ".tcrn-definition-list__definition",
        ".tcrn-definition-list__term",
        ".tcrn-multi-select-dropdown__value",
        ".tcrn-multi-select-group",
        ".tcrn-multi-select-group__clear",
        ".tcrn-operation-feedback",
        ".tcrn-operation-feedback__details-body",
        ".tcrn-operation-feedback__identity",
        ".tcrn-operation-feedback__summary",
        ".tcrn-surface",
        ".tcrn-surface__head",
        ".tcrn-table-shell__cell"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/internal-alpha-browser-proof.mjs",
      "beforeSha256": "054dbfb81d17fb5b3bad3d2432d68393898f09c387c02aa07f1482b51fdca504",
      "currentSha256": "7744916fcc3a3ab370ec955f235aa6cdfef98556d60a248dad1567791a1d1168",
      "changedClassReferences": [
        ".tcrn-setting-row-list",
        ".tcrn-setting-row__control",
        ".tcrn-setting-row__label",
        ".tcrn-setting-row__tools",
        ".tcrn-settings-layout__content",
        ".tcrn-settings-layout__form"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/lib/multi-select-dropdown-proof.mjs",
      "beforeSha256": null,
      "currentSha256": "000db4bcbcdb0a1bd74aa5218a0aec037a59a6e12f7e313bedb10b588a37cb89",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/lib/multi-select-required-proof.mjs",
      "beforeSha256": null,
      "currentSha256": "a7c664dc599c6e2f4e69391ea5d2bc8ef1c6eb6fd51a1ecd320fdbbc71f7753e",
      "changedClassReferences": [
        ".tcrn-multi-select-group__clear"
      ],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "scripts/lib/story-budget.mjs",
      "beforeSha256": "934d6a731f5f1156c64ab707cc8271ca874bbe12e33d0ce7addb9c347f165272",
      "currentSha256": "eb3d3578ac0829a020e8dde8dd948a6fdf0ef450f74cebf90a07dd28ef55d4b5",
      "changedClassReferences": [],
      "classification": "source / standards / examples / applicable verification"
    },
    {
      "path": "tests/full-surface-remediation.test.mjs",
      "beforeSha256": "aa45f01a72a4748f471f1ecfb004d94d6aab7f40ad8097aefa540a12f259947a",
      "currentSha256": "1162acb94a3cd8584977b98c74f085170b0ed6f127a2713b7dcee50ee2203c79",
      "changedClassReferences": [
        ".tcrn-multi-select",
        ".tcrn-multi-select-group",
        ".tcrn-multi-select-group__clear"
      ],
      "classification": "source / standards / examples / applicable verification"
    }
  ],
  "ownerVisualAcceptance": "returned; no machine substitute",
  "verification": {
    "completeWorkspace": "ds-verify-publishable",
    "exitCode": 0,
    "browserCaptures": 271,
    "axeViolations": 0,
    "ownerVisualAcceptance": "not claimed",
    "rawProblems": "ds-batch-problems.json"
  },
  "files": [
    {
      "file": "apps/storybook/src/build.tsx",
      "productionBeforeSha256": "2159d4f48a4d01951ce21a02cac58c0ae65dac44aaaa4bd3eea74125585386e3",
      "currentSha256": "a30e341226116d929f79a5b2a9a4bdcf5e6d37b2e45a72c72a8dde837ba32384",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/ai-consumption-contract.ts",
      "productionBeforeSha256": "9a00c23c84675fc00924803e433edc19bace81586cba9babc5f5f806d419f38a",
      "currentSha256": "304f2f5b2ffb5cfad595e6eeffc1aaf1cf8ea839b1bf8ed9e040415a2fe5baf9",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/design-authority.ts",
      "productionBeforeSha256": "cbca596ebae0ae28497e49fc1312d68af85cd79ac5247b84277200a8114ef414",
      "currentSha256": "de6603e3ccd487475a385400dd13bbe209ab2d0793cdaebb7a9a09b473672a73",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/foundation-visual-standards.ts",
      "productionBeforeSha256": "636993503e8d57d87c3ab3e38a1f00ce5f984b2ceebf89f3bfc8c7edbd5f1537",
      "currentSha256": "e02539cc3870a6e17b22acd62c6c84c4e38cb968f88919bedc04c1c9527c4b9b",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/locales/storybook-content-text.ts",
      "productionBeforeSha256": "18aad4f13bdb455ca70188fcf13e75d26ffba52ff0e7c613ecdf649f82b1a622",
      "currentSha256": "bbb7fa8cba6460639a1f682a3f9a4081a3bf2d6548e4194911d3846634025b92",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/locales/storybook-locale-text.ts",
      "productionBeforeSha256": "0a27acccfd87da5d4bf1b6f7349a6778e83b13c9f1dee4ee4a34a045039f2780",
      "currentSha256": "ecf1f9fc4b717e49fc6284ed8ef79c5137eb48744d68a012e60366f49a545d5c",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/build/page-template.tsx",
      "productionBeforeSha256": "b49c918d0c49e5fb6fdb19dcefd7e0a15a345f4bf4ffd9de2702e69441484039",
      "currentSha256": "9263fc9e052c067cf0bd4c596055d2af8350316995514842b844dc202b238ac1",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/contract-stories/content/component-rows.ts",
      "productionBeforeSha256": "fc3af1a84c799b48da5e7ab30c2ab2c11ae97211e602d108667e81109276b8c8",
      "currentSha256": "9f04969f2db6f97b448d2b28c7887f49ff1fa1d90c0b3598378f3878173e9b59",
      "classification": "source/contract/example/test"
    },
    {
      "file": "apps/storybook/src/contract-stories/story-content.tsx",
      "productionBeforeSha256": "c3bdf0548ca059d8c3cdb8871b3b35c994efb8d3a1d5e0ed634aeeac8e4dfd07",
      "currentSha256": "b30d325c94723034939485c6feff0711c464c9b581d2c050231a6148389763ad",
      "classification": "source/contract/example/test"
    },
    {
      "file": "docs/style-scale.md",
      "productionBeforeSha256": "2e8545200fb76b457103985fd227148da913622e073e68a8b298ddc457d9e471",
      "currentSha256": "5606bfb85fff074a36c8c00ac1b30da7880b22734d3593ca8d218342db7badaa",
      "classification": "source/contract/example/test"
    },
    {
      "file": "docs/verification/inc399-component-family-audit.md",
      "productionBeforeSha256": null,
      "currentSha256": "166ab32d57361a11ba74daaab68c2daf6b529adee060d6b6b24c2f0c2cf2fca1",
      "classification": "source/contract/example/test"
    },
    {
      "file": "docs/verification/internal-alpha/browser-proof-summary.json",
      "productionBeforeSha256": "a24b2d4e74bc1d618f0fa7fe1121991700d3c7d1d789124bacde24b086f8c519",
      "currentSha256": "53327fd9c3ce0f37a1f2bd92d159536c7622c1b274d1587dac050121478e4c94",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/component-api-manifest.json",
      "productionBeforeSha256": "52e1bf9670a25bc33a02375754490af5cd14f453c5205ee23aa49cbdcf6cb595",
      "currentSha256": "1641e3a180ae2276151184ecc4bcfa422448c4eee019ffc4e1e3479b4a8c2064",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/no-overclaim-scan.json",
      "productionBeforeSha256": "dab75779f7a4706a5f79dbea8bb1d933f56eb6bacf9cf75aa8220ef8c6c73160",
      "currentSha256": "6e411e1c09c52b71e4bca0096f23e184230646f218116d812a7c1f2aef09b7ac",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/package-contract-manifest.json",
      "productionBeforeSha256": "8cbbe814db981ff227d8ff59e85970a5767745067d11a33c16c4f8ebb9368978",
      "currentSha256": "58b252fbdfb64817f0a733fb8ca57778e28c6970bc04dbf93a3849509953e378",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/story-budget-proof.json",
      "productionBeforeSha256": "58eb9a631a346390488c4ee27d8d8b812c6eed9b734bb63a1c07f67fb657dbdb",
      "currentSha256": "6c1f5445467274d361784bbc9b36e6abd4a5b73774643b8abbf12fa764cdf13d",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/story-coverage-manifest.json",
      "productionBeforeSha256": "c7f2398e31d340eda3320671ae719129aeee9d3cf97e062375b9703149b0eb3a",
      "currentSha256": "2bd7d913e6aac017d5d042ff3ccf8ce3ffca81e09f79da6eeb463f7b360b9089",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/visual-baseline-manifest.json",
      "productionBeforeSha256": "0ea68d055ae8fecb6ce4e0ef46b28c72632141f2124bafc52f7c53c6ceb91195",
      "currentSha256": "2b04f7bb4051db3cd1f4ed4587734d6c659991f9d92dbb437c1e7ddee0b9ae54",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/internal-alpha/visual-signature-baseline.json",
      "productionBeforeSha256": "6377739f3eb8965e8830f51ae0a75a3f3b56837ea2d94bbcaeeefc33c7e9b9a4",
      "currentSha256": "af127be933ecd1b22efd8e97d14c2837215d24845310c65b3aca7e833ef65e62",
      "classification": "generated verification"
    },
    {
      "file": "docs/verification/scaffold-proof.json",
      "productionBeforeSha256": "aedd5bcf9a528b0ef360b47cc2722d3beb80a8025e6a71c0be7aab94e63b91a3",
      "currentSha256": "8ba2b6aad6d610a44473fa692646b91a669b952874065d80ecdb2c0703061c43",
      "classification": "generated verification"
    },
    {
      "file": "package.json",
      "productionBeforeSha256": "5d84d8b0c9f8988f9c9ef42d71d4436556df5bdb251d3ce610f02e8594424bc4",
      "currentSha256": "872c2b0fb5c184ec6fb121dbb45b5304837c3082e064a8b1cdae9f2733ecfa11",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/README.md",
      "productionBeforeSha256": "99b7e1c1698cab375fe5a5df87a83e934ef1c46a6b9e785d8ba93a52323504b1",
      "currentSha256": "2e64aee5707043eecd495fcc643efecc475986285b588b69cd719ebd2bae4e25",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx",
      "productionBeforeSha256": "8c874cfeb5fc95bade0ec9ec9abed8b13ec1992f3fb7d1939175481942a66034",
      "currentSha256": "99fbb29f42c7bb250d81dc5578335a74921851194c634089f875f0f92367eaf6",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx",
      "productionBeforeSha256": "bb81c570652f78c8fcc49e2fba7ab00f5da8d7756c9180aa933f8215e4ca1f86",
      "currentSha256": "d80d0220e164d0eeafa265ad052299696c973cf93a292f298c66d62b4ee24e94",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Form/Form.test.tsx",
      "productionBeforeSha256": "94e496f3b4c583a6390149d13411b78c5d985b7a9356e8f13e789ec38aa7e54c",
      "currentSha256": "b1f0f85e17111cd71ffbdd160e36b4327bf73927350314807e3db6bf00697900",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Form/Form.tsx",
      "productionBeforeSha256": "39b23766e114586e71323b21eaec28c8b9a66661da1c48277258ec4e67facad0",
      "currentSha256": "c7cee2805f52760312d98a30ef4ae201141a62b571f2fc91f64f5508716986ad",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Form/index.ts",
      "productionBeforeSha256": "70d259ce3682ae9d8c8273ffdeb0fd19e6cace1412b90b9e94055ed600656094",
      "currentSha256": "6c76f006b4539983d52339ce093d2bd7b7564edf9413a6303a7d1834f4fc9fe7",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Form/multi-select-dropdown.ts",
      "productionBeforeSha256": null,
      "currentSha256": "88fa9e7c60c034bcc6eed967084fd66d9eaef75b9c721fc45010a3cacc95079d",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Layout/Layout.tsx",
      "productionBeforeSha256": "a9ad7a2603fab3aab2da1080b4c7b9a52d3c72da4059a990528b776250b2ccbf",
      "currentSha256": "2f77a6145b4b133f394a5a8f37311df63b2fe13438287bde4d6a42a1dcb263ec",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Navigation/Navigation.test.tsx",
      "productionBeforeSha256": "463441e2191c3b5b377266bb6d70db1afe420b3821594f1b5a83ec2ef2cd77c3",
      "currentSha256": "fc4d9ac82fdf2c0268cd9c555021585b4a609b9ba6effb0cd0f25b3e203a0c85",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/components/Navigation/Navigation.tsx",
      "productionBeforeSha256": "651d1a672f8b68b7117fc9321e2d0ef97224c8febd760143f5e37e863a75ec9e",
      "currentSha256": "de76043315d624bd3cd8bbff589356a0dd0586b96d76b1d172a8f607ee48ec0b",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/index.tsx",
      "productionBeforeSha256": "26642b9769f4de70bb5d107f63fbe9a5c0aedc4d3619292c862d15880577de61",
      "currentSha256": "0ba0f246eb13d478464bea213d65985cbc96440b0edf90edf13d3643fb9eee0b",
      "classification": "source/contract/example/test"
    },
    {
      "file": "packages/ui-react/src/test/multi-select.dom.spec.tsx",
      "productionBeforeSha256": null,
      "currentSha256": "5bc079f88a37c15eded54c254e1a41f87de1f49e27e837f13112a03421d25a7c",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/ds-consumption-proof.mjs",
      "productionBeforeSha256": "705d87f5d78662a1f6db77bffe5b42cb78600a0eeaf5db6fb7f046182ed50ac6",
      "currentSha256": "73158b0f2a639b3a66468b42d3091d40365295650920042e56cb108200fd3847",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/full-surface-remediation-proof.mjs",
      "productionBeforeSha256": "d292c43648b6f69a656f98684bdb13f25e60990c619d4e75102263ab5906e612",
      "currentSha256": "090d0160d6e614556668e37d4d6a3afef3468a70bd189f2cd9398fa28420b245",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/internal-alpha-browser-proof.mjs",
      "productionBeforeSha256": "054dbfb81d17fb5b3bad3d2432d68393898f09c387c02aa07f1482b51fdca504",
      "currentSha256": "7744916fcc3a3ab370ec955f235aa6cdfef98556d60a248dad1567791a1d1168",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/lib/multi-select-dropdown-proof.mjs",
      "productionBeforeSha256": null,
      "currentSha256": "c7030d83856e6adf420b7bb0ad24ed4e767a938c0b4592fabe00ae15bbbb58e5",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/lib/multi-select-required-proof.mjs",
      "productionBeforeSha256": null,
      "currentSha256": "a7c664dc599c6e2f4e69391ea5d2bc8ef1c6eb6fd51a1ecd320fdbbc71f7753e",
      "classification": "source/contract/example/test"
    },
    {
      "file": "scripts/lib/story-budget.mjs",
      "productionBeforeSha256": "934d6a731f5f1156c64ab707cc8271ca874bbe12e33d0ce7addb9c347f165272",
      "currentSha256": "df06f6b4cbbdced9620272d311e8c84191ac7ea61366f9d3d8f080ed9947d097",
      "classification": "source/contract/example/test"
    },
    {
      "file": "tests/full-surface-remediation.test.mjs",
      "productionBeforeSha256": "aa45f01a72a4748f471f1ecfb004d94d6aab7f40ad8097aefa540a12f259947a",
      "currentSha256": "8e582f0c2770de899625b0c5261f5ba67a596200ba99549abbfd72955dc5aef6",
      "classification": "source/contract/example/test"
    }
  ]
}
