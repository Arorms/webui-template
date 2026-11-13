import { useState } from 'react'
import { Check, Inbox, Info, Package, Plus, Search, Trash2 } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  ChipGroup,
  ChipToggleGroup,
  ConfirmDialog,
  DataTable,
  DataTableActions,
  DataTablePrimaryCell,
  DataTableRow,
  DescriptionItem,
  DescriptionList,
  DetailHeader,
  Empty,
  EmptyState,
  ErrorText,
  ErrorState,
  Field,
  FilterBar,
  IconButton,
  InsetPanel,
  Input,
  ItemCard,
  LoadingText,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  SectionCard,
  SettingsMenu,
  SectionHeader,
  Segmented,
  Select,
  Skeleton,
  SkeletonRows,
  SkeletonStat,
  SkeletonText,
  Spinner,
  StatCard,
  Tag,
  Textarea,
  ThemeSwitcher,
  useToast,
  type DataTableColumn,
} from '@arorms/ui'
import { useT } from '@arorms/core'

const columns: DataTableColumn[] = [
  { span: 6, header: 'Name' },
  { span: 4, header: 'Meta' },
  { span: 2, header: 'Actions', align: 'right' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/**
 * Living design system. Every primitive in every variant, in both themes — the acceptance artifact
 * for "did the package drift?". Kept out of the auth gate so it always loads.
 */
export function KitPage() {
  const t = useT()
  const { pushToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <PageHeader
        title={t('kit.title')}
        description={t('kit.description')}
        actions={<ThemeSwitcher />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Records" value="128" hint="12 active · 3 drafts" />
        <StatCard icon={Inbox} label="Pending" value="4" badge={<Badge tone="warning">Review</Badge>} />
        <StatCard label="Uptime" value="99.98%" hint="Last 30 days" />
      </div>

      <Section title={t('kit.buttons')}>
        <Row label="primary / secondary / danger / ghost / icon">
          <Button variant="primary">
            <Plus size={14} /> Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">
            <Trash2 size={14} /> Danger
          </Button>
          <Button variant="ghost" aria-label="Search">
            <Search size={16} />
          </Button>
          <IconButton title="Check">
            <Check size={14} />
          </IconButton>
          <IconButton tone="danger" title="Delete">
            <Trash2 size={14} />
          </IconButton>
        </Row>
        <Row label="disabled">
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="danger" disabled>
            Danger
          </Button>
        </Row>
        <Row label="loading (spinner + stable width)">
          <Button variant="primary" loading loadingText="Saving…">
            Save
          </Button>
          <Button variant="secondary" loading>
            Refresh
          </Button>
        </Row>
        <Row label="full-width form submit (pill retained)">
          <Button variant="primary" className="w-full sm:w-64">
            Save changes
          </Button>
        </Row>
      </Section>

      <Section title={t('kit.inputs')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Text input" hint="Muted recess at rest, card float on focus.">
            {(id) => <Input id={id} placeholder="Vendor name" />}
          </Field>
          <Field label="Required + error" required error="This field is required.">
            {(id) => <Input id={id} defaultValue="" placeholder="Enter a slug" />}
          </Field>
          <Field label="Select">
            {(id) => (
              <Select id={id} defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            )}
          </Field>
          <Field label="Disabled">
            {(id) => <Input id={id} disabled defaultValue="Read only" />}
          </Field>
        </div>
        <Field label="Textarea">
          {(id) => <Textarea id={id} defaultValue="A calm editor surface with the stronger focus ring." />}
        </Field>
        <Checkbox label="Native checkbox with accent-primary" defaultChecked />
        <ErrorText>Standalone error text token.</ErrorText>
      </Section>

      <Section title={t('kit.feedback')}>
        <Row label="badges">
          <Badge>Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success">Published</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger">Failed</Badge>
        </Row>
        <Row label="loading">
          <Spinner size={16} />
          <Spinner size={24} />
          <Spinner size={32} />
          <LoadingText className="p-0" />
        </Row>
        <Row label="empty">
          <Empty icon={Inbox} message="No records yet." className="w-full" action={<Button variant="primary">Create record</Button>} />
        </Row>
        <Row label="toasts">
          <Button variant="secondary" onClick={() => pushToast({ message: 'Record saved.', tone: 'success' })}>
            Success toast
          </Button>
          <Button variant="secondary" onClick={() => pushToast({ message: 'Could not reach the server.', tone: 'danger' })}>
            Danger toast
          </Button>
          <Button variant="secondary" onClick={() => pushToast({ message: 'Heads up: nightly sync at 02:00.', tone: 'info' })}>
            Info toast
          </Button>
        </Row>
      </Section>

      <Section title={t('kit.surfaces')}>
        <Row label="card (12px, hairline, single shadow)">
          <Card className="w-full p-4">
            <p className="text-[13px] font-medium text-foreground">Card surface</p>
            <p className="mt-1 text-[12px] text-muted-foreground">bg-card · border-border · rounded-lg · shadow-sm</p>
          </Card>
        </Row>
        <Row label="inset panel (never a nested card)">
          <InsetPanel className="w-full p-4">
            <p className="text-[13px] text-foreground">Inset panel</p>
            <p className="mt-1 text-[12px] text-muted-foreground">rounded-xl bg-muted</p>
          </InsetPanel>
        </Row>
        <Row label="className override proof">
          {/* p-6 would come from a default; here we prove merge order wins. */}
          <Card className="rounded-full bg-primary p-4">
            <p className="text-[13px] font-medium text-primary-foreground">
              rounded-full · bg-primary · p-4 overrides defaults
            </p>
          </Card>
        </Row>
      </Section>


      <Section title={t('kit.selects')}>
        <Row label="search input (clearable)">
          <SearchInput value="invoice" onChange={() => {}} className="w-full sm:w-72" />
          <SearchInput value="" onChange={() => {}} className="w-full sm:w-72" placeholder="Empty state" />
        </Row>
        <Row label="chips (single-select group)">
          <ChipGroup
            value="all"
            onChange={() => {}}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </Row>
        <Row label="chips (multi-select) & static tags">
          <ChipToggleGroup
            options={[
              { value: 'finance', label: 'finance' },
              { value: 'security', label: 'security' },
              { value: 'archive', label: 'archive' },
            ]}
            selected={['finance', 'archive']}
            onToggle={() => {}}
          />
          <Chip selected>Selected chip</Chip>
          <Chip>Unselected chip</Chip>
          <Tag>static tag</Tag>
        </Row>
        <Row label="segmented control">
          <Segmented
            ariaLabel="Density"
            value="comfortable"
            onChange={() => {}}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
            ]}
          />
        </Row>
        <Row label="avatars">
          <Avatar name="DE" size="sm" />
          <Avatar name="AL" />
          <Avatar name="OP" size="lg" />
        </Row>
      </Section>

      <Section title={t('kit.states')}>
        <Row label="skeleton primitives">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="w-full sm:w-64">
            <SkeletonText lines={3} />
          </div>
        </Row>
        <div className="grid gap-4 sm:grid-cols-3">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <Row label="skeleton rows (list loading)">
          <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
            <SkeletonRows rows={3} avatar />
          </div>
        </Row>
        <Row label="empty state / error state">
          <EmptyState
            icon={Inbox}
            title="No records yet"
            description="Create the first record to get started."
            action={<Button variant="primary">Create record</Button>}
            className="w-full sm:w-80"
          />
          <ErrorState message="Could not reach the server." onRetry={() => {}} className="w-full sm:w-80" />
        </Row>
        <Row label="inline loading text">
          <LoadingText className="p-0" />
        </Row>
      </Section>

      <Section title={t('kit.patterns')}>
        <div className="w-full space-y-4">
          <SectionHeader
            title="Section header"
            description="13px semibold over a muted icon tile."
            icon={Package}
            actions={<Button variant="secondary">Action</Button>}
          />
          <FilterBar actions={<Badge>24 records</Badge>}>
            <SearchInput value="" onChange={() => {}} className="sm:max-w-xs" />
            <ChipGroup
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'All' },
                { value: 'active', label: 'Active' },
              ]}
            />
          </FilterBar>
          <div className="grid gap-3 sm:grid-cols-2">
            <ItemCard
              title="Invoice archive"
              meta="/finance/archive"
              icon={Package}
              actions={
                <IconButton title="Edit">
                  <Check size={14} />
                </IconButton>
              }
            />
            <ItemCard title="Vendor registry" meta="/procurement/vendors" icon={Inbox} onClick={() => {}} />
          </div>
          <SectionCard title="Section card" description="Card with a header band and optional footer." footer={<span className="text-[12px] text-muted-foreground">Footer slot</span>}>
            <DescriptionList>
              <DescriptionItem label="Status">
                <Badge tone="success">Active</Badge>
              </DescriptionItem>
              <DescriptionItem label="Owner">demo.operator@arorms.cn</DescriptionItem>
              <DescriptionItem label="Empty value">{null}</DescriptionItem>
              <DescriptionItem label="Created">2026-09-02 08:10:00</DescriptionItem>
            </DescriptionList>
          </SectionCard>
          <DetailHeader
            title="Detail header"
            backTo="/kit"
            backLabel="Back to kit"
            description="Back link, 22px title and an action cluster."
            actions={<Button variant="primary">Edit</Button>}
          />
        </div>
      </Section>

      <Section title={t('kit.table')}>
        <DataTable
          columns={columns}
          emptyState={
            <Empty icon={Inbox} message="No records." className="rounded-none border-0" />
          }
        >
          <DataTableRow columns={columns}>
            <DataTablePrimaryCell title="Invoice archive" meta="Created 2026-09-02" />
            <Badge tone="success">Active</Badge>
            <DataTableActions>
              <IconButton title="Edit">
                <Check size={14} />
              </IconButton>
              <IconButton tone="danger" title="Delete">
                <Trash2 size={14} />
              </IconButton>
            </DataTableActions>
          </DataTableRow>
          <DataTableRow columns={columns}>
            <DataTablePrimaryCell title="Vendor registry" meta="Created 2026-09-18" />
            <Badge tone="warning">Pending</Badge>
            <DataTableActions>
              <IconButton title="Edit">
                <Check size={14} />
              </IconButton>
              <IconButton tone="danger" title="Delete">
                <Trash2 size={14} />
              </IconButton>
            </DataTableActions>
          </DataTableRow>
        </DataTable>
        <Pagination page={0} isLast={false} total={128} onPrevious={() => {}} onNext={() => {}} />
      </Section>

      <Section title={t('kit.settings')}>
        <Row label="settings gear — click to open, rows open a second level">
          {/* The panel is anchored to the nearest positioned ancestor, so the gear needs a box. */}
          <div className="relative flex h-44 w-56 items-end justify-end rounded-xl border border-dashed border-border p-3">
            <SettingsMenu
              className="relative"
              onLogout={() => pushToast({ message: 'Signed out (demo).', tone: 'info' })}
            />
          </div>
        </Row>
      </Section>

      <Section title={t('kit.overlays')}>
        <Row label="modal / confirm">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            <Info size={14} /> {t('kit.openModal')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmOpen(true)
              pushToast({ message: 'Dialog opened — Esc or overlay closes it.', tone: 'info' })
            }}
          >
            {t('kit.openConfirm')}
          </Button>
        </Row>
      </Section>

      {modalOpen ? (
        <Modal
          title="Edit record"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button className="flex-1 rounded-full bg-muted text-foreground hover:bg-muted/70" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => setModalOpen(false)}>
                Save
              </Button>
            </>
          }
        >
          <Field label="Name">
            {(id) => <Input id={id} defaultValue="Vendor registry" />}
          </Field>
          <Field label="Notes" hint="Markdown is not rendered here.">
            {(id) => <Textarea id={id} defaultValue="Approved suppliers." />}
          </Field>
        </Modal>
      ) : null}

      {confirmOpen ? (
        <ConfirmDialog
          title="Delete record?"
          description="This cannot be undone."
          confirmLabel="Delete"
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false)
            pushToast({ message: 'Record deleted.', tone: 'success' })
          }}
        />
      ) : null}
    </>
  )
}
