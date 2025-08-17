import * as React from "react"
import { cn } from "@/lib/utils"

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
}

const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ className, src, alt, fallbackSrc = "/placeholder.svg", lazy = true, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    };

    React.useEffect(() => {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    }, [src]);

    return (
      <div className={cn("relative", className)}>
        {isLoading && (
          <div 
            className="absolute inset-0 bg-muted animate-pulse rounded"
            role="presentation"
            aria-hidden="true"
          />
        )}
        <img
          ref={ref}
          src={imgSrc}
          alt={alt}
          loading={lazy ? "lazy" : "eager"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          {...props}
        />
        {hasError && imgSrc === fallbackSrc && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm"
            role="img"
            aria-label="Image failed to load"
          >
            Failed to load image
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export { OptimizedImage };