import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/utils';

type DrawingMode = 'line' | 'circle' | 'none';

export default function InteractiveImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [color, setColor] = useState('#FF0000');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const auth = useAuth();
  const isLoggedIn = auth.userIsAuthenticated();

  useEffect(() => {
    if (image) {
      drawImage();
    }
  }, [image]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingMode === 'none') return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPos({ x, y });
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawingMode === 'none') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      if (drawingMode === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (drawingMode === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }

      setStartPos({ x, y });
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const handleUploadToCloudinary = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsUploading(true);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (blob == null) return;

      // Create FormData and append the blob
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      formData.append('practitionerId', auth.getUser()!.id.toString());

      // Send to backend
      const response = await api.post('/images/upload', formData);

      console.log(response);

      toast.success('Image saved');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (auth.getUser()?.role != 'DOCTOR') return <Navigate to="/" />;

  return (
    <div className="container p-4 mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload Image</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <div className="space-y-2">
        <Label>Drawing Mode</Label>
        <RadioGroup
          value={drawingMode}
          onValueChange={(value: DrawingMode) => setDrawingMode(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="line" id="line" />
            <Label htmlFor="line">Line</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="circle" id="circle" />
            <Label htmlFor="circle">Circle</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="line-width">Line Width</Label>
        <Slider
          id="line-width"
          min={1}
          max={20}
          step={1}
          value={[lineWidth]}
          onValueChange={(value) => setLineWidth(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Canvas</Label>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          className="max-w-full border border-gray-300 cursor-crosshair"
        />
      </div>

      <Button onClick={handleUploadToCloudinary}>
        {isUploading ? 'Saving...' : 'Save Image'}
      </Button>
    </div>
  );
}
