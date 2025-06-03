import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const AnimatedButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  onClick,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 hover-glow',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 hover-glow',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 hover-glow',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/50',
    gradient: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 gradient-shift hover-glow',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05, 
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { 
      x: iconPosition === 'right' ? 5 : -5,
      transition: { duration: 0.2 }
    },
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: { duration: 0.6 }
    },
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      {iconPosition === 'left' && icon && (
        <motion.span variants={iconVariants} className="mr-2">
          {icon}
        </motion.span>
      )}
      
      {loading ? (
        <div className="flex items-center">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Loading...
        </div>
      ) : (
        <>
          {children}
          {iconPosition === 'right' && icon && (
            <motion.span variants={iconVariants} className="ml-2">
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;