'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/api/products';
import { adminProductsApi } from '@/lib/api/admin/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ImageUploadProps {
  product: Product;
}

export function ImageUpload({ product }: ImageUploadProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await adminProductsApi.uploadImage(product.id, selectedFile, altText, isPrimary);
      setSelectedFile(null);
      setAltText('');
      setIsPrimary(false);
      router.refresh();
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image? This will also delete it from Cloudinary.')) return;

    try {
      await adminProductsApi.deleteImage(product.id, imageId);
      router.refresh();
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete image');
    }
  };

  const sortedImages = [...(product.images || [])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  return (
    <div className="space-y-6">
      {/* Current Images */}
      {sortedImages.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Current Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {sortedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                      Primary
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => handleDelete(image.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Image */}
      <div>
        <h3 className="font-semibold mb-3">Upload New Image</h3>
        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          <Input
            type="text"
            placeholder="Alt text (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
            <span>Set as primary image</span>
          </label>

          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>
    </div>
  );
}
