import { useState, useCallback } from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowOrderChangeParams,
} from '@mui/x-data-grid-premium';
import type { IsRowReorderableParams } from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthRow {
  id: number;
  supplier: string;
  supplierId: number;
  location: string;
  locationId: number;
  productCode: string;
  productName: string;
  type: 'Weekly' | 'Monthly' | 'Daily' | 'Unlimited' | 'Self';
  authVol: number | null;
  remainingVol: number | null;
  renewalVol: number | null;
  endDate: string;
  active: boolean;
  status: 'active' | 'expiring' | 'expired';
  sequence: number;
}

// ---------------------------------------------------------------------------
// Reference data from Coda "Dummy Data" page
// ---------------------------------------------------------------------------

const PRODUCTS: Record<string, string> = {
  A: '91 OCTANE w/o 10% ETH',
  A78: '91 OCT w/o 10% ETH low RVP',
  AR: 'PREM RBOB 93 OCT w/ 10% ETH',
  A5: '88.5 OCT w/o 10% ETH',
  AMS: '88.5 OCT w/o 10% ETH low RVP',
  V: '87 OCTANE w/ 10% ETH',
  V78: '87 OCT w/ 10% ETH low RVP',
  V2: '87 OCTANE w/ 10% ETH',
  V3: '86 OCTANE w/ 10% ETH',
  V3S: '86 OCT w/ 10% ETH low RVP',
  NEP: '87 OCT w/o ETH export only',
  NR: 'RBOB 87 OCT w/ 10% ETH',
  E: 'ETHANOL',
  L: 'PROPANE',
  T: 'TRANSMIX',
  Q: 'COMMERCIAL JET FUEL',
  QSF: 'JET A w/ SYNTH HYDROCARBONS',
  X: '#2 ULSD 15PPM MAX SULFUR',
  XHO: '#2 ULSD 15PPM NTDF',
  Y: '#1 ULSD 15PPM MAX SULFUR',
  YM: '#1 ULSD ROCKY MTN',
  D: '#2 ULSD PREMIUM DIESEL',
  ZB: '99%/100% METHYL ESTER (BIO)',
  B99: '99% METHYL ESTER (BIO)',
  JP5: 'MILITARY JET FUEL',
};

// ---------------------------------------------------------------------------
// Dummy data — one supplier per location+product (no duplicates)
// ---------------------------------------------------------------------------

type AuthType = AuthRow['type'];

interface RawAuth {
  supplier: string;
  supplierId: number;
  location: string;
  locationId: number;
  productCode: string;
  type: AuthType;
  authVol: number | null;
  remainingVol: number | null;
  renewalVol: number | null;
  endDate: string;
  active: boolean;
}

const RAW_DATA: RawAuth[] = [
  // 201 DES MOINES — multiple suppliers, multiple products
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 100000, endDate: '05/31/2026', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Self', authVol: null, remainingVol: null, renewalVol: 67000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 24000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Self', authVol: null, remainingVol: null, renewalVol: 57000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Self', authVol: null, remainingVol: null, renewalVol: 72000, endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum', supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly', authVol: 20000, remainingVol: 19000, renewalVol: 20000, endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum', supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Weekly', authVol: 25000, remainingVol: 20000, renewalVol: 25000, endDate: '01/19/2026', active: true },
  { supplier: 'Thornfield Petroleum', supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Daily', authVol: 7000, remainingVol: 3000, renewalVol: 7000, endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group', supplierId: 136, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Weekly', authVol: 24000, remainingVol: 15000, renewalVol: 24000, endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group', supplierId: 136, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly', authVol: 98000, remainingVol: 0, renewalVol: 98000, endDate: '12/31/2999', active: true },

  // 207 MASON CITY
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 38000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Self', authVol: null, remainingVol: null, renewalVol: 85000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 26000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Self', authVol: null, remainingVol: null, renewalVol: 69000, endDate: '04/18/2025', active: true },
  { supplier: 'Questmark Energy', supplierId: 160, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly', authVol: 100000, remainingVol: 5000, renewalVol: 100000, endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy', supplierId: 160, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy', supplierId: 179, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Weekly', authVol: 20000, remainingVol: 2000, renewalVol: 20000, endDate: '07/13/2027', active: true },
  { supplier: 'Copperhead Energy', supplierId: 179, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Daily', authVol: 4000, remainingVol: 2000, renewalVol: 4000, endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly', authVol: 27000, remainingVol: 15000, renewalVol: 27000, endDate: '10/28/2025', active: true },

  // 347 BETTENDORF
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 94000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 45000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Self', authVol: null, remainingVol: null, renewalVol: 83000, endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group', supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Weekly', authVol: 15000, remainingVol: 1000, renewalVol: 15000, endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group', supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Monthly', authVol: 87000, remainingVol: 35000, renewalVol: 87000, endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group', supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Daily', authVol: 10000, remainingVol: 5000, renewalVol: 10000, endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum', supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum', supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Monthly', authVol: 29000, remainingVol: 5000, renewalVol: 29000, endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum', supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Daily', authVol: 3000, remainingVol: 1000, renewalVol: 3000, endDate: '09/06/2026', active: true },

  // 227 CARTHAGE
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 35000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 50000, endDate: '12/02/2025', active: true },
  { supplier: 'Wellspring Petroleum', supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Monthly', authVol: 96000, remainingVol: 38000, renewalVol: 96000, endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum', supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Daily', authVol: 9000, remainingVol: 7000, renewalVol: 9000, endDate: '05/23/2027', active: true },
  { supplier: 'Wellspring Petroleum', supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners', supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Weekly', authVol: 14000, remainingVol: 6000, renewalVol: 14000, endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners', supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Daily', authVol: 4000, remainingVol: 0, renewalVol: 4000, endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners', supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '10/05/2026', active: true },

  // 245 GREAT BEND
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 67000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Self', authVol: null, remainingVol: null, renewalVol: 20000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 42000, endDate: '11/08/2026', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Self', authVol: null, remainingVol: null, renewalVol: 99000, endDate: '12/03/2026', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Self', authVol: null, remainingVol: null, renewalVol: 75000, endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply', supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Monthly', authVol: 97000, remainingVol: 80000, renewalVol: 97000, endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply', supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Weekly', authVol: 20000, remainingVol: 13000, renewalVol: 20000, endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply', supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '03/02/2025', active: false },
  { supplier: 'Upland Crude Supply', supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Daily', authVol: 4000, remainingVol: 3000, renewalVol: 4000, endDate: '02/07/2027', active: true },

  // 336 LINCOLN
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Self', authVol: null, remainingVol: null, renewalVol: 39000, endDate: '08/30/2027', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Self', authVol: null, remainingVol: null, renewalVol: 75000, endDate: '12/31/2999', active: true },
  { supplier: 'Lancer Energy Corp', supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Self', authVol: null, remainingVol: null, renewalVol: 22000, endDate: '12/24/2026', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Weekly', authVol: 17000, remainingVol: 10000, renewalVol: 17000, endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Unlimited', authVol: null, remainingVol: null, renewalVol: null, endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Monthly', authVol: 25000, remainingVol: 0, renewalVol: 25000, endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Weekly', authVol: 13000, remainingVol: 12000, renewalVol: 13000, endDate: '12/31/2999', active: true },
];

// ---------------------------------------------------------------------------
// Derive status and enrich rows with sequence numbers
// ---------------------------------------------------------------------------

function deriveStatus(endDate: string, active: boolean): AuthRow['status'] {
  if (!active) return 'expired';
  if (endDate === '12/31/2999') return 'active';
  const end = new Date(endDate);
  const now = new Date('2026-02-25');
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (end < now) return 'expired';
  if (end.getTime() - now.getTime() < thirtyDays) return 'expiring';
  return 'active';
}

function assignSequenceNumbers(data: RawAuth[]): AuthRow[] {
  const counters = new Map<string, number>();
  return data.map((r, i) => {
    const groupKey = `${r.locationId}|${r.productCode}`;
    const seq = (counters.get(groupKey) ?? 0) + 1;
    counters.set(groupKey, seq);
    return {
      ...r,
      id: i + 1,
      productName: PRODUCTS[r.productCode] ?? r.productCode,
      status: deriveStatus(r.endDate, r.active),
      sequence: seq,
    };
  });
}

const initialRows = assignSequenceNumbers(RAW_DATA);

// ---------------------------------------------------------------------------
// Shared renderers
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Unlimited: { bg: '#e8f5e9', text: '#2e7d32' },
  Monthly:   { bg: '#e3f2fd', text: '#1565c0' },
  Weekly:    { bg: '#fff3e0', text: '#e65100' },
  Daily:     { bg: '#fce4ec', text: '#c62828' },
  Self:      { bg: '#f3e5f5', text: '#7b1fa2' },
};

function TypeChip({ value }: { value: string }) {
  const color = TYPE_COLORS[value] ?? { bg: '#f5f5f5', text: '#616161' };
  return (
    <Chip
      label={value}
      size="small"
      sx={{ bgcolor: color.bg, color: color.text, fontWeight: 600, fontSize: '0.75rem', height: 24 }}
    />
  );
}

function VolumeBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const color = pct <= 10 ? 'error' : pct <= 25 ? 'warning' : 'primary';
  return (
    <Tooltip title={`${remaining.toLocaleString()} / ${total.toLocaleString()} gal (${Math.round(pct)}%)`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={color}
          sx={{ flex: 1, height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right', color: 'text.secondary' }}>
          {Math.round(pct)}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

function StatusDot({ status }: { status: AuthRow['status'] }) {
  const config = {
    active:   { color: '#4caf50', label: 'Active' },
    expiring: { color: '#ff9800', label: 'Expiring' },
    expired:  { color: '#f44336', label: 'Expired' },
  };
  const { color, label } = config[status];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

const sharedColumns: GridColDef<AuthRow>[] = [
  {
    field: 'sequence',
    headerName: '#',
    width: 50,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams<AuthRow>) =>
      params.value != null ? (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
        >
          {params.value}
        </Typography>
      ) : null,
  },
  {
    field: 'supplier',
    headerName: 'Supplier',
    width: 220,
    renderCell: (params: GridRenderCellParams<AuthRow>) =>
      params.value ? (
        <Typography variant="body2" noWrap sx={params.row.sequence === 1 ? { fontWeight: 700 } : undefined}>
          <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>{params.row.supplierId}</Box>
          {params.value}
        </Typography>
      ) : null,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 110,
    renderCell: (params: GridRenderCellParams<AuthRow>) =>
      params.value ? <TypeChip value={params.value} /> : null,
  },
  {
    field: 'authVol',
    headerName: 'Auth Vol',
    width: 110,
    type: 'number',
    valueFormatter: (value: number | null) => value != null ? value.toLocaleString() : '—',
  },
  {
    field: 'remainingVol',
    headerName: 'Remaining',
    width: 170,
    renderCell: (params: GridRenderCellParams<AuthRow>) => {
      if (params.row.remainingVol == null || params.row.authVol == null) return '—';
      return <VolumeBar remaining={params.row.remainingVol} total={params.row.authVol} />;
    },
  },
  {
    field: 'renewalVol',
    headerName: 'Renewal Vol',
    width: 120,
    type: 'number',
    valueFormatter: (value: number | null) => value != null ? value.toLocaleString() : '—',
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    width: 110,
    valueFormatter: (value: string) => value === '12/31/2999' ? '∞ No Expiry' : value,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: (params: GridRenderCellParams<AuthRow>) =>
      params.value ? <StatusDot status={params.value as AuthRow['status']} /> : null,
  },
];

// ---------------------------------------------------------------------------
// Shared grid styling
// ---------------------------------------------------------------------------

const gridSx = {
  '& .row-expired': { bgcolor: 'rgba(244, 67, 54, 0.04)' },
  '& .row-expiring': { bgcolor: 'rgba(255, 152, 0, 0.04)' },
  '& .MuiDataGrid-groupingCriteriaCell': { fontWeight: 600 },
  // Hide drag handle on group rows (rows that are not draggable)
  '& .MuiDataGrid-rowReorderCell:not(.MuiDataGrid-rowReorderCell--draggable) .MuiDataGrid-rowReorderIcon': {
    display: 'none',
  },
};

const getRowClassName = (params: { row: AuthRow }) => {
  if (params.row.status === 'expired') return 'row-expired';
  if (params.row.status === 'expiring') return 'row-expiring';
  return '';
};

// Only leaf rows (actual supplier auths) are draggable, not group headers
const isRowReorderable = (params: IsRowReorderableParams<AuthRow>) => {
  return params.row.supplier != null;
};

// Supplier fields that get swapped between slots when reordering
const SUPPLIER_FIELDS = [
  'supplier', 'supplierId', 'type', 'authVol',
  'remainingVol', 'renewalVol', 'endDate', 'active', 'status',
] as const;

type SupplierField = typeof SUPPLIER_FIELDS[number];

function reorderRows(
  prev: AuthRow[],
  params: GridRowOrderChangeParams,
): AuthRow[] {
  const movedRow = prev.find((r) => r.id === params.row.id);
  if (!movedRow) return prev;

  // Get siblings in same location+product group, sorted by sequence (slot order)
  const groupKey = `${movedRow.locationId}|${movedRow.productCode}`;
  const slots = prev
    .filter((r) => `${r.locationId}|${r.productCode}` === groupKey)
    .sort((a, b) => a.sequence - b.sequence);

  const fromIndex = slots.findIndex((r) => r.id === movedRow.id);
  if (fromIndex === -1) return prev;

  // Figure out the target slot index from the grid's reported indices
  let toIndex: number;
  if (params.targetIndex > params.oldIndex) {
    toIndex = Math.min(fromIndex + (params.targetIndex - params.oldIndex), slots.length - 1);
  } else {
    toIndex = Math.max(fromIndex - (params.oldIndex - params.targetIndex), 0);
  }
  if (fromIndex === toIndex) return prev;

  // Extract supplier data from each slot
  const slotData = slots.map((row) => {
    const data: Partial<Record<SupplierField, unknown>> = {};
    for (const field of SUPPLIER_FIELDS) {
      data[field] = row[field];
    }
    return data;
  });

  // Reorder: remove from old position, insert at new position
  const [moved] = slotData.splice(fromIndex, 1);
  slotData.splice(toIndex, 0, moved);

  // Write supplier data back into the fixed slots
  const updated = prev.map((r) => ({ ...r }));
  slots.forEach((slot, i) => {
    const row = updated.find((r) => r.id === slot.id)!;
    const data = slotData[i];
    for (const field of SUPPLIER_FIELDS) {
      (row as Record<string, unknown>)[field] = data[field];
    }
  });

  return updated;
}

// ---------------------------------------------------------------------------
// View: By Location (primary) — Location > Product > Supplier rows
// ---------------------------------------------------------------------------

function ByLocationView() {
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState<AuthRow[]>(initialRows);

  const columns: GridColDef<AuthRow>[] = [
    {
      field: 'location',
      headerName: 'Location',
      width: 200,
      valueGetter: (_value: string, row: AuthRow) => `${row.locationId} ${row.location}`,
    },
    {
      field: 'productCode',
      headerName: 'Product',
      width: 160,
    },
    ...sharedColumns,
  ];

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['location', 'productCode'],
      },
    },
  });

  const handleRowOrderChange = useCallback(
    (params: GridRowOrderChangeParams) => setRows((prev) => reorderRows(prev, params)),
    [],
  );

  return (
    <DataGridPremium
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      initialState={initialState}
      defaultGroupingExpansionDepth={-1}
      rowReordering
      isRowReorderable={isRowReorderable}
      onRowOrderChange={handleRowOrderChange}
      groupingColDef={{
        headerName: 'Location / Product',
        width: 300,
        hideDescendantCount: false,
      }}
      getRowClassName={getRowClassName}
      density="compact"
      disableRowSelectionOnClick
      sx={gridSx}
    />
  );
}

// ---------------------------------------------------------------------------
// View: By Product — Product > Location > Supplier rows
// ---------------------------------------------------------------------------

function ByProductView() {
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState<AuthRow[]>(initialRows);

  const columns: GridColDef<AuthRow>[] = [
    {
      field: 'productCode',
      headerName: 'Product',
      width: 200,
      valueGetter: (_value: string, row: AuthRow) => `${row.productCode} ${row.productName}`,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 180,
      valueGetter: (_value: string, row: AuthRow) => `${row.locationId} ${row.location}`,
    },
    ...sharedColumns,
  ];

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['productCode', 'location'],
      },
    },
  });

  const handleRowOrderChange = useCallback(
    (params: GridRowOrderChangeParams) => setRows((prev) => reorderRows(prev, params)),
    [],
  );

  return (
    <DataGridPremium
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      initialState={initialState}
      defaultGroupingExpansionDepth={-1}
      rowReordering
      isRowReorderable={isRowReorderable}
      onRowOrderChange={handleRowOrderChange}
      groupingColDef={{
        headerName: 'Product / Location',
        width: 320,
        hideDescendantCount: false,
      }}
      getRowClassName={getRowClassName}
      density="compact"
      disableRowSelectionOnClick
      sx={gridSx}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

type ViewMode = 'byLocation' | 'byProduct';

export default function AuthSequencingGrid() {
  const [view, setView] = useState<ViewMode>('byLocation');

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Auth Sequencing — View Prototype
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag supplier rows to reorder the authorization sequence within each product group.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>View By:</Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_e, val) => val && setView(val)}
          size="small"
        >
          <ToggleButton value="byLocation">Location</ToggleButton>
          <ToggleButton value="byProduct">Product</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 700, width: '100%' }}>
        {view === 'byLocation' ? <ByLocationView /> : <ByProductView />}
      </Box>
    </Box>
  );
}
