import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthProvider';
import api from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { IImage } from '@/lib/types';

export function ImageGallery() {
  const auth = useAuth();
  const isLoggedIn = auth.userIsAuthenticated();

  const [images, setImages] = useState<IImage[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await api.get(
          `/images/practitioner/${auth.getUser()?.id}`
        );
        console.log(response.data);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load images');
      }
    }
    if (auth.getUser()?.role === 'DOCTOR') fetchImages();
  }, [auth]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (auth.getUser()?.role !== 'DOCTOR') return <Navigate to="/" />;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="p-0">
            <Link to={`/image/${image.id}`}>
              <img
                src={image.imageUrl}
                alt={image.cloudinaryPublicId}
                className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
