import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthType = 'Self' | 'Weekly' | 'Monthly' | 'Daily' | 'Unlimited';
type IOStatus = 'active' | 'expiring' | 'expired';
type LocationStatus = 'green' | 'yellow' | 'red';

interface IO {
  id: number;
  supplier: string;
  type: AuthType;
  authVol: number | null;
  remainingVol: number | null;
  endDate: string;
}

interface ProductData {
  code: string;
  name: string;
  sequenced: IO[];
  unsequenced: IO[];
}

interface LocationData {
  id: number;
  name: string;
  products: ProductData[];
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const LOCATIONS: LocationData[] = [
  {
    id: 201, name: 'DES MOINES',
    products: [
      {
        code: 'A', name: '91 Octane',
        sequenced: [
          { id: 1, supplier: 'Lancer Energy Corp',    type: 'Self',      authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 2, supplier: 'Thornfield Petroleum',  type: 'Monthly',   authVol: 20000, remainingVol: 19000, endDate: '12/31/2999' },
          { id: 3, supplier: 'Foxridge Supply Group', type: 'Unlimited', authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 4, supplier: 'Baxter Energy Group',   type: 'Monthly',   authVol: 98000, remainingVol: 0,     endDate: '12/31/2999' },
        ],
        unsequenced: [
          { id: 5, supplier: 'Horizon Fuels',         type: 'Monthly',   authVol: 15000, remainingVol: 12000, endDate: '12/31/2999' },
        ],
      },
      {
        code: 'E', name: 'Ethanol',
        sequenced: [
          { id: 6,  supplier: 'Lancer Energy Corp',   type: 'Self',      authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 7,  supplier: 'Thornfield Petroleum', type: 'Unlimited', authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 8,  supplier: 'Baxter Energy Group',  type: 'Weekly',    authVol: 24000, remainingVol: 3000,  endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
      {
        code: 'V', name: '87 Octane w/ ETH',
        sequenced: [
          { id: 9,  supplier: 'Lancer Energy Corp',   type: 'Self',    authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 10, supplier: 'Thornfield Petroleum', type: 'Weekly',  authVol: 25000, remainingVol: 20000, endDate: '01/19/2026' },
        ],
        unsequenced: [],
      },
      {
        code: 'X', name: '#2 ULSD',
        sequenced: [
          { id: 11, supplier: 'Lancer Energy Corp',    type: 'Self',  authVol: null, remainingVol: null, endDate: '12/31/2999' },
          { id: 12, supplier: 'Foxridge Supply Group', type: 'Daily', authVol: 7000, remainingVol: 3000, endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
    ],
  },
  {
    id: 207, name: 'MASON CITY',
    products: [
      {
        code: 'A', name: '91 Octane',
        sequenced: [
          { id: 20, supplier: 'Lancer Energy Corp',   type: 'Self',    authVol: null,   remainingVol: null,  endDate: '12/31/2999' },
          { id: 21, supplier: 'Questmark Energy',     type: 'Monthly', authVol: 100000, remainingVol: 5000,  endDate: '12/31/2999' },
          { id: 22, supplier: 'Ardent Fuel Solutions',type: 'Monthly', authVol: 27000,  remainingVol: 15000, endDate: '10/28/2025' },
        ],
        unsequenced: [],
      },
      {
        code: 'E', name: 'Ethanol',
        sequenced: [
          { id: 23, supplier: 'Lancer Energy Corp', type: 'Self',      authVol: null, remainingVol: null, endDate: '12/31/2999' },
          { id: 24, supplier: 'Questmark Energy',   type: 'Unlimited', authVol: null, remainingVol: null, endDate: '12/31/2999' },
        ],
        unsequenced: [
          { id: 25, supplier: 'Baxter Energy Group', type: 'Weekly', authVol: 18000, remainingVol: 14000, endDate: '12/31/2999' },
        ],
      },
      {
        code: 'V', name: '87 Octane w/ ETH',
        sequenced: [
          { id: 26, supplier: 'Lancer Energy Corp',   type: 'Self',   authVol: null,  remainingVol: null, endDate: '12/31/2999' },
          { id: 27, supplier: 'Copperhead Energy',    type: 'Weekly', authVol: 20000, remainingVol: 2000, endDate: '07/13/2027' },
        ],
        unsequenced: [],
      },
      {
        code: 'AR', name: 'Prem RBOB 93 Oct',
        sequenced: [
          { id: 28, supplier: 'Lancer Energy Corp', type: 'Self', authVol: null, remainingVol: null, endDate: '04/18/2025' },
        ],
        unsequenced: [],
      },
    ],
  },
  {
    id: 347, name: 'BETTENDORF',
    products: [
      {
        code: 'A', name: '91 Octane',
        sequenced: [
          { id: 30, supplier: 'Lancer Energy Corp',   type: 'Self',      authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 31, supplier: 'Yarrow Energy Group',  type: 'Weekly',    authVol: 15000, remainingVol: 1000,  endDate: '12/31/2999' },
          { id: 32, supplier: 'Hillcrest Petroleum',  type: 'Unlimited', authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
      {
        code: 'V', name: '87 Octane w/ ETH',
        sequenced: [
          { id: 33, supplier: 'Lancer Energy Corp',  type: 'Self',    authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 34, supplier: 'Yarrow Energy Group', type: 'Monthly', authVol: 87000, remainingVol: 35000, endDate: '12/31/2999' },
          { id: 35, supplier: 'Hillcrest Petroleum', type: 'Monthly', authVol: 29000, remainingVol: 5000,  endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
      {
        code: 'E', name: 'Ethanol',
        sequenced: [
          { id: 36, supplier: 'Lancer Energy Corp',  type: 'Self',  authVol: null,  remainingVol: null, endDate: '12/31/2999' },
          { id: 37, supplier: 'Yarrow Energy Group', type: 'Daily', authVol: 10000, remainingVol: 5000, endDate: '12/31/2999' },
        ],
        unsequenced: [
          { id: 38, supplier: 'Meridian Fuel Co',    type: 'Monthly', authVol: 20000, remainingVol: 18000, endDate: '12/31/2999' },
        ],
      },
    ],
  },
  {
    id: 227, name: 'CARTHAGE',
    products: [
      {
        code: 'A', name: '91 Octane',
        sequenced: [
          { id: 40, supplier: 'Lancer Energy Corp',     type: 'Self',    authVol: null,  remainingVol: null,  endDate: '12/31/2999' },
          { id: 41, supplier: 'Wellspring Petroleum',   type: 'Monthly', authVol: 96000, remainingVol: 38000, endDate: '12/31/2999' },
          { id: 42, supplier: 'Dalton Supply Partners', type: 'Weekly',  authVol: 14000, remainingVol: 0,     endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
      {
        code: 'E', name: 'Ethanol',
        sequenced: [
          { id: 43, supplier: 'Lancer Energy Corp',   type: 'Self',  authVol: null, remainingVol: null, endDate: '12/31/2999' },
          { id: 44, supplier: 'Wellspring Petroleum', type: 'Daily', authVol: 9000, remainingVol: 7000, endDate: '05/23/2027' },
        ],
        unsequenced: [],
      },
      {
        code: 'V', name: '87 Octane w/ ETH',
        sequenced: [
          { id: 45, supplier: 'Lancer Energy Corp',   type: 'Self',      authVol: null, remainingVol: null, endDate: '12/02/2025' },
          { id: 46, supplier: 'Wellspring Petroleum', type: 'Unlimited', authVol: null, remainingVol: null, endDate: '12/31/2999' },
        ],
        unsequenced: [],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Status derivation
// ---------------------------------------------------------------------------

function ioStatus(io: IO): IOStatus {
  if (io.authVol !== null && io.remainingVol !== null) {
    if (io.remainingVol === 0) return 'expired';
    if (io.remainingVol / io.authVol < 0.2) return 'expiring';
  }
  // Check end date proximity (within 90 days)
  const end = new Date(io.endDate);
  const now = new Date();
  const daysLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysLeft < 0) return 'expired';
  if (daysLeft < 90) return 'expiring';
  return 'active';
}

function productStatus(product: ProductData): IOStatus {
  const statuses = product.sequenced.map(ioStatus);
  if (statuses.includes('expired')) return 'expired';
  if (statuses.includes('expiring')) return 'expiring';
  return 'active';
}

function locationStatus(loc: LocationData): LocationStatus {
  const statuses = loc.products.map(productStatus);
  if (statuses.includes('expired')) return 'red';
  if (statuses.includes('expiring')) return 'yellow';
  return 'green';
}

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const AUTH_TYPE_COLORS: Record<AuthType, string> = {
  Self:      '#1565c0',
  Weekly:    '#6a1b9a',
  Monthly:   '#00695c',
  Daily:     '#e65100',
  Unlimited: '#2e7d32',
};

const STATUS_BG: Record<IOStatus, string> = {
  active:   '#e8f5e9',
  expiring: '#fff8e1',
  expired:  '#ffebee',
};

const STATUS_COLOR: Record<IOStatus, string> = {
  active:   '#2e7d32',
  expiring: '#f57f17',
  expired:  '#c62828',
};

const LOCATION_BORDER: Record<LocationStatus, string> = {
  green:  '#43a047',
  yellow: '#f9a825',
  red:    '#e53935',
};


function formatVol(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
}

// ---------------------------------------------------------------------------
// Location Card
// ---------------------------------------------------------------------------

interface LocationCardProps {
  location: LocationData;
  selected: boolean;
  onClick: () => void;
}

function LocationCard({ location, selected, onClick }: LocationCardProps) {
  const status = locationStatus(location);
  const attentionCount = location.products.filter(
    (p) => productStatus(p) !== 'active'
  ).length;

  return (
    <Box
      onClick={onClick}
      sx={{
        border: 2,
        borderColor: selected ? 'primary.main' : LOCATION_BORDER[status],
        borderRadius: 2,
        p: 2,
        cursor: 'pointer',
        bgcolor: selected ? 'primary.50' : 'background.paper',
        boxShadow: selected ? 3 : 1,
        transition: 'all 0.15s ease',
        minWidth: 200,
        '&:hover': { boxShadow: 3, borderColor: selected ? 'primary.main' : 'text.secondary' },
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', letterSpacing: 0.5 }}>
            #{location.id}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {location.name}
          </Typography>
        </Box>
        {status === 'green' && (
          <Tooltip title="All clear">
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#43a047', mt: 0.25 }} />
          </Tooltip>
        )}
        {status === 'yellow' && (
          <Tooltip title={`${attentionCount} product${attentionCount !== 1 ? 's' : ''} need attention`}>
            <WarningAmberIcon sx={{ fontSize: 18, color: '#f9a825', mt: 0.25 }} />
          </Tooltip>
        )}
        {status === 'red' && (
          <Tooltip title={`${attentionCount} product${attentionCount !== 1 ? 's' : ''} — action required`}>
            <ErrorOutlineIcon sx={{ fontSize: 18, color: '#e53935', mt: 0.25 }} />
          </Tooltip>
        )}
      </Box>

      {/* Product chips */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {location.products.map((p) => {
          const ps = productStatus(p);
          return (
            <Box
              key={p.code}
              sx={{
                px: 0.75,
                py: 0.25,
                borderRadius: 0.75,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: STATUS_BG[ps],
                color: STATUS_COLOR[ps],
                border: '1px solid',
                borderColor: STATUS_COLOR[ps] + '40',
              }}
            >
              {p.code}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Sequence Table (detail panel)
// ---------------------------------------------------------------------------

interface SequenceTableProps {
  location: LocationData;
  products: ProductData[];
  onProductsChange: (updated: ProductData[]) => void;
}

function SequenceTable({ location, products, onProductsChange }: SequenceTableProps) {
  const [activeProduct, setActiveProduct] = useState(0);
  const dragIndex = useRef<number | null>(null);

  const product = products[activeProduct];

  function updateProduct(updated: ProductData) {
    const next = [...products];
    next[activeProduct] = updated;
    onProductsChange(next);
  }

  // Drag handlers
  function onDragStart(index: number) {
    dragIndex.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...product.sequenced];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    updateProduct({ ...product, sequenced: next });
  }

  function onDragEnd() {
    dragIndex.current = null;
  }

  function removeIO(id: number) {
    const io = product.sequenced.find((s) => s.id === id)!;
    updateProduct({
      ...product,
      sequenced: product.sequenced.filter((s) => s.id !== id),
      unsequenced: [...product.unsequenced, io],
    });
  }

  function addIO(id: number) {
    const io = product.unsequenced.find((s) => s.id === id)!;
    updateProduct({
      ...product,
      sequenced: [...product.sequenced, io],
      unsequenced: product.unsequenced.filter((s) => s.id !== id),
    });
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {location.name}
        </Typography>

        {/* Product tabs */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {products.map((p, i) => {
            const ps = productStatus(p);
            return (
              <Box
                key={p.code}
                onClick={() => setActiveProduct(i)}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  fontWeight: i === activeProduct ? 700 : 400,
                  fontSize: '0.78rem',
                  bgcolor: i === activeProduct ? 'primary.main' : 'transparent',
                  color: i === activeProduct ? 'primary.contrastText' : STATUS_COLOR[ps],
                  border: '1px solid',
                  borderColor: i === activeProduct ? 'primary.main' : STATUS_COLOR[ps] + '60',
                  '&:hover': { bgcolor: i === activeProduct ? 'primary.dark' : 'action.hover' },
                }}
              >
                {p.code}
                {ps !== 'active' && i !== activeProduct && (
                  <Box component="span" sx={{ ml: 0.5, fontSize: '0.6rem' }}>
                    {ps === 'expired' ? '●' : '◐'}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Table header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '28px 28px 1fr 90px 140px 80px 28px',
          alignItems: 'center',
          px: 2,
          py: 0.75,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Box />
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>#</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Supplier</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Type</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Volume</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Status</Typography>
        <Box />
      </Box>

      {/* Sequenced rows */}
      {product.sequenced.length === 0 && (
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="body2" color="text.disabled" fontStyle="italic">
            No suppliers sequenced for {product.code}.
          </Typography>
        </Box>
      )}

      {product.sequenced.map((io, i) => {
        const st = ioStatus(io);
        return (
          <Box
            key={io.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            sx={{
              display: 'grid',
              gridTemplateColumns: '28px 28px 1fr 90px 140px 80px 28px',
              alignItems: 'center',
              px: 2,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: st === 'expired' ? '#fff5f5' : st === 'expiring' ? '#fffde7' : 'transparent',
              cursor: 'grab',
              '&:hover': { bgcolor: st === 'expired' ? '#ffebee' : st === 'expiring' ? '#fff8e1' : 'action.hover' },
              '&:last-of-type': { borderBottom: 0 },
            }}
          >
            {/* Drag handle */}
            <DragIndicatorIcon sx={{ fontSize: 18, color: 'text.disabled' }} />

            {/* Rank */}
            <Typography
              variant="body2"
              sx={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'text.primary' : 'text.secondary' }}
            >
              {i + 1}
            </Typography>

            {/* Supplier */}
            <Typography
              variant="body2"
              sx={{ fontWeight: i === 0 ? 600 : 400, pr: 1 }}
              noWrap
            >
              {io.supplier}
            </Typography>

            {/* Auth type chip */}
            <Box>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 0.75,
                  py: 0.2,
                  borderRadius: 0.75,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#fff',
                  bgcolor: AUTH_TYPE_COLORS[io.type],
                }}
              >
                {io.type}
              </Box>
            </Box>

            {/* Volume bar */}
            <Box sx={{ pr: 1 }}>
              {io.authVol !== null && io.remainingVol !== null ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem' }}>
                      {formatVol(io.remainingVol)} / {formatVol(io.authVol)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(io.remainingVol / io.authVol) * 100}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: STATUS_COLOR[st],
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                  {io.type === 'Unlimited' ? '∞ unlimited' : '—'}
                </Typography>
              )}
            </Box>

            {/* Status */}
            <Box>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 0.75,
                  py: 0.2,
                  borderRadius: 0.75,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  bgcolor: STATUS_BG[st],
                  color: STATUS_COLOR[st],
                }}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </Box>
            </Box>

            {/* Remove */}
            <Tooltip title="Remove from sequence">
              <IconButton size="small" onClick={() => removeIO(io.id)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 14, color: 'text.disabled', '&:hover': { color: 'error.main' } }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}

      {/* Unsequenced section */}
      {product.unsequenced.length > 0 && (
        <>
          <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: 0.5 }}>
              NOT SEQUENCED
            </Typography>
          </Box>
          {product.unsequenced.map((io) => (
            <Box
              key={io.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '28px 28px 1fr 90px 140px 80px 28px',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'grey.50',
                opacity: 0.75,
              }}
            >
              <Box />
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>—</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{io.supplier}</Typography>
              <Box>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 0.75,
                    py: 0.2,
                    borderRadius: 0.75,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#fff',
                    bgcolor: AUTH_TYPE_COLORS[io.type],
                    opacity: 0.7,
                  }}
                >
                  {io.type}
                </Box>
              </Box>
              <Box>
                {io.authVol !== null && io.remainingVol !== null ? (
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                    {formatVol(io.remainingVol)} / {formatVol(io.authVol)}
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>—</Typography>
                )}
              </Box>
              <Box />
              <Tooltip title="Add to sequence">
                <IconButton size="small" onClick={() => addIO(io.id)} sx={{ p: 0.25 }}>
                  <AddIcon sx={{ fontSize: 14, color: 'success.main' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AuthSequencingHybrid() {
  const [selected, setSelected] = useState<number | null>(null);

  // Local mutable state for all location data (so edits persist within session)
  const [locations, setLocations] = useState<LocationData[]>(LOCATIONS);

  function updateLocationProducts(locId: number, products: ProductData[]) {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === locId ? { ...loc, products } : loc))
    );
  }

  const selectedLocation = selected !== null ? locations.find((l) => l.id === selected) : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Auth Sequencing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a location to view and manage its sequence.
        </Typography>
      </Box>

      {/* Card grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2,
          mb: selectedLocation ? 3 : 0,
        }}
      >
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            selected={selected === loc.id}
            onClick={() => setSelected(selected === loc.id ? null : loc.id)}
          />
        ))}
      </Box>

      {/* Detail panel */}
      {selectedLocation && (
        <SequenceTable
          location={selectedLocation}
          products={selectedLocation.products}
          onProductsChange={(updated) => updateLocationProducts(selectedLocation.id, updated)}
        />
      )}
    </Box>
  );
}
