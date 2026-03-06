import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

// ---------------------------------------------------------------------------
// Types (shared with AuthSequencingGrid)
// ---------------------------------------------------------------------------

interface AuthEntry {
  supplier: string;
  supplierId: number;
  type: 'Weekly' | 'Monthly' | 'Daily' | 'Unlimited' | 'Self';
  authVol: number | null;
  remainingVol: number | null;
  renewalVol: number | null;
  endDate: string;
  active: boolean;
  status: 'active' | 'expiring' | 'expired';
  sequence: number;
}

interface CellData {
  locationId: number;
  location: string;
  productCode: string;
  productName: string;
  entries: AuthEntry[];
  health: 'healthy' | 'warning' | 'critical' | 'empty';
}

// ---------------------------------------------------------------------------
// Product name map
// ---------------------------------------------------------------------------

const PRODUCTS: Record<string, string> = {
  A: '91 OCT w/o ETH',
  A78: '91 OCT low RVP',
  AR: 'PREM RBOB 93 OCT',
  A5: '88.5 OCT w/o ETH',
  AMS: '88.5 OCT low RVP',
  V: '87 OCT w/ ETH',
  V78: '87 OCT low RVP',
  V2: '87 OCT w/ ETH v2',
  V3: '86 OCT w/ ETH',
  V3S: '86 OCT low RVP',
  NEP: '87 OCT export only',
  NR: 'RBOB 87 OCT',
  E: 'ETHANOL',
  L: 'PROPANE',
  T: 'TRANSMIX',
  Q: 'COMMERCIAL JET',
  QSF: 'JET A SYNTH',
  X: '#2 ULSD 15PPM',
  XHO: '#2 ULSD NTDF',
  Y: '#1 ULSD 15PPM',
  YM: '#1 ULSD ROCKY MTN',
  D: '#2 ULSD PREMIUM',
  ZB: '99% METHYL ESTER',
  B99: '99% BIO',
  JP5: 'MILITARY JET',
};

// ---------------------------------------------------------------------------
// Raw data (same source as AuthSequencingGrid)
// ---------------------------------------------------------------------------

type AuthType = AuthEntry['type'];

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
  // ── DES MOINES (201) ─────────────────────────────────────────────────────
  // Product A — 10 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 100000, endDate: '05/31/2026', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly',   authVol: 20000,  remainingVol: 19000, renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly',   authVol: 98000,  remainingVol: 0,     renewalVol: 98000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly',   authVol: 45000,  remainingVol: 30000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Weekly',    authVol: 12000,  remainingVol: 8000,  renewalVol: 12000,  endDate: '09/15/2027', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Daily',     authVol: 5000,   remainingVol: 3500,  renewalVol: 5000,   endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Monthly',   authVol: 60000,  remainingVol: 2000,  renewalVol: 60000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Weekly',    authVol: 18000,  remainingVol: 15000, renewalVol: 18000,  endDate: '03/25/2026', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'DES MOINES', locationId: 201, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // Product E — 8 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 67000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Weekly',    authVol: 24000,  remainingVol: 15000, renewalVol: 24000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Monthly',   authVol: 55000,  remainingVol: 40000, renewalVol: 55000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Monthly',   authVol: 30000,  remainingVol: 5000,  renewalVol: 30000,  endDate: '12/31/2999', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Weekly',    authVol: 8000,   remainingVol: 1000,  renewalVol: 8000,   endDate: '04/12/2026', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Daily',     authVol: 3000,   remainingVol: 3000,  renewalVol: 3000,   endDate: '12/31/2999', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'DES MOINES', locationId: 201, productCode: 'E', type: 'Monthly',   authVol: 22000,  remainingVol: 18000, renewalVol: 22000,  endDate: '12/31/2999', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 24000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Weekly',    authVol: 25000,  remainingVol: 20000, renewalVol: 25000,  endDate: '01/19/2026', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Monthly',   authVol: 40000,  remainingVol: 28000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Weekly',    authVol: 15000,  remainingVol: 12000, renewalVol: 15000,  endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Monthly',   authVol: 75000,  remainingVol: 50000, renewalVol: 75000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Daily',     authVol: 6000,   remainingVol: 4000,  renewalVol: 6000,   endDate: '07/20/2027', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'DES MOINES', locationId: 201, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // Product X — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 57000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Daily',     authVol: 7000,   remainingVol: 3000,  renewalVol: 7000,   endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Monthly',   authVol: 50000,  remainingVol: 35000, renewalVol: 50000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Weekly',    authVol: 10000,  remainingVol: 500,   renewalVol: 10000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Daily',     authVol: 4000,   remainingVol: 2500,  renewalVol: 4000,   endDate: '05/30/2026', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'DES MOINES', locationId: 201, productCode: 'X', type: 'Monthly',   authVol: 35000,  remainingVol: 28000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  // Product A78 — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Self',      authVol: null,  remainingVol: null,  renewalVol: 72000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Monthly',   authVol: 40000, remainingVol: 32000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Weekly',    authVol: 14000, remainingVol: 10000, renewalVol: 14000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Monthly',   authVol: 65000, remainingVol: 55000, renewalVol: 65000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Daily',     authVol: 6000,  remainingVol: 4000,  renewalVol: 6000,   endDate: '10/15/2027', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'DES MOINES', locationId: 201, productCode: 'A78', type: 'Unlimited', authVol: null,  remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // ── MASON CITY (207) ─────────────────────────────────────────────────────
  // Product A — 9 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 38000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly',   authVol: 100000, remainingVol: 5000,  renewalVol: 100000, endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly',   authVol: 27000,  remainingVol: 15000, renewalVol: 27000,  endDate: '10/28/2025', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Weekly',    authVol: 22000,  remainingVol: 18000, renewalVol: 22000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly',   authVol: 55000,  remainingVol: 42000, renewalVol: 55000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Monthly',   authVol: 80000,  remainingVol: 60000, renewalVol: 80000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Daily',     authVol: 5000,   remainingVol: 1000,  renewalVol: 5000,   endDate: '04/05/2026', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'MASON CITY', locationId: 207, productCode: 'A', type: 'Weekly',    authVol: 16000,  remainingVol: 12000, renewalVol: 16000,  endDate: '12/31/2999', active: true },
  // Product E — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 85000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Weekly',    authVol: 18000,  remainingVol: 14000, renewalVol: 18000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Monthly',   authVol: 40000,  remainingVol: 30000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Daily',     authVol: 4000,   remainingVol: 2000,  renewalVol: 4000,   endDate: '12/31/2999', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'MASON CITY', locationId: 207, productCode: 'E', type: 'Monthly',   authVol: 25000,  remainingVol: 22000, renewalVol: 25000,  endDate: '12/31/2999', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 26000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Weekly',    authVol: 20000,  remainingVol: 2000,  renewalVol: 20000,  endDate: '07/13/2027', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Monthly',   authVol: 60000,  remainingVol: 45000, renewalVol: 60000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Weekly',    authVol: 13000,  remainingVol: 9000,  renewalVol: 13000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Daily',     authVol: 5000,   remainingVol: 0,     renewalVol: 5000,   endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Monthly',   authVol: 90000,  remainingVol: 70000, renewalVol: 90000,  endDate: '12/31/2999', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'MASON CITY', locationId: 207, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // Product AR — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Self',      authVol: null,  remainingVol: null,  renewalVol: 69000,  endDate: '04/18/2025', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Monthly',   authVol: 45000, remainingVol: 35000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Weekly',    authVol: 10000, remainingVol: 7000,  renewalVol: 10000,  endDate: '12/31/2999', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Monthly',   authVol: 30000, remainingVol: 25000, renewalVol: 30000,  endDate: '03/18/2026', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'MASON CITY', locationId: 207, productCode: 'AR', type: 'Unlimited', authVol: null,  remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // Product X — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 22000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Daily',     authVol: 4000,   remainingVol: 2000,  renewalVol: 4000,   endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Monthly',   authVol: 35000,  remainingVol: 20000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Weekly',    authVol: 12000,  remainingVol: 10000, renewalVol: 12000,  endDate: '12/31/2999', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Daily',     authVol: 6000,   remainingVol: 5000,  renewalVol: 6000,   endDate: '06/30/2027', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'MASON CITY', locationId: 207, productCode: 'X', type: 'Monthly',   authVol: 48000,  remainingVol: 40000, renewalVol: 48000,  endDate: '12/31/2999', active: true },
  // ── BETTENDORF (347) ─────────────────────────────────────────────────────
  // Product A — 8 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 94000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Weekly',    authVol: 15000,  remainingVol: 1000,  renewalVol: 15000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Monthly',   authVol: 70000,  remainingVol: 55000, renewalVol: 70000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Monthly',   authVol: 35000,  remainingVol: 28000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Weekly',    authVol: 20000,  remainingVol: 14000, renewalVol: 20000,  endDate: '05/15/2026', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Daily',     authVol: 7000,   remainingVol: 6000,  renewalVol: 7000,   endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'BETTENDORF', locationId: 347, productCode: 'A', type: 'Monthly',   authVol: 110000, remainingVol: 85000, renewalVol: 110000, endDate: '12/31/2999', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Monthly',   authVol: 87000,  remainingVol: 35000, renewalVol: 87000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Monthly',   authVol: 29000,  remainingVol: 5000,  renewalVol: 29000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Weekly',    authVol: 16000,  remainingVol: 12000, renewalVol: 16000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Monthly',   authVol: 55000,  remainingVol: 0,     renewalVol: 55000,  endDate: '12/31/2999', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Daily',     authVol: 8000,   remainingVol: 5000,  renewalVol: 8000,   endDate: '12/31/2999', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'BETTENDORF', locationId: 347, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  // Product E — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 83000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Daily',     authVol: 10000,  remainingVol: 5000,  renewalVol: 10000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Monthly',   authVol: 40000,  remainingVol: 18000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Weekly',    authVol: 11000,  remainingVol: 0,     renewalVol: 11000,  endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '03/18/2026', active: false },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Monthly',   authVol: 58000,  remainingVol: 50000, renewalVol: 58000,  endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'BETTENDORF', locationId: 347, productCode: 'E', type: 'Daily',     authVol: 5000,   remainingVol: 3000,  renewalVol: 5000,   endDate: '09/20/2027', active: true },
  // Product X — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 30000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Daily',     authVol: 3000,   remainingVol: 1000,  renewalVol: 3000,   endDate: '09/06/2026', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Monthly',   authVol: 42000,  remainingVol: 30000, renewalVol: 42000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Weekly',    authVol: 8000,   remainingVol: 6000,  renewalVol: 8000,   endDate: '12/31/2999', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Daily',     authVol: 4000,   remainingVol: 2000,  renewalVol: 4000,   endDate: '04/10/2026', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'BETTENDORF', locationId: 347, productCode: 'X', type: 'Monthly',   authVol: 55000,  remainingVol: 45000, renewalVol: 55000,  endDate: '12/31/2999', active: true },
  // ── CARTHAGE (227) ───────────────────────────────────────────────────────
  // Product A — 8 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Monthly',   authVol: 96000,  remainingVol: 38000, renewalVol: 96000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Weekly',    authVol: 14000,  remainingVol: 6000,  renewalVol: 14000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Monthly',   authVol: 50000,  remainingVol: 40000, renewalVol: 50000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Monthly',   authVol: 75000,  remainingVol: 0,     renewalVol: 75000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Daily',     authVol: 7000,   remainingVol: 5500,  renewalVol: 7000,   endDate: '12/31/2999', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'CARTHAGE', locationId: 227, productCode: 'A', type: 'Weekly',    authVol: 18000,  remainingVol: 14000, renewalVol: 18000,  endDate: '03/22/2026', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 50000,  endDate: '12/02/2025', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Daily',     authVol: 4000,   remainingVol: 0,     renewalVol: 4000,   endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Monthly',   authVol: 65000,  remainingVol: 50000, renewalVol: 65000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Weekly',    authVol: 20000,  remainingVol: 16000, renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Monthly',   authVol: 40000,  remainingVol: 32000, renewalVol: 40000,  endDate: '08/25/2027', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'CARTHAGE', locationId: 227, productCode: 'V', type: 'Daily',     authVol: 5000,   remainingVol: 3000,  renewalVol: 5000,   endDate: '12/31/2999', active: true },
  // Product E — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 28000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Daily',     authVol: 9000,   remainingVol: 7000,  renewalVol: 9000,   endDate: '05/23/2027', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Monthly',   authVol: 35000,  remainingVol: 28000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Weekly',    authVol: 9000,   remainingVol: 0,     renewalVol: 9000,   endDate: '12/31/2999', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'CARTHAGE', locationId: 227, productCode: 'E', type: 'Monthly',   authVol: 22000,  remainingVol: 18000, renewalVol: 22000,  endDate: '12/31/2999', active: true },
  // Product X — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 18000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '10/05/2026', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Monthly',   authVol: 45000,  remainingVol: 36000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Daily',     authVol: 3000,   remainingVol: 2000,  renewalVol: 3000,   endDate: '12/31/2999', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'CARTHAGE', locationId: 227, productCode: 'X', type: 'Weekly',    authVol: 12000,  remainingVol: 9000,  renewalVol: 12000,  endDate: '04/20/2026', active: true },
  // ── GREAT BEND (245) ─────────────────────────────────────────────────────
  // Product A — 8 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 67000,  endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Monthly',   authVol: 97000,  remainingVol: 80000, renewalVol: 97000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Monthly',   authVol: 55000,  remainingVol: 40000, renewalVol: 55000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Weekly',    authVol: 20000,  remainingVol: 3000,  renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Monthly',   authVol: 70000,  remainingVol: 58000, renewalVol: 70000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Daily',     authVol: 6000,   remainingVol: 4000,  renewalVol: 6000,   endDate: '03/28/2026', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'GREAT BEND', locationId: 245, productCode: 'A', type: 'Weekly',    authVol: 14000,  remainingVol: 11000, renewalVol: 14000,  endDate: '12/31/2999', active: true },
  // Product E — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '03/02/2025', active: false },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Monthly',   authVol: 30000,  remainingVol: 22000, renewalVol: 30000,  endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Weekly',    authVol: 10000,  remainingVol: 7000,  renewalVol: 10000,  endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Daily',     authVol: 3000,   remainingVol: 1000,  renewalVol: 3000,   endDate: '12/31/2999', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'GREAT BEND', locationId: 245, productCode: 'E', type: 'Monthly',   authVol: 45000,  remainingVol: 38000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 42000,  endDate: '11/08/2026', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Weekly',    authVol: 20000,  remainingVol: 13000, renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Monthly',   authVol: 60000,  remainingVol: 48000, renewalVol: 60000,  endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Monthly',   authVol: 35000,  remainingVol: 0,     renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Daily',     authVol: 5000,   remainingVol: 4000,  renewalVol: 5000,   endDate: '12/31/2999', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'GREAT BEND', locationId: 245, productCode: 'V', type: 'Weekly',    authVol: 15000,  remainingVol: 12000, renewalVol: 15000,  endDate: '05/05/2026', active: true },
  // Product A5 — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Self',      authVol: null,  remainingVol: null,  renewalVol: 99000,  endDate: '12/03/2026', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Monthly',   authVol: 80000, remainingVol: 65000, renewalVol: 80000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Weekly',    authVol: 20000, remainingVol: 16000, renewalVol: 20000,  endDate: '12/31/2999', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Monthly',   authVol: 45000, remainingVol: 35000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'GREAT BEND', locationId: 245, productCode: 'A5', type: 'Daily',     authVol: 8000,  remainingVol: 5000,  renewalVol: 8000,   endDate: '04/15/2026', active: true },
  // Product B99 — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Self',      authVol: null,  remainingVol: null,  renewalVol: 75000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Monthly',   authVol: 55000, remainingVol: 42000, renewalVol: 55000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Weekly',    authVol: 15000, remainingVol: 8000,  renewalVol: 15000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Monthly',   authVol: 40000, remainingVol: 32000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Unlimited', authVol: null,  remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Summit Fuel Partners',  supplierId: 354, location: 'GREAT BEND', locationId: 245, productCode: 'B99', type: 'Weekly',    authVol: 12000, remainingVol: 0,     renewalVol: 12000,  endDate: '12/31/2999', active: true },
  // Product X — 6 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Daily',     authVol: 4000,   remainingVol: 3000,  renewalVol: 4000,   endDate: '02/07/2027', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Monthly',   authVol: 35000,  remainingVol: 28000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Weekly',    authVol: 10000,  remainingVol: 1000,  renewalVol: 10000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Valley Energy Inc',     supplierId: 365, location: 'GREAT BEND', locationId: 245, productCode: 'X', type: 'Monthly',   authVol: 50000,  remainingVol: 42000, renewalVol: 50000,  endDate: '03/30/2026', active: true },
  // ── LINCOLN (336) ────────────────────────────────────────────────────────
  // Product A — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 39000,  endDate: '08/30/2027', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Weekly',    authVol: 17000,  remainingVol: 10000, renewalVol: 17000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Monthly',   authVol: 80000,  remainingVol: 65000, renewalVol: 80000,  endDate: '12/31/2999', active: true },
  { supplier: 'Yarrow Energy Group',   supplierId: 242, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Monthly',   authVol: 50000,  remainingVol: 0,     renewalVol: 50000,  endDate: '12/31/2999', active: true },
  { supplier: 'Dalton Supply Partners',supplierId: 140, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Redstone Energy',       supplierId: 332, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Daily',     authVol: 6000,   remainingVol: 4500,  renewalVol: 6000,   endDate: '12/31/2999', active: true },
  { supplier: 'Prairie Fuel Group',    supplierId: 387, location: 'LINCOLN', locationId: 336, productCode: 'A', type: 'Weekly',    authVol: 22000,  remainingVol: 17000, renewalVol: 22000,  endDate: '03/20/2026', active: true },
  // Product V — 7 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 75000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Unlimited', authVol: null,   remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Copperhead Energy',     supplierId: 179, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Monthly',   authVol: 70000,  remainingVol: 55000, renewalVol: 70000,  endDate: '12/31/2999', active: true },
  { supplier: 'Thornfield Petroleum',  supplierId: 230, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Weekly',    authVol: 18000,  remainingVol: 14000, renewalVol: 18000,  endDate: '12/31/2999', active: true },
  { supplier: 'Hillcrest Petroleum',   supplierId: 144, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Monthly',   authVol: 45000,  remainingVol: 38000, renewalVol: 45000,  endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Daily',     authVol: 7000,   remainingVol: 0,     renewalVol: 7000,   endDate: '09/10/2027', active: true },
  { supplier: 'Coastal Supply Co',     supplierId: 376, location: 'LINCOLN', locationId: 336, productCode: 'V', type: 'Monthly',   authVol: 30000,  remainingVol: 24000, renewalVol: 30000,  endDate: '12/31/2999', active: true },
  // Product V78 — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Self',      authVol: null,  remainingVol: null,  renewalVol: 22000,  endDate: '12/24/2026', active: true },
  { supplier: 'Questmark Energy',      supplierId: 160, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Monthly',   authVol: 40000, remainingVol: 30000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Upland Crude Supply',   supplierId: 290, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Weekly',    authVol: 12000, remainingVol: 9000,  renewalVol: 12000,  endDate: '12/31/2999', active: true },
  { supplier: 'Meridian Fuel Co',      supplierId: 310, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Unlimited', authVol: null,  remainingVol: null,  renewalVol: null,   endDate: '12/31/2999', active: true },
  { supplier: 'Northwest Energy',      supplierId: 398, location: 'LINCOLN', locationId: 336, productCode: 'V78', type: 'Monthly',   authVol: 28000, remainingVol: 22000, renewalVol: 28000,  endDate: '04/08/2026', active: true },
  // Product E — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 50000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Monthly',   authVol: 25000,  remainingVol: 0,     renewalVol: 25000,  endDate: '12/31/2999', active: true },
  { supplier: 'Ardent Fuel Solutions', supplierId: 86,  location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Weekly',    authVol: 14000,  remainingVol: 10000, renewalVol: 14000,  endDate: '12/31/2999', active: true },
  { supplier: 'Pinnacle Petroleum',    supplierId: 343, location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Monthly',   authVol: 35000,  remainingVol: 28000, renewalVol: 35000,  endDate: '12/31/2999', active: true },
  { supplier: 'Horizon Fuels',         supplierId: 321, location: 'LINCOLN', locationId: 336, productCode: 'E', type: 'Daily',     authVol: 4000,   remainingVol: 2000,  renewalVol: 4000,   endDate: '03/16/2026', active: true },
  // Product X — 5 entries
  { supplier: 'Lancer Energy Corp',    supplierId: 201, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Self',      authVol: null,   remainingVol: null,  renewalVol: 28000,  endDate: '12/31/2999', active: true },
  { supplier: 'Forrest Fuel Services', supplierId: 142, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Weekly',    authVol: 13000,  remainingVol: 12000, renewalVol: 13000,  endDate: '12/31/2999', active: true },
  { supplier: 'Wellspring Petroleum',  supplierId: 294, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Monthly',   authVol: 40000,  remainingVol: 30000, renewalVol: 40000,  endDate: '12/31/2999', active: true },
  { supplier: 'Foxridge Supply Group', supplierId: 263, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Daily',     authVol: 5000,   remainingVol: 3500,  renewalVol: 5000,   endDate: '12/31/2999', active: true },
  { supplier: 'Baxter Energy Group',   supplierId: 136, location: 'LINCOLN', locationId: 336, productCode: 'X', type: 'Monthly',   authVol: 60000,  remainingVol: 50000, renewalVol: 60000,  endDate: '07/15/2027', active: true },
];

// ---------------------------------------------------------------------------
// Data derivation
// ---------------------------------------------------------------------------

function deriveStatus(endDate: string, active: boolean): AuthEntry['status'] {
  if (!active) return 'expired';
  if (endDate === '12/31/2999') return 'active';
  const end = new Date(endDate);
  const now = new Date('2026-02-25');
  if (end < now) return 'expired';
  if (end.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) return 'expiring';
  return 'active';
}

function deriveCellHealth(entries: AuthEntry[]): CellData['health'] {
  if (entries.length === 0) return 'empty';
  const hasExpired = entries.some((e) => e.status === 'expired');
  const hasExpiring = entries.some((e) => e.status === 'expiring');
  const hasDepleted = entries.some(
    (e) => e.remainingVol != null && e.authVol != null && e.authVol > 0 && e.remainingVol / e.authVol <= 0.1,
  );
  if (hasExpired || hasDepleted) return 'critical';
  if (hasExpiring) return 'warning';
  return 'healthy';
}

function buildMatrixData(): CellData[] {
  const cellMap = new Map<string, CellData>();
  const seqCounters = new Map<string, number>();

  for (const raw of RAW_DATA) {
    const key = `${raw.locationId}|${raw.productCode}`;
    const seqKey = key;
    const seq = (seqCounters.get(seqKey) ?? 0) + 1;
    seqCounters.set(seqKey, seq);

    if (!cellMap.has(key)) {
      cellMap.set(key, {
        locationId: raw.locationId,
        location: raw.location,
        productCode: raw.productCode,
        productName: PRODUCTS[raw.productCode] ?? raw.productCode,
        entries: [],
        health: 'healthy',
      });
    }

    const cell = cellMap.get(key)!;
    cell.entries.push({
      supplier: raw.supplier,
      supplierId: raw.supplierId,
      type: raw.type,
      authVol: raw.authVol,
      remainingVol: raw.remainingVol,
      renewalVol: raw.renewalVol,
      endDate: raw.endDate,
      active: raw.active,
      status: deriveStatus(raw.endDate, raw.active),
      sequence: seq,
    });
  }

  // Derive health per cell
  for (const cell of cellMap.values()) {
    cell.health = deriveCellHealth(cell.entries);
  }

  return Array.from(cellMap.values());
}

const MATRIX_DATA = buildMatrixData();

// ---------------------------------------------------------------------------
// Visual constants
// ---------------------------------------------------------------------------

const HEALTH_CONFIG = {
  healthy: { bg: '#e8f5e9', border: '#a5d6a7', dot: '#4caf50', label: 'Active' },
  warning: { bg: '#fff8e1', border: '#ffcc80', dot: '#ff9800', label: 'Expiring' },
  critical: { bg: '#fce4ec', border: '#ef9a9a', dot: '#f44336', label: 'Expired' },
  empty:   { bg: '#f5f5f5', border: '#e0e0e0', dot: '#9e9e9e', label: 'No data' },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Unlimited: { bg: '#e8f5e9', text: '#2e7d32' },
  Monthly:   { bg: '#e3f2fd', text: '#1565c0' },
  Weekly:    { bg: '#fff3e0', text: '#e65100' },
  Daily:     { bg: '#fce4ec', text: '#c62828' },
  Self:      { bg: '#f3e5f5', text: '#7b1fa2' },
};

// ---------------------------------------------------------------------------
// Mini sequence stack (compact view inside each cell)
// ---------------------------------------------------------------------------

function MiniStack({ entries }: { entries: AuthEntry[] }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.75 }}>
      {entries.map((e) => {
        const statusColor =
          e.status === 'expired' ? '#f44336' : e.status === 'expiring' ? '#ff9800' : '#9e9e9e';
        return (
          <Box key={e.sequence} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: 'text.disabled', minWidth: 14, fontSize: '0.65rem' }}
            >
              {e.sequence}
            </Typography>
            <Box
              sx={{
                flex: 1,
                borderRadius: 0.5,
                px: 0.75,
                py: 0.25,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 0,
              }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{ color: '#0d3b6e', fontSize: '0.65rem', flex: 1, fontWeight: 500 }}
              >
                {e.supplier.split(' ')[0]}
              </Typography>
              <Box
                sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusColor, flexShrink: 0 }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Expanded detail panel (drawer-style inline panel)
// ---------------------------------------------------------------------------

function VolumeBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const color = pct <= 10 ? 'error' : pct <= 25 ? 'warning' : 'primary';
  return (
    <Tooltip title={`${remaining.toLocaleString()} / ${total.toLocaleString()} gal (${Math.round(pct)}%)`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={color}
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" sx={{ minWidth: 32, textAlign: 'right', color: 'text.secondary' }}>
          {Math.round(pct)}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

function DetailPanel({ cell, onClose }: { cell: CellData; onClose: () => void }) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        width: 340,
        flexShrink: 0,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 160px)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {cell.productCode} — {cell.productName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {cell.locationId} {cell.location}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Sequence stack */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Authorization Sequence
        </Typography>
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {cell.entries.map((e) => {
            const typeColor = TYPE_COLORS[e.type] ?? { bg: '#f5f5f5', text: '#616161' };
            const statusDot =
              e.status === 'expired' ? '#f44336' : e.status === 'expiring' ? '#ff9800' : '#4caf50';
            return (
              <Box key={e.sequence}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: 'text.disabled',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.65rem' }}>
                      {e.sequence}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {e.supplier}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      #{e.supplierId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={e.type}
                      size="small"
                      sx={{ bgcolor: typeColor.bg, color: typeColor.text, fontWeight: 600, fontSize: '0.7rem', height: 20 }}
                    />
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusDot }} />
                  </Box>
                </Box>

                {/* Volume bar if applicable */}
                {e.remainingVol != null && e.authVol != null && (
                  <Box sx={{ pl: 3.75 }}>
                    <VolumeBar remaining={e.remainingVol} total={e.authVol} />
                  </Box>
                )}

                {/* End date */}
                <Box sx={{ pl: 3.75, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {e.endDate === '12/31/2999' ? '∞ No Expiry' : `Expires ${e.endDate}`}
                  </Typography>
                </Box>

                {e.sequence < cell.entries.length && (
                  <Divider sx={{ mt: 1.5 }} />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Matrix cell
// ---------------------------------------------------------------------------

function MatrixCell({
  cell,
  isSelected,
  onClick,
  compact,
  groupBy,
}: {
  cell: CellData;
  isSelected: boolean;
  onClick: () => void;
  compact: boolean;
  groupBy: 'byLocation' | 'byProduct';
}) {
  const health = HEALTH_CONFIG[cell.health];
  const label = groupBy === 'byProduct'
    ? `${cell.locationId} ${cell.location}`
    : cell.productCode;
  const tooltipLabel = groupBy === 'byProduct'
    ? `${cell.locationId} ${cell.location}`
    : cell.productCode;
  return (
    <Tooltip
      title={compact ? `${tooltipLabel} · ${cell.entries.length} supplier${cell.entries.length !== 1 ? 's' : ''} · ${health.label}` : ''}
      placement="top"
    >
      <Box
        onClick={onClick}
        sx={{
          border: 2,
          borderColor: isSelected ? 'primary.main' : 'divider',
          borderRadius: 1.5,
          bgcolor: isSelected ? 'primary.50' : 'background.paper',
          p: compact ? 1 : 1.5,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          outline: isSelected ? '2px solid' : 'none',
          outlineColor: 'primary.main',
          outlineOffset: 1,
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: 2,
            transform: 'translateY(-1px)',
          },
        }}
      >
        {/* Label + health dot */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
          <Typography variant="caption" noWrap sx={{ fontWeight: 700, fontSize: compact ? '0.7rem' : '0.75rem' }}>
            {label}
          </Typography>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: health.dot, flexShrink: 0 }} />
        </Box>

        {/* Sequence count */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
          {cell.entries.length} seq
        </Typography>

        {/* Mini stack (expanded view only) */}
        {!compact && <MiniStack entries={cell.entries} />}
      </Box>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type GroupBy = 'byLocation' | 'byProduct';

export default function AuthSequenceMatrixV2() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>('byLocation');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const selectedCell = selectedKey
    ? MATRIX_DATA.find((c) => `${c.locationId}|${c.productCode}` === selectedKey) ?? null
    : null;

  // Filter
  const filtered = MATRIX_DATA.filter((c) => {
    if (statusFilter !== 'all' && c.health !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      c.location.toLowerCase().includes(q) ||
      c.productCode.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.entries.some((e) => e.supplier.toLowerCase().includes(q))
    );
  });

  // Group
  const groups: Map<string, { label: string; subLabel: string; cells: CellData[] }> = new Map();

  if (groupBy === 'byLocation') {
    for (const cell of filtered) {
      const key = `${cell.locationId}`;
      if (!groups.has(key)) {
        groups.set(key, {
          label: `${cell.locationId} ${cell.location}`,
          subLabel: '',
          cells: [],
        });
      }
      groups.get(key)!.cells.push(cell);
    }
  } else {
    for (const cell of filtered) {
      const key = cell.productCode;
      if (!groups.has(key)) {
        groups.set(key, {
          label: cell.productCode,
          subLabel: cell.productName,
          cells: [],
        });
      }
      groups.get(key)!.cells.push(cell);
    }
  }

  // Summary counts

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: showHint ? 0.5 : 0 }}>
          <Typography variant="h4">
            Auth Sequencing — Heat Map Matrix
          </Typography>
          <IconButton size="small" onClick={() => setShowHint((v) => !v)} sx={{ color: showHint ? 'primary.main' : 'text.disabled' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
        <Collapse in={showHint}>
          <Typography variant="body2" color="text.secondary">
            Spatial overview of your authorization portfolio. Each cell = one location × product combination.
            Click any cell to inspect the full sequence stack.
          </Typography>
        </Collapse>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          value={groupBy}
          exclusive
          onChange={(_e, val) => val && setGroupBy(val)}
          size="small"
        >
          <ToggleButton value="byLocation">Group by Location</ToggleButton>
          <ToggleButton value="byProduct">Group by Product</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          size="small"
          placeholder="Search location, product, or supplier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="critical">Expired</MenuItem>
            <MenuItem value="warning">Expiring</MenuItem>
            <MenuItem value="healthy">Active</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={compact ? 'compact' : 'expanded'}
          exclusive
          onChange={(_e, val) => val && setCompact(val === 'compact')}
          size="small"
        >
          <ToggleButton value="expanded">
            <Tooltip title="Show sequence stacks">
              <ViewListIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="compact">
            <Tooltip title="Compact cells">
              <ViewModuleIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(HEALTH_CONFIG).filter(([k]) => k !== 'empty').map(([, cfg]) => (
          <Box key={cfg.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cfg.dot }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{cfg.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Matrix + detail panel */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Matrix grid */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {Array.from(groups.entries()).map(([groupKey, group]) => (
            <Box key={groupKey} sx={{ mb: 3 }}>
              {/* Group header */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {group.label}
                </Typography>
                {group.subLabel && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {group.subLabel}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ color: 'text.disabled', ml: 'auto' }}>
                  {group.cells.length} product{group.cells.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {/* Cell grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: compact
                    ? 'repeat(auto-fill, minmax(128px, 1fr))'
                    : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 1,
                }}
              >
                {group.cells.map((cell) => {
                  const key = `${cell.locationId}|${cell.productCode}`;
                  return (
                    <MatrixCell
                      key={key}
                      cell={cell}
                      isSelected={selectedKey === key}
                      onClick={() => setSelectedKey(selectedKey === key ? null : key)}
                      compact={compact}
                      groupBy={groupBy}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Detail panel */}
        <Collapse in={selectedCell != null} orientation="horizontal" unmountOnExit>
          {selectedCell && (
            <DetailPanel cell={selectedCell} onClose={() => setSelectedKey(null)} />
          )}
        </Collapse>
      </Box>

      {/* Expand all hint */}
      {!compact && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
          <ExpandMoreIcon fontSize="small" />
          <Typography variant="caption">
            Click any cell to open detailed sequence inspector
          </Typography>
        </Box>
      )}
    </Box>
  );
}
