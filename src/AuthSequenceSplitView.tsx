import { useState, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

interface LocProduct {
  key: string;
  locationId: number;
  location: string;
  productCode: string;
  productName: string;
  sequenceDepth: number;
  worstStatus: 'active' | 'expiring' | 'expired';
}

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

// ---------------------------------------------------------------------------
// Reference data — verbatim from AuthSequencingGrid.tsx
// ---------------------------------------------------------------------------

const PRODUCTS: Record<string, string> = {
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
// Derivation functions — verbatim from AuthSequencingGrid.tsx
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

const ALL_ROWS: AuthRow[] = assignSequenceNumbers(RAW_DATA);

// ---------------------------------------------------------------------------
// Derive the list of location x product combinations
// ---------------------------------------------------------------------------

function buildLocProductList(): LocProduct[] {
  const map = new Map<string, LocProduct>();
  for (const row of ALL_ROWS) {
    const key = `${row.locationId}|${row.productCode}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        locationId: row.locationId,
        location: row.location,
        productCode: row.productCode,
        productName: PRODUCTS[row.productCode] ?? row.productCode,
        sequenceDepth: 0,
        worstStatus: 'active',
      });
    }
    const entry = map.get(key)!;
    entry.sequenceDepth = Math.max(entry.sequenceDepth, row.sequence);
    // Track the worst status across all suppliers in this group
    if (row.status === 'expired') {
      entry.worstStatus = 'expired';
    } else if (row.status === 'expiring' && entry.worstStatus === 'active') {
      entry.worstStatus = 'expiring';
    }
  }
  // Sort by locationId, then productCode
  return Array.from(map.values()).sort((a, b) => {
    if (a.locationId !== b.locationId) return a.locationId - b.locationId;
    return a.productCode.localeCompare(b.productCode);
  });
}

const ALL_LOC_PRODUCTS: LocProduct[] = buildLocProductList();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CONFIG = {
  active:   { color: '#4caf50', label: 'Active',        icon: CheckCircleOutlineIcon, bg: '#e8f5e9', text: '#2e7d32' },
  expiring: { color: '#ff9800', label: 'Expiring Soon', icon: WarningAmberIcon,       bg: '#fff8e1', text: '#e65100' },
  expired:  { color: '#f44336', label: 'Expired',       icon: ErrorOutlineIcon,       bg: '#ffebee', text: '#c62828' },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Unlimited: { bg: '#e8f5e9', text: '#2e7d32' },
  Monthly:   { bg: '#e3f2fd', text: '#1565c0' },
  Weekly:    { bg: '#fff3e0', text: '#e65100' },
  Daily:     { bg: '#fce4ec', text: '#c62828' },
  Self:      { bg: '#f3e5f5', text: '#7b1fa2' },
};

// Sequence badge color: position 1 gets the health-derived color, rest are gray
function getBadgeColor(seq: number, status: AuthRow['status']): string {
  if (seq !== 1) return '#9e9e9e';
  return STATUS_CONFIG[status].color;
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
        fontSize: '0.72rem',
        height: 22,
        '& .MuiChip-label': { px: 1 },
      }}
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
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" sx={{ minWidth: 32, textAlign: 'right', color: 'text.secondary', fontSize: '0.7rem' }}>
          {Math.round(pct)}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

function HealthDot({ status, size = 8 }: { status: 'active' | 'expiring' | 'expired'; size?: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: STATUS_CONFIG[status].color,
        flexShrink: 0,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Left panel: list item
// ---------------------------------------------------------------------------

interface ListItemProps {
  item: LocProduct;
  isActive: boolean;
  onClick: () => void;
}

function LocProductListItem({ item, isActive, onClick }: ListItemProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2,
        py: 1.25,
        cursor: 'pointer',
        borderLeft: '3px solid',
        borderLeftColor: isActive ? 'primary.main' : 'transparent',
        bgcolor: isActive ? 'primary.50' : 'transparent',
        '&:hover': {
          bgcolor: isActive ? 'primary.50' : 'action.hover',
        },
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        transition: 'background-color 0.1s',
      }}
    >
      {/* Health dot */}
      <Box sx={{ mt: 0.5 }}>
        <HealthDot status={item.worstStatus} size={8} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 700 : 500,
            color: isActive ? 'primary.main' : 'text.primary',
            lineHeight: 1.3,
            fontSize: '0.82rem',
          }}
          noWrap
        >
          {item.locationId} {item.location}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3, mt: 0.25, fontSize: '0.73rem' }}
          noWrap
        >
          {item.productCode} — {item.productName}
        </Typography>
      </Box>

      {/* Sequence depth badge */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: 'grey.100',
          borderRadius: 1,
          px: 0.75,
          py: 0.25,
          mt: 0.25,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', fontWeight: 600 }}>
          {item.sequenceDepth}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Left panel: group header
// ---------------------------------------------------------------------------

function GroupHeader({ label }: { label: string }) {
  return (
    <Box
      sx={{
        px: 2,
        pt: 1.5,
        pb: 0.5,
        position: 'sticky',
        top: 0,
        bgcolor: 'grey.50',
        zIndex: 1,
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
      }}
    >
      <Typography
        variant="overline"
        sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.disabled', letterSpacing: '0.08em' }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Right panel: supplier card in the priority stack
// ---------------------------------------------------------------------------

interface SupplierCardProps {
  row: AuthRow;
  isLast: boolean;
}

function SupplierCard({ row, isLast }: SupplierCardProps) {
  const badgeColor = getBadgeColor(row.sequence, row.status);
  const statusConfig = STATUS_CONFIG[row.status];
  const StatusIcon = statusConfig.icon;
  const isExpired = row.status === 'expired';
  const isExpiring = row.status === 'expiring';
  const showDateWarning = isExpired || isExpiring;

  const displayEndDate =
    row.endDate === '12/31/2999'
      ? 'No Expiry'
      : row.endDate;

  return (
    <Box sx={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Left rail: badge + connector line */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, flexShrink: 0 }}>
        {/* Sequence number badge */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: row.sequence === 1 ? `0 0 0 3px ${badgeColor}22` : 'none',
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem', lineHeight: 1 }}
          >
            {row.sequence}
          </Typography>
        </Box>

        {/* Connector line below badge, if not last */}
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 16,
              bgcolor: 'grey.200',
              mt: 0.5,
            }}
          />
        )}
      </Box>

      {/* Card body */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          mb: isLast ? 0 : 1.5,
          p: 2,
          borderRadius: 2,
          borderColor: isExpired ? 'error.200' : isExpiring ? 'warning.300' : 'grey.200',
          bgcolor: isExpired
            ? 'rgba(244,67,54,0.03)'
            : isExpiring
            ? 'rgba(255,152,0,0.03)'
            : '#fff',
          opacity: isExpired ? 0.75 : 1,
        }}
      >
        {/* Row 1: supplier name + type chip */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '0.9rem' }}
              noWrap
            >
              {row.supplier}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
              ID {row.supplierId}
            </Typography>
          </Box>
          <TypeChip value={row.type} />
        </Box>

        {/* Row 2: volume bar (if applicable) */}
        {row.remainingVol != null && row.authVol != null && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
              Volume Remaining
            </Typography>
            <VolumeBar remaining={row.remainingVol} total={row.authVol} />
          </Box>
        )}

        {/* Row 3: end date + status */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {showDateWarning && (
              <StatusIcon
                sx={{
                  fontSize: 14,
                  color: isExpired ? 'error.main' : 'warning.main',
                }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isExpired ? 'error.main' : isExpiring ? 'warning.dark' : 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: showDateWarning ? 600 : 400,
              }}
            >
              {displayEndDate}
            </Typography>
          </Box>

          {/* Status pill */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: statusConfig.bg,
              borderRadius: 1,
              px: 1,
              py: 0.25,
            }}
          >
            <HealthDot status={row.status} size={6} />
            <Typography variant="caption" sx={{ color: statusConfig.text, fontWeight: 600, fontSize: '0.7rem' }}>
              {statusConfig.label}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Right panel: full priority stack for a selected LocProduct
// ---------------------------------------------------------------------------

interface PriorityStackProps {
  item: LocProduct;
  suppliers: AuthRow[];
}

function PriorityStack({ item, suppliers }: PriorityStackProps) {
  const statusConfig = STATUS_CONFIG[item.worstStatus];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Stack header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {item.productName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {item.locationId} — {item.location}
            </Typography>
          </Box>

          {/* Health badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: statusConfig.bg,
              borderRadius: 2,
              px: 1.5,
              py: 0.75,
              flexShrink: 0,
            }}
          >
            <HealthDot status={item.worstStatus} size={8} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: statusConfig.text, fontSize: '0.8rem' }}>
              {statusConfig.label}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
          {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} in sequence — tried in order shown
        </Typography>
      </Box>

      {/* Scrollable stack */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {suppliers.map((row, idx) => (
          <SupplierCard key={row.id} row={row} isLast={idx === suppliers.length - 1} />
        ))}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Right panel: empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.disabled',
        gap: 1,
        p: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.disabled' }}>
        Select a location + product
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center', maxWidth: 280 }}>
        Choose an item from the list on the left to see its full authorization sequence.
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type GroupBy = 'location' | 'product';

export default function AuthSequenceSplitView() {
  const [groupBy, setGroupBy] = useState<GroupBy>('location');
  const [search, setSearch] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(ALL_LOC_PRODUCTS[0]?.key ?? null);

  // Keyboard navigation
  const listRef = useRef<HTMLDivElement>(null);

  // Filter items based on search
  const filteredItems = ALL_LOC_PRODUCTS.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.location.toLowerCase().includes(q) ||
      String(item.locationId).includes(q) ||
      item.productCode.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q)
    );
  });

  // Group the filtered items
  const groups: Array<{ label: string; items: LocProduct[] }> = [];
  if (groupBy === 'location') {
    const byLoc = new Map<string, LocProduct[]>();
    for (const item of filteredItems) {
      const label = `${item.locationId} ${item.location}`;
      if (!byLoc.has(label)) byLoc.set(label, []);
      byLoc.get(label)!.push(item);
    }
    for (const [label, items] of byLoc) {
      groups.push({ label, items });
    }
  } else {
    const byProd = new Map<string, LocProduct[]>();
    for (const item of filteredItems) {
      const label = `${item.productCode} — ${item.productName}`;
      if (!byProd.has(label)) byProd.set(label, []);
      byProd.get(label)!.push(item);
    }
    for (const [label, items] of byProd) {
      groups.push({ label, items });
    }
  }

  // Flat ordered list for keyboard nav
  const flatItems = groups.flatMap((g) => g.items);

  const selectedItem = flatItems.find((i) => i.key === selectedKey) ?? null;
  const selectedSuppliers = selectedItem
    ? ALL_ROWS.filter(
        (r) =>
          r.locationId === selectedItem.locationId &&
          r.productCode === selectedItem.productCode,
      ).sort((a, b) => a.sequence - b.sequence)
    : [];

  // If selected key is filtered out, try to keep selection or clear it
  useEffect(() => {
    if (selectedKey && !flatItems.find((i) => i.key === selectedKey)) {
      setSelectedKey(flatItems[0]?.key ?? null);
    }
  }, [search, groupBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const currentIdx = flatItems.findIndex((i) => i.key === selectedKey);
      let nextIdx: number;
      if (e.key === 'ArrowDown') {
        nextIdx = currentIdx < flatItems.length - 1 ? currentIdx + 1 : currentIdx;
      } else {
        nextIdx = currentIdx > 0 ? currentIdx - 1 : 0;
      }
      const next = flatItems[nextIdx];
      if (next) setSelectedKey(next.key);
    },
    [flatItems, selectedKey],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          bgcolor: '#fff',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', flexShrink: 0 }}>
          Authorization Sequences
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ flexShrink: 0 }}>
          Concept C — Focus + Context Split View
        </Typography>
      </Box>

      {/* Body: left panel + right panel */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ----------------------------------------------------------------- */}
        {/* Left panel                                                         */}
        {/* ----------------------------------------------------------------- */}
        <Box
          ref={listRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: '1px solid',
            borderRightColor: 'divider',
            bgcolor: 'grey.50',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            outline: 'none',
          }}
        >
          {/* Left panel toolbar */}
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: 'grey.50',
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
            }}
          >
            <TextField
              size="small"
              placeholder="Search locations or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem', bgcolor: '#fff' },
                '& .MuiInputBase-input': { py: 0.75 },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem' }}>
                Group by:
              </Typography>
              <ToggleButtonGroup
                value={groupBy}
                exclusive
                onChange={(_e, val) => val && setGroupBy(val)}
                size="small"
                sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1, fontSize: '0.72rem' } }}
              >
                <ToggleButton value="location">Location</ToggleButton>
                <ToggleButton value="product">Product</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Scrollable list */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {filteredItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                  No results for "{search}"
                </Typography>
              </Box>
            ) : (
              groups.map((group) => (
                <Box key={group.label}>
                  <GroupHeader label={group.label} />
                  {group.items.map((item) => (
                    <LocProductListItem
                      key={item.key}
                      item={item}
                      isActive={item.key === selectedKey}
                      onClick={() => setSelectedKey(item.key)}
                    />
                  ))}
                </Box>
              ))
            )}
          </Box>

          {/* List footer: count */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderTop: '1px solid',
              borderTopColor: 'divider',
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem' }}>
              {filteredItems.length} of {ALL_LOC_PRODUCTS.length} sequences
            </Typography>
          </Box>
        </Box>

        {/* ----------------------------------------------------------------- */}
        {/* Right panel                                                        */}
        {/* ----------------------------------------------------------------- */}
        <Box sx={{ flex: 1, overflow: 'hidden', bgcolor: '#fff' }}>
          {selectedItem ? (
            <PriorityStack item={selectedItem} suppliers={selectedSuppliers} />
          ) : (
            <EmptyState />
          )}
        </Box>
      </Box>
    </Box>
  );
}
