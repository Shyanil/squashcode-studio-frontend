import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Facebook,
  FileImage,
  Folder,
  HeartPulse,
  Instagram,
  Linkedin,
  Megaphone,
  Palette,
  Sparkles,
  Utensils,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MockBrandStatus = 'Active' | 'Draft' | 'Review';

export interface MockBrand {
  id: string;
  name: string;
  initials: string;
  industry: string;
  colors: string[];
  fonts: string[];
  tone: string;
  status: MockBrandStatus;
  updatedAt: string;
  tagline: string;
}

export interface MockCreative {
  id: string;
  title: string;
  brand: string;
  campaign: string;
  tags: string[];
  date: string;
  aspectRatio: string;
  variant: 'coral' | 'mint' | 'indigo' | 'amber' | 'rose' | 'cyan';
  favorite: boolean;
}

export interface MockTemplate {
  id: string;
  title: string;
  category: string;
  uses: string;
  format: string;
  icon: LucideIcon;
  variant: MockCreative['variant'];
}

export interface MockAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  folder: string;
  updatedAt: string;
  variant: MockCreative['variant'];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Designer' | 'Marketing' | 'Viewer';
  status: 'Active' | 'Invited' | 'Paused';
  lastLogin: string;
  avatar: string;
}

export const dashboardStats = [
  { label: 'Generated creatives', value: '1,284', change: '+18.4%', tone: 'emerald', icon: Sparkles },
  { label: "Today's generations", value: '46', change: '+9 today', tone: 'amber', icon: Clock3 },
  { label: 'Total brands', value: '18', change: '4 updated', tone: 'sky', icon: Building2 },
  { label: 'Prompt history', value: '3,912', change: '+221 this week', tone: 'rose', icon: FileImage },
];

export const usageSeries = [42, 55, 48, 71, 64, 78, 93, 88, 104, 118, 109, 132];
export const generationBars = [34, 62, 51, 83, 73, 96, 68];
export const storageBreakdown = [
  { label: 'Generated', value: 46, color: '#14b8a6' },
  { label: 'Uploads', value: 31, color: '#f97316' },
  { label: 'Templates', value: 23, color: '#6366f1' },
];

export const mockBrands: MockBrand[] = [
  {
    id: 'brand-1',
    name: 'RenewCare Clinics',
    initials: 'RC',
    industry: 'Healthcare',
    colors: ['#0f766e', '#f59e0b', '#f8fafc'],
    fonts: ['Inter', 'Merriweather'],
    tone: 'Reassuring, expert, calm',
    status: 'Active',
    updatedAt: '2 hours ago',
    tagline: 'Healthcare that feels personal',
  },
  {
    id: 'brand-2',
    name: 'UrbanNest Realty',
    initials: 'UN',
    industry: 'Real Estate',
    colors: ['#111827', '#c2410c', '#f4f4f5'],
    fonts: ['Satoshi', 'Playfair Display'],
    tone: 'Premium, direct, aspirational',
    status: 'Active',
    updatedAt: 'Yesterday',
    tagline: 'Find the space that fits',
  },
  {
    id: 'brand-3',
    name: 'Bistro Bloom',
    initials: 'BB',
    industry: 'Restaurant',
    colors: ['#7c2d12', '#16a34a', '#fff7ed'],
    fonts: ['Poppins', 'Fraunces'],
    tone: 'Warm, fresh, inviting',
    status: 'Review',
    updatedAt: '3 days ago',
    tagline: 'Seasonal plates, local heart',
  },
  {
    id: 'brand-4',
    name: 'Northstar Academy',
    initials: 'NA',
    industry: 'Education',
    colors: ['#1d4ed8', '#facc15', '#eff6ff'],
    fonts: ['Nunito Sans', 'Source Serif'],
    tone: 'Clear, encouraging, confident',
    status: 'Draft',
    updatedAt: 'Last week',
    tagline: 'Learning built for tomorrow',
  },
];

export const mockCreatives: MockCreative[] = [
  {
    id: 'creative-1',
    title: 'Clinic launch carousel',
    brand: 'RenewCare Clinics',
    campaign: 'Summer wellness',
    tags: ['Healthcare', 'Instagram', 'Carousel'],
    date: 'Jul 9, 2026',
    aspectRatio: '1:1',
    variant: 'mint',
    favorite: true,
  },
  {
    id: 'creative-2',
    title: 'Penthouse open house',
    brand: 'UrbanNest Realty',
    campaign: 'Luxury listings',
    tags: ['Real Estate', 'LinkedIn', 'Lead gen'],
    date: 'Jul 8, 2026',
    aspectRatio: '16:9',
    variant: 'amber',
    favorite: false,
  },
  {
    id: 'creative-3',
    title: 'Weekend brunch story',
    brand: 'Bistro Bloom',
    campaign: 'Brunch launch',
    tags: ['Food', 'Story', 'Promo'],
    date: 'Jul 7, 2026',
    aspectRatio: '9:16',
    variant: 'coral',
    favorite: true,
  },
  {
    id: 'creative-4',
    title: 'Admissions campaign',
    brand: 'Northstar Academy',
    campaign: 'Fall enrollments',
    tags: ['Education', 'Facebook', 'Awareness'],
    date: 'Jul 6, 2026',
    aspectRatio: '4:5',
    variant: 'indigo',
    favorite: false,
  },
  {
    id: 'creative-5',
    title: 'Product benefits banner',
    brand: 'RenewCare Clinics',
    campaign: 'Preventive care',
    tags: ['Banner', 'Landing page', 'Care'],
    date: 'Jul 5, 2026',
    aspectRatio: '3:2',
    variant: 'cyan',
    favorite: false,
  },
  {
    id: 'creative-6',
    title: 'Chef tasting poster',
    brand: 'Bistro Bloom',
    campaign: 'Chef table',
    tags: ['Poster', 'Restaurant', 'Event'],
    date: 'Jul 4, 2026',
    aspectRatio: '2:3',
    variant: 'rose',
    favorite: true,
  },
];

export const mockTemplates: MockTemplate[] = [
  { id: 'tpl-1', title: 'Instagram product drop', category: 'Instagram', uses: '8.2k', format: 'Square post', icon: Instagram, variant: 'coral' },
  { id: 'tpl-2', title: 'Facebook event promo', category: 'Facebook', uses: '6.4k', format: 'Feed ad', icon: Facebook, variant: 'indigo' },
  { id: 'tpl-3', title: 'LinkedIn thought card', category: 'LinkedIn', uses: '4.1k', format: 'Carousel', icon: Linkedin, variant: 'cyan' },
  { id: 'tpl-4', title: 'Real estate open house', category: 'Real Estate', uses: '9.8k', format: 'Flyer', icon: Building2, variant: 'amber' },
  { id: 'tpl-5', title: 'Healthcare awareness', category: 'Healthcare', uses: '5.7k', format: 'Poster', icon: HeartPulse, variant: 'mint' },
  { id: 'tpl-6', title: 'Restaurant weekend menu', category: 'Restaurant', uses: '7.3k', format: 'Story', icon: Utensils, variant: 'rose' },
  { id: 'tpl-7', title: 'Corporate update banner', category: 'Corporate', uses: '3.9k', format: 'Banner', icon: BarChart3, variant: 'indigo' },
  { id: 'tpl-8', title: 'School admissions kit', category: 'School', uses: '4.6k', format: 'Poster', icon: Palette, variant: 'cyan' },
];

export const templateCategories = [
  'All',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'Story',
  'Banner',
  'Poster',
  'Flyer',
  'Real Estate',
  'Healthcare',
  'Restaurant',
  'School',
  'Corporate',
];

export const mockAssets: MockAsset[] = [
  { id: 'asset-1', name: 'renewcare-logo-primary.svg', type: 'SVG', size: '84 KB', folder: 'Logos', updatedAt: '10 min ago', variant: 'mint' },
  { id: 'asset-2', name: 'hero-clinic-interior.png', type: 'PNG', size: '2.8 MB', folder: 'Backgrounds', updatedAt: '1 hour ago', variant: 'cyan' },
  { id: 'asset-3', name: 'brand-icon-set.zip', type: 'ZIP', size: '4.3 MB', folder: 'Icons', updatedAt: 'Yesterday', variant: 'amber' },
  { id: 'asset-4', name: 'urban-apartment-tour.mp4', type: 'Video', size: '42 MB', folder: 'Videos', updatedAt: '2 days ago', variant: 'indigo' },
  { id: 'asset-5', name: 'menu-product-shots', type: 'Folder', size: '28 files', folder: 'Product Images', updatedAt: '3 days ago', variant: 'rose' },
  { id: 'asset-6', name: 'satoshi-font-family.otf', type: 'Font', size: '1.2 MB', folder: 'Fonts', updatedAt: 'Last week', variant: 'coral' },
];

export const assetFolders = [
  { label: 'Logos', count: 42, icon: FileImage },
  { label: 'Icons', count: 128, icon: Palette },
  { label: 'Backgrounds', count: 86, icon: Folder },
  { label: 'PNG', count: 214, icon: FileImage },
  { label: 'SVG', count: 67, icon: FileImage },
  { label: 'Fonts', count: 19, icon: FileImage },
  { label: 'Product Images', count: 342, icon: FileImage },
  { label: 'Videos', count: 24, icon: FileImage },
];

export const mockUsers: MockUser[] = [
  { id: 'user-1', name: 'Anika Rao', email: 'anika@squashcode.com', role: 'Admin', status: 'Active', lastLogin: '8 min ago', avatar: 'AR' },
  { id: 'user-2', name: 'Kabir Mehta', email: 'kabir@squashcode.com', role: 'Designer', status: 'Active', lastLogin: '35 min ago', avatar: 'KM' },
  { id: 'user-3', name: 'Maya Chen', email: 'maya@squashcode.com', role: 'Marketing', status: 'Active', lastLogin: 'Today', avatar: 'MC' },
  { id: 'user-4', name: 'Rohan Iyer', email: 'rohan@squashcode.com', role: 'Viewer', status: 'Invited', lastLogin: 'Pending', avatar: 'RI' },
  { id: 'user-5', name: 'Elena Brooks', email: 'elena@squashcode.com', role: 'Designer', status: 'Paused', lastLogin: 'Jun 28, 2026', avatar: 'EB' },
];

export const promptMessages = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Upload a reference image or describe the creative you need. I can return structured JSON for generation, brand fit, composition, and negative prompts.',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Create a premium healthcare Instagram carousel for preventive wellness checkups.',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'I prepared a conversion-focused prompt with calming visuals, trust markers, and a warm clinical color palette.',
  },
];

export const promptHistory = [
  'Healthcare carousel for preventive care',
  'Real estate open house poster',
  'Restaurant brunch story sequence',
  'Admissions campaign banner',
];

export const recentActivity = [
  { label: 'Maya generated 4 story creatives for Bistro Bloom', time: '11 min ago', icon: Sparkles },
  { label: 'Kabir uploaded 12 new product images', time: '27 min ago', icon: FileImage },
  { label: 'Anika approved RenewCare brand voice updates', time: '1 hour ago', icon: CheckCircle2 },
  { label: 'UrbanNest template collection was shared with Marketing', time: '3 hours ago', icon: Megaphone },
];

