import React, { useState, useRef, useEffect } from 'react';

const Slider = React.forwardRef(
  (
    {
      className = '',
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [values, setValues] = useState(defaultValue);
    const trackRef = useRef(null);
    const activeThumbIndex = useRef(null);

    // Helper function to combine class names
    const cn = (...classes) => {
      return classes.filter(Boolean).join(' ');
    };

    // Update internal value state when defaultValue prop changes
    useEffect(() => {
      setValues(defaultValue);
    }, [defaultValue]);

    // Handle pointer events
    useEffect(() => {
      const handlePointerMove = e => {
        if (activeThumbIndex.current !== null) {
          updateThumbValue(e.clientX, activeThumbIndex.current);
        }
      };

      const handlePointerUp = () => {
        activeThumbIndex.current = null;
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);

      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }, [values]); // Including values in dependencies for accurate calculations

    // Calculate percentage for positioning
    const getPercentage = value => {
      return ((value - min) / (max - min)) * 100;
    };

    // Calculate value from client X position
    const getValueFromPosition = clientX => {
      const trackRect = trackRef.current.getBoundingClientRect();
      const percentage = (clientX - trackRect.left) / trackRect.width;
      const rawValue = percentage * (max - min) + min;
      const steppedValue = Math.round((rawValue - min) / step) * step + min;
      return Math.max(min, Math.min(max, steppedValue));
    };

    // Find the closest thumb to a position
    const getClosestThumbIndex = clientX => {
      if (values.length === 1) return 0;

      const trackRect = trackRef.current.getBoundingClientRect();
      const positionPercentage = (clientX - trackRect.left) / trackRect.width;
      const positionValue = positionPercentage * (max - min) + min;

      let closestIndex = 0;
      let minDistance = Math.abs(values[0] - positionValue);

      for (let i = 1; i < values.length; i++) {
        const distance = Math.abs(values[i] - positionValue);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      return closestIndex;
    };

    // Update the value of a specific thumb
    const updateThumbValue = (clientX, thumbIndex) => {
      const newValue = getValueFromPosition(clientX);
      const newValues = [...values];
      newValues[thumbIndex] = newValue;

      // Sort values for multi-thumb slider
      if (values.length > 1) {
        newValues.sort((a, b) => a - b);
      }

      setValues(newValues);

      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    // Handle track click
    const handleTrackPointerDown = e => {
      if (disabled) return;

      const thumbIndex = getClosestThumbIndex(e.clientX);
      activeThumbIndex.current = thumbIndex;
      updateThumbValue(e.clientX, thumbIndex);
    };

    // Handle thumb pointer down
    const handleThumbPointerDown = (e, index) => {
      if (disabled) return;

      e.stopPropagation();
      activeThumbIndex.current = index;
    };

    // Handle keyboard navigation for a specific thumb
    const handleThumbKeyDown = (e, index) => {
      if (disabled) return;

      let newValue = values[index];

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(max, values[index] + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(min, values[index] - step);
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      const newValues = [...values];
      newValues[index] = newValue;

      // Sort values for multi-thumb slider
      if (values.length > 1) {
        newValues.sort((a, b) => a - b);
      }

      setValues(newValues);

      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
          onPointerDown={handleTrackPointerDown}
        >
          {values.length === 1 ? (
            // Single-thumb case
            <div
              className="absolute h-full bg-primary"
              style={{ width: `${getPercentage(values[0])}%` }}
            />
          ) : (
            // Multi-thumb case (range slider)
            values.map((_, index) => {
              if (index === 0) return null;

              const leftValue = values[index - 1];
              const rightValue = values[index];
              const leftPercent = getPercentage(leftValue);
              const rightPercent = getPercentage(rightValue);
              const width = rightPercent - leftPercent;

              return (
                <div
                  key={index}
                  className="absolute h-full bg-primary"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${width}%`,
                  }}
                />
              );
            })
          )}

          {/* Thumbs */}
          {values.map((value, index) => (
            <div
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-disabled={disabled}
              className={cn(
                'absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                disabled && 'pointer-events-none opacity-50',
              )}
              style={{ left: `${getPercentage(value)}%` }}
              onPointerDown={e => handleThumbPointerDown(e, index)}
              onKeyDown={e => handleThumbKeyDown(e, index)}
            />
          ))}
        </div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export { Slider };
