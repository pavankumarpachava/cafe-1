import { useState, useCallback, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { Camera, Award, Bell, Package, LogOut, Check, X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

// Helper to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg', 0.9);
};

const Profile = () => {
  const {
    user,
    isAuthenticated,
    updateUser,
    updateAvatar,
    logout,
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    orders,
  } = useStore();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [preferredDrink, setPreferredDrink] = useState(user?.preferredDrink || '');

  // Avatar cropping state
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setAvatarDialogOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveAvatar = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels);
      updateAvatar(croppedImage);
      setAvatarDialogOpen(false);
      setImageSrc(null);
      toast({
        title: 'Avatar updated!',
        description: 'Your profile picture has been saved.',
      });
    }
  };

  const handleSaveProfile = () => {
    updateUser({ name, preferredDrink });
    setEditMode(false);
    toast({
      title: 'Profile updated!',
      description: 'Your changes have been saved.',
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass rounded-2xl p-8 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-gold">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-gold text-gold-foreground">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-gold-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-gold font-semibold">
                      <Award className="w-5 h-5" />
                      {user?.credits} Credits
                    </span>
                  </div>
                </div>

                <Button variant="outline" onClick={logout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="profile" className="py-3">Profile</TabsTrigger>
                <TabsTrigger value="rewards" className="py-3">Rewards</TabsTrigger>
                <TabsTrigger value="notifications" className="py-3 relative">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-christmas text-christmas-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="orders" className="py-3">Orders</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!editMode ? (
                      <Button variant="outline" onClick={() => setEditMode(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                        <Button className="btn-gold" onClick={handleSaveProfile}>
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6">
                    <div>
                      <Label>Name</Label>
                      {editMode ? (
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-lg">{user?.name}</p>
                      )}
                    </div>

                    <div>
                      <Label>Email</Label>
                      <p className="mt-2 text-lg text-muted-foreground">{user?.email}</p>
                    </div>

                    <div>
                      <Label>Preferred Drink</Label>
                      {editMode ? (
                        <Input
                          value={preferredDrink}
                          onChange={(e) => setPreferredDrink(e.target.value)}
                          placeholder="e.g., Cappuccino"
                          className="mt-2"
                        />
                      ) : (
                        <p className="mt-2 text-lg">
                          {user?.preferredDrink || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Rewards Tab */}
              <TabsContent value="rewards">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="glass rounded-xl p-8 text-center">
                    <Award className="w-16 h-16 text-gold mx-auto mb-4" />
                    <h2 className="text-4xl font-bold mb-2">{user?.credits}</h2>
                    <p className="text-muted-foreground text-lg">Available Credits</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      100 credits = $5 off your next order
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-6">
                    <h3 className="font-semibold mb-4">How to Earn Credits</h3>
                    <ul className="space-y-3">
                      {[
                        'Earn 1 credit for every $1 spent',
                        '50 credits signup bonus',
                        'Double credits during promotions',
                        'Refer a friend for 100 bonus credits',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                      <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No notifications yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            notification.read
                              ? 'bg-secondary/50'
                              : 'bg-gold/5 border-gold/20'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.read ? 'bg-muted' : 'bg-gold'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No orders yet.</p>
                      <Link to="/shop">
                        <Button className="btn-gold">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-mono text-sm text-muted-foreground">
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gold/20 text-gold'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {order.items.map((item, i) => (
                              <span key={i} className="text-sm bg-secondary px-2 py-1 rounded">
                                {item.quantity}x {item.product.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              +{order.creditsEarned} credits earned
                            </span>
                            <span className="font-semibold">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Avatar Cropper Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Your Photo</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 bg-secondary rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="btn-gold" onClick={handleSaveAvatar}>
              Save Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
