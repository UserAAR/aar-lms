
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'accent';
  withAnimation?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = 'default', withAnimation = true, ...props }, ref) => {
    const buttonClasses = cn(
      {
        'bg-navy text-white hover:bg-navy/90': variant === 'primary',
        'bg-turquoise text-navy hover:bg-turquoise/90': variant === 'secondary',
        'bg-gold text-navy hover:bg-gold/90': variant === 'accent',
        'transition-all duration-200': true,
        'hover:shadow-lg active:scale-95': withAnimation,
      },
      className
    );

    return (
      <Button
        ref={ref}
        className={buttonClasses}
        variant={variant !== 'primary' && variant !== 'accent' ? variant : 'default'}
        {...props}
      />
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton };
