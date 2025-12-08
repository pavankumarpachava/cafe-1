import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <motion.div
    className={cn(
      'rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
      className
    )}
    animate={{
      backgroundPosition: ['200% 0', '-200% 0'],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear' as const,
    }}
  />
);

export const CheckoutSkeleton = () => (
  <div className="container mx-auto px-4 py-24">
    <Skeleton className="h-8 w-48 mb-8" />
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-secondary rounded-lg mb-4">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
        <div className="bg-card rounded-xl p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12 sm:col-span-2" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-card rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-32 mb-6" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <Skeleton className="h-12 w-full mt-6" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-24">
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  </div>
);

export const ShopSkeleton = () => (
  <div className="container mx-auto px-4 py-24">
    <div className="text-center mb-12">
      <Skeleton className="h-10 w-48 mx-auto mb-4" />
      <Skeleton className="h-6 w-64 mx-auto" />
    </div>
    <div className="flex justify-center gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full" />
      ))}
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-card rounded-2xl p-4 space-y-4">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-24">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-28" />
        ))}
      </div>
      <div className="bg-card rounded-xl p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const OrdersSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-card rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-between mt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    ))}
  </div>
);
