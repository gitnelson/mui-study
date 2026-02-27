import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';

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

type AuthType = AuthRow['type'];
type HealthStatus = 'critical' | 'expiring' | 'healthy';
type HealthFilter = 'all' | 'critical' | 'expiring' | 'healthy';

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

// ---------------------------------------------------------------------------
// Product code maps
// ---------------------------------------------------------------------------

// Full names used internally for row enrichment (matches AuthSequencingGrid)
const PRODUCTS_FULL: Record<string, string> = {
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

// Short display names for the lane product filter dropdown
const PRODUCTS_SHORT: Record<string, string> = {
  A: '91 OCT w/o ETH',
  E: 'ETHANOL',
  V: '87 OCT w/ ETH',
  X: '#2 ULSD 15PPM',
  A78: '91 OCT low RVP',
  AR: 'PREM RBOB 93 OCT',
  A5: '88.5 OCT w/o ETH',
  V78: '87 OCT low RVP',
  B99: '99% BIO',
};

function getProductShortName(code: string): string {
  return PRODUCTS_SHORT[code] ?? PRODUCTS_FULL[code] ?? code;
}

// ---------------------------------------------------------------------------
// Raw data — verbatim from AuthSequencingGrid.tsx (53 rows)
// ---------------------------------------------------------------------------

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
// Status derivation — verbatim from AuthSequencingGrid.tsx
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
      productName: PRODUCTS_FULL[r.productCode] ?? r.productCode,
      status: deriveStatus(r.endDate, r.active),
      sequence: seq,
    };
  });
}

const ALL_ROWS: AuthRow[] = assignSequenceNumbers(RAW_DATA);

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Unlimited: { bg: '#e8f5e9', text: '#2e7d32' },
  Monthly:   { bg: '#e3f2fd', text: '#1565c0' },
  Weekly:    { bg: '#fff3e0', text: '#e65100' },
  Daily:     { bg: '#fce4ec', text: '#c62828' },
  Self:      { bg: '#f3e5f5', text: '#7b1fa2' },
};

const STATUS_COLORS: Record<AuthRow['status'], { dot: string; rowBg: string; rowBorder: string }> = {
  active:   { dot: '#4caf50', rowBg: '#ffffff',              rowBorder: '#e0e0e0' },
  expiring: { dot: '#ff9800', rowBg: '#fff8f0',              rowBorder: '#ffcc80' },
  expired:  { dot: '#f44336', rowBg: '#fff5f5',              rowBorder: '#ffcdd2' },
};

// Lane header color based on worst health in lane
const LANE_HEADER_COLORS: Record<HealthStatus, { bg: string; text: string; border: string }> = {
  critical: { bg: '#ffebee', text: '#b71c1c', border: '#ef9a9a' },
  expiring: { bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  healthy:  { bg: '#e8f5e9', text: '#1b5e20', border: '#a5d6a7' },
};

// ---------------------------------------------------------------------------
// Health logic
// ---------------------------------------------------------------------------

function laneHealth(rows: AuthRow[]): HealthStatus {
  if (rows.some((r) => r.status === 'expired')) return 'critical';
  if (rows.some((r) => r.status === 'expiring')) return 'expiring';
  return 'healthy';
}

interface HealthCounts {
  critical: number;
  expiring: number;
  healthy: number;
}

function countHealth(rows: AuthRow[]): HealthCounts {
  return {
    critical: rows.filter((r) => r.status === 'expired').length,
    expiring: rows.filter((r) => r.status === 'expiring').length,
    healthy:  rows.filter((r) => r.status === 'active').length,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypeChip({ value }: { value: string }) {
  const color = TYPE_COLORS[value] ?? { bg: '#f5f5f5', text: '#616161' };
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        bgcolor: color.bg,
        color: color.text,
        fontWeight: 600,
        fontSize: '0.68rem',
        height: 20,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  );
}

function StatusDot({ status }: { status: AuthRow['status'] }) {
  const color = STATUS_COLORS[status].dot;
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: color,
        flexShrink: 0,
      }}
    />
  );
}

function VolumeBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;
  const color = pct <= 10 ? 'error' : pct <= 25 ? 'warning' : 'primary';
  return (
    <Tooltip title={`${remaining.toLocaleString()} / ${total.toLocaleString()} gal (${pct}%)`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={color}
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" sx={{ minWidth: 28, textAlign: 'right', color: 'text.secondary', fontSize: '0.68rem' }}>
          {pct}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

function HealthSummaryPill({ counts }: { counts: HealthCounts }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {counts.critical > 0 && (
        <Chip
          icon={<ErrorOutlineIcon sx={{ fontSize: '0.85rem !important' }} />}
          label={`${counts.critical} expired`}
          size="small"
          sx={{
            bgcolor: '#ffcdd2',
            color: '#b71c1c',
            fontWeight: 600,
            fontSize: '0.68rem',
            height: 20,
            '& .MuiChip-label': { px: 0.5 },
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />
      )}
      {counts.expiring > 0 && (
        <Chip
          icon={<WarningAmberIcon sx={{ fontSize: '0.85rem !important' }} />}
          label={`${counts.expiring} expiring`}
          size="small"
          sx={{
            bgcolor: '#ffe0b2',
            color: '#e65100',
            fontWeight: 600,
            fontSize: '0.68rem',
            height: 20,
            '& .MuiChip-label': { px: 0.5 },
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />
      )}
      {counts.healthy > 0 && (
        <Chip
          icon={<CheckCircleOutlineIcon sx={{ fontSize: '0.85rem !important' }} />}
          label={`${counts.healthy} ok`}
          size="small"
          sx={{
            bgcolor: '#c8e6c9',
            color: '#1b5e20',
            fontWeight: 600,
            fontSize: '0.68rem',
            height: 20,
            '& .MuiChip-label': { px: 0.5 },
            '& .MuiChip-icon': { ml: 0.5 },
          }}
        />
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Slot card
// ---------------------------------------------------------------------------

interface SlotCardProps {
  row: AuthRow;
  maxDepth: number;
}

function SlotCard({ row }: SlotCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_COLORS[row.status];
  const hasVolume = row.authVol != null && row.remainingVol != null;
  const endDisplay = row.endDate === '12/31/2999' ? 'No Expiry' : row.endDate;

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: sc.rowBg,
        borderColor: sc.rowBorder,
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: 2 },
      }}
      onClick={() => setExpanded((p) => !p)}
    >
      {/* Compact header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.75 }}>
        {/* Sequence badge */}
        <Box
          sx={{
            minWidth: 22,
            height: 22,
            borderRadius: '50%',
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary', lineHeight: 1 }}>
            {row.sequence}
          </Typography>
        </Box>

        {/* Status dot */}
        <StatusDot status={row.status} />

        {/* Supplier name */}
        <Typography
          variant="body2"
          noWrap
          sx={{
            flex: 1,
            fontSize: '0.78rem',
            fontWeight: row.sequence === 1 ? 700 : 400,
            minWidth: 0,
          }}
        >
          {row.supplier}
        </Typography>

        {/* Expand toggle */}
        <Box sx={{ color: 'text.disabled', flexShrink: 0, display: 'flex' }}>
          {expanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
        </Box>
      </Box>

      {/* Type chip row */}
      <Box sx={{ px: 1, pb: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TypeChip value={row.type} />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', ml: 'auto' }}>
          {endDisplay}
        </Typography>
      </Box>

      {/* Expanded detail */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 1, py: 0.75 }}>
          {hasVolume ? (
            <>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block', mb: 0.25 }}>
                Volume remaining
              </Typography>
              <VolumeBar remaining={row.remainingVol!} total={row.authVol!} />
            </>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              {row.type === 'Unlimited' ? 'Unlimited volume' : row.type === 'Self' ? `Renewal: ${row.renewalVol?.toLocaleString() ?? '—'} gal` : 'No volume data'}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              ID: {row.supplierId}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              End: {endDisplay}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

// Ghost placeholder for empty slots
function GhostSlot({ slotNum }: { slotNum: number }) {
  return (
    <Box
      sx={{
        border: '1.5px dashed',
        borderColor: 'grey.300',
        borderRadius: 1,
        px: 1,
        py: 0.75,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        opacity: 0.45,
      }}
    >
      <Box
        sx={{
          minWidth: 22,
          height: 22,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.disabled', lineHeight: 1 }}>
          {slotNum}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.72rem' }}>
        Empty slot
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Lane component
// ---------------------------------------------------------------------------

interface LaneData {
  locationId: number;
  location: string;
  products: string[]; // product codes available at this location
  rowsByProduct: Map<string, AuthRow[]>; // productCode -> rows sorted by sequence
}

interface LaneProps {
  lane: LaneData;
  maxDepth: number;
  highlighted: boolean;
}

function Lane({ lane, maxDepth, highlighted }: LaneProps) {
  // Default to product with most sequences; fallback to first alphabetically
  const defaultProduct = useMemo(() => {
    let best = lane.products[0];
    let bestCount = 0;
    for (const code of lane.products) {
      const count = lane.rowsByProduct.get(code)?.length ?? 0;
      if (count > bestCount) {
        bestCount = count;
        best = code;
      }
    }
    return best;
  }, [lane]);

  const [selectedProduct, setSelectedProduct] = useState<string>(defaultProduct);

  const rows = lane.rowsByProduct.get(selectedProduct) ?? [];
  const health = laneHealth(rows);
  const counts = countHealth(rows);
  const headerColors = LANE_HEADER_COLORS[health];

  return (
    <Box
      sx={{
        minWidth: 240,
        maxWidth: 280,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: highlighted ? headerColors.border : 'divider',
        overflow: 'hidden',
        boxShadow: highlighted ? 3 : 1,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      {/* Lane header */}
      <Box
        sx={{
          bgcolor: highlighted ? headerColors.bg : 'grey.100',
          borderBottom: '1px solid',
          borderColor: highlighted ? headerColors.border : 'divider',
          px: 1.5,
          pt: 1,
          pb: 0.75,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.8rem',
            color: highlighted ? headerColors.text : 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {lane.locationId} {lane.location}
        </Typography>

        <Box sx={{ mt: 0.5 }}>
          <HealthSummaryPill counts={counts} />
        </Box>
      </Box>

      {/* Product filter */}
      <Box sx={{ px: 1, pt: 0.75, pb: 0.5, bgcolor: 'background.paper' }}>
        <FormControl size="small" fullWidth>
          <InputLabel sx={{ fontSize: '0.72rem' }}>Product</InputLabel>
          <Select
            value={selectedProduct}
            label="Product"
            onChange={(e) => setSelectedProduct(e.target.value)}
            sx={{
              fontSize: '0.75rem',
              '& .MuiSelect-select': { py: 0.5, fontSize: '0.75rem' },
            }}
          >
            {lane.products.map((code) => (
              <MenuItem key={code} value={code} sx={{ fontSize: '0.78rem' }}>
                {getProductShortName(code)}
                <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.68rem', ml: 0.5 }}>
                  ({lane.rowsByProduct.get(code)?.length ?? 0})
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      {/* Sequence slots */}
      <Box sx={{ px: 1, py: 0.75, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        {/* Render actual rows */}
        {rows.map((row) => (
          <SlotCard key={row.id} row={row} maxDepth={maxDepth} />
        ))}
        {/* Ghost slots up to maxDepth */}
        {Array.from({ length: Math.max(0, maxDepth - rows.length) }).map((_, i) => (
          <GhostSlot key={`ghost-${i}`} slotNum={rows.length + i + 1} />
        ))}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

interface FilterBarProps {
  value: HealthFilter;
  onChange: (v: HealthFilter) => void;
  counts: { all: number; critical: number; expiring: number; healthy: number };
}

function FilterBar({ value, onChange, counts }: FilterBarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
        <FilterListIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
          Show lanes:
        </Typography>
      </Box>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_e, v) => v && onChange(v)}
        size="small"
      >
        <ToggleButton value="all" sx={{ fontSize: '0.75rem', py: 0.25, px: 1.25 }}>
          All ({counts.all})
        </ToggleButton>
        <ToggleButton
          value="critical"
          sx={{
            fontSize: '0.75rem',
            py: 0.25,
            px: 1.25,
            color: '#b71c1c',
            '&.Mui-selected': { bgcolor: '#ffcdd2', color: '#b71c1c' },
          }}
        >
          Expired ({counts.critical})
        </ToggleButton>
        <ToggleButton
          value="expiring"
          sx={{
            fontSize: '0.75rem',
            py: 0.25,
            px: 1.25,
            color: '#e65100',
            '&.Mui-selected': { bgcolor: '#ffe0b2', color: '#e65100' },
          }}
        >
          Expiring ({counts.expiring})
        </ToggleButton>
        <ToggleButton
          value="healthy"
          sx={{
            fontSize: '0.75rem',
            py: 0.25,
            px: 1.25,
            color: '#1b5e20',
            '&.Mui-selected': { bgcolor: '#c8e6c9', color: '#1b5e20' },
          }}
        >
          Healthy ({counts.healthy})
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Data derivation
// ---------------------------------------------------------------------------

function buildLanes(): LaneData[] {
  // Group rows by location
  const byLocation = new Map<number, AuthRow[]>();
  for (const row of ALL_ROWS) {
    const existing = byLocation.get(row.locationId) ?? [];
    existing.push(row);
    byLocation.set(row.locationId, existing);
  }

  const lanes: LaneData[] = [];
  for (const [locationId, rows] of byLocation.entries()) {
    // Collect unique product codes in the order they first appear
    const productSet = new Set<string>();
    for (const r of rows) productSet.add(r.productCode);
    const products = [...productSet].sort();

    const rowsByProduct = new Map<string, AuthRow[]>();
    for (const code of products) {
      rowsByProduct.set(
        code,
        rows.filter((r) => r.productCode === code).sort((a, b) => a.sequence - b.sequence),
      );
    }

    lanes.push({
      locationId,
      location: rows[0].location,
      products,
      rowsByProduct,
    });
  }

  // Sort lanes by locationId
  lanes.sort((a, b) => a.locationId - b.locationId);
  return lanes;
}

const LANES: LaneData[] = buildLanes();

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AuthSequenceLanes() {
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');

  // Compute per-lane health for filtering and highlighting
  const laneHealthMap = useMemo(() => {
    const map = new Map<number, HealthStatus>();
    for (const lane of LANES) {
      // Aggregate all rows across all products in the lane
      const allLaneRows: AuthRow[] = [];
      for (const rows of lane.rowsByProduct.values()) {
        allLaneRows.push(...rows);
      }
      map.set(lane.locationId, laneHealth(allLaneRows));
    }
    return map;
  }, []);

  // Filter counts for the filter bar
  const filterCounts = useMemo(() => {
    const counts = { all: LANES.length, critical: 0, expiring: 0, healthy: 0 };
    for (const [, h] of laneHealthMap.entries()) {
      if (h === 'critical') counts.critical++;
      else if (h === 'expiring') counts.expiring++;
      else counts.healthy++;
    }
    return counts;
  }, [laneHealthMap]);

  // Max sequence depth across all lanes and products (for ghost slots)
  const maxDepth = useMemo(() => {
    let max = 0;
    for (const lane of LANES) {
      for (const rows of lane.rowsByProduct.values()) {
        if (rows.length > max) max = rows.length;
      }
    }
    return max;
  }, []);

  // Visible lanes after filter
  const visibleLanes = useMemo(() => {
    if (healthFilter === 'all') return LANES;
    return LANES.filter((lane) => {
      const h = laneHealthMap.get(lane.locationId);
      if (healthFilter === 'critical') return h === 'critical';
      if (healthFilter === 'expiring') return h === 'expiring';
      if (healthFilter === 'healthy') return h === 'healthy';
      return true;
    });
  }, [healthFilter, laneHealthMap]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Page header */}
      <Typography variant="h4" gutterBottom>
        Auth Sequencing — Concept B: Sequence Lanes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        One lane per terminal. Select a product to view that product's authorization sequence. Click any slot card to expand volume and expiry details.
      </Typography>

      {/* Filter bar */}
      <Box sx={{ mb: 2.5 }}>
        <FilterBar value={healthFilter} onChange={setHealthFilter} counts={filterCounts} />
      </Box>

      {/* Lane count indicator */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Showing {visibleLanes.length} of {LANES.length} locations
      </Typography>

      {/* Lanes scroll container */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          alignItems: 'flex-start',
          // Smooth scrollbar on webkit
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'grey.100' },
        }}
      >
        {visibleLanes.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              py: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">No lanes match the current filter.</Typography>
          </Box>
        ) : (
          visibleLanes.map((lane) => {
            const h = laneHealthMap.get(lane.locationId) ?? 'healthy';
            const highlighted =
              healthFilter !== 'all' ||
              h === 'critical' ||
              h === 'expiring';
            return (
              <Lane
                key={lane.locationId}
                lane={lane}
                maxDepth={maxDepth}
                highlighted={highlighted}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
}
