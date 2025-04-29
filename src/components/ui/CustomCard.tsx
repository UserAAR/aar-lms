
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  withHoverEffect?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ 
    className, 
    title, 
    description, 
    footer, 
    withHoverEffect = true, 
    headerClassName,
    contentClassName,
    footerClassName,
    children, 
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'overflow-hidden border-border',
          withHoverEffect && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <CardHeader className={headerClassName}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={contentClassName}>{children}</CardContent>
        {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
      </Card>
    );
  }
);

CustomCard.displayName = 'CustomCard';

export { CustomCard };
