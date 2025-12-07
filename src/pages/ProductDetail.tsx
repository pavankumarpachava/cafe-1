import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { products } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { PageTransition } from '@/components/layout/PageTransition';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [milk, setMilk] = useState<'whole' | 'oat' | 'almond' | 'none'>('whole');
  const [sweetness, setSweetness] = useState([50]);
  const [ice, setIce] = useState<'none' | 'light' | 'regular' | 'extra'>('regular');

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const sizeMultiplier = size === 'S' ? 1 : size === 'M' ? 1.25 : 1.5;
  const totalPrice = product.price * sizeMultiplier * quantity;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      size,
      milk,
      sweetness: sweetness[0],
      ice,
    });

    toast({
      title: 'Added to cart!',
      description: `${quantity}x ${product.name} (${size}) added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    toast({
      title: inWishlist ? 'Removed from favorites' : 'Added to favorites',
      description: inWishlist 
        ? `${product.name} removed from your favorites.`
        : `${product.name} added to your favorites.`,
    });
  };

  // Handle image scroll on hover
  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newIndex = Math.min(Math.floor(percentage * product.images.length), product.images.length - 1);
    setSelectedImage(newIndex);
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="py-8">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 mb-24">
              {/* Image Gallery */}
              <div className="space-y-4">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square rounded-2xl overflow-hidden bg-secondary relative group cursor-crosshair"
                  onMouseMove={handleImageHover}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Image indicator on hover */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {product.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === selectedImage ? 'bg-gold w-4' : 'bg-card/60'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Hover instruction */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Move cursor to browse images
                  </div>
                </motion.div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === i ? 'border-gold' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary rounded-full">
                    {product.category}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className="ml-auto"
                  >
                    <Heart 
                      className={`w-6 h-6 transition-colors ${
                        inWishlist ? 'fill-christmas text-christmas' : 'text-muted-foreground hover:text-christmas'
                      }`} 
                    />
                  </Button>
                </div>
                
                <h1 className="text-4xl font-display font-bold mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">(128 reviews)</span>
                </div>

                <p className="text-lg text-muted-foreground mb-8">
                  {product.description}
                </p>

                {/* Tasting Notes */}
                {product.tastingNotes && (
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Tasting Notes</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tastingNotes.map((note) => (
                        <span
                          key={note}
                          className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customization */}
                <div className="space-y-6 mb-8">
                  {/* Size */}
                  <div>
                    <h3 className="font-semibold mb-3">Size</h3>
                    <div className="flex gap-3">
                      {(['S', 'M', 'L'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            size === s
                              ? 'bg-gold text-gold-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {s === 'S' ? 'Small' : s === 'M' ? 'Medium' : 'Large'}
                          <span className="block text-xs opacity-70">
                            {s === 'S' ? '8oz' : s === 'M' ? '12oz (+25%)' : '16oz (+50%)'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Milk */}
                  <div>
                    <h3 className="font-semibold mb-3">Milk</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['whole', 'oat', 'almond', 'none'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMilk(m)}
                          className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                            milk === m
                              ? 'bg-gold text-gold-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {m === 'none' ? 'No Milk' : m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sweetness */}
                  <div>
                    <h3 className="font-semibold mb-3">Sweetness: {sweetness[0]}%</h3>
                    <Slider
                      value={sweetness}
                      onValueChange={setSweetness}
                      max={100}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  {/* Ice */}
                  <div>
                    <h3 className="font-semibold mb-3">Ice Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['none', 'light', 'regular', 'extra'] as const).map((i) => (
                        <button
                          key={i}
                          onClick={() => setIce(i)}
                          className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                            ice === i
                              ? 'bg-gold text-gold-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {i === 'none' ? 'No Ice' : i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-3xl font-bold text-gold">
                    ${totalPrice.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 btn-gold py-6 text-lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Link to="/checkout" className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full py-6 text-lg"
                      onClick={handleAddToCart}
                    >
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-8">
                  You Might Also Like
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;