import {
  BriefcaseBusiness,
  Handshake,
  MapPinned,
  PanelsTopLeft,
  Tv,
  Users,
} from 'lucide-react';

export const vendorTypeOptions = [
  {
    id: 'billboards',
    title: 'Billboards',
    description: 'Outdoor media owners and billboard inventory partners.',
    icon: PanelsTopLeft,
  },
  {
    id: 'brands',
    title: 'Brands',
    description: 'Brand collaboration and co-promotion partners.',
    icon: Handshake,
  },
  {
    id: 'media',
    title: 'Media',
    description: 'General media publication and amplification partners.',
    icon: Tv,
  },
  {
    id: 'field-agents',
    title: 'Field Agents',
    description: 'Tea cup, notice marketing, and tea shop board operators.',
    icon: MapPinned,
  },
  {
    id: 'ambassadors',
    title: 'Ambassadors',
    description: 'Local ambassador and community activation partners.',
    icon: Users,
  },
];

export const getVendorTypeConfig = (vendorType) =>
  vendorTypeOptions.find((option) => option.id === vendorType) || vendorTypeOptions[0];

export const getVendorDashboardPath = (vendorType) =>
  `/vendor/dashboard/${getVendorTypeConfig(vendorType).id}`;
