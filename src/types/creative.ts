export interface CreativeAsset {
  id: string;
  title: string;
  imageUrl: string;
  status: 'draft' | 'generated' | 'approved' | 'archived';
  createdAt: string;
}

