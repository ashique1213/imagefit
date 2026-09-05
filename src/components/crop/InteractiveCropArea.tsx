import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { PixelCropArea } from '../../utils/image/cropImage';
import { clampCropBox } from '../../utils/image/cropImage';

interface InteractiveCropAreaProps {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number | null; // width / height or null for freeform
  cropBox: PixelCropArea;
  onChangeCropBox: (box: PixelCropArea) => void;
  zoom: number;
  onImageDimensionsMeasured?: (rect: { width: number; height: number }) => void;
}

type DragHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

export const InteractiveCropArea: React.FC<InteractiveCropAreaProps> = ({
  imageSrc,
  naturalWidth,
  naturalHeight,
  aspectRatio,
  cropBox,
  onChangeCropBox,
  zoom,
  onImageDimensionsMeasured,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const activeDragRef = useRef<{
    handle: DragHandle;
    startX: number;
    startY: number;
    initialBox: PixelCropArea;
  } | null>(null);

  // Measure rendered image dimensions inside container
  const updateDimensions = useCallback(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w > 0 && h > 0) {
        setContainerSize({ width: w, height: h });
        onImageDimensionsMeasured?.({ width: w, height: h });
      }
    }
  }, [onImageDimensionsMeasured]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions, zoom]);

  // Pointer event handlers for dragging crop box or handles
  const handlePointerDown = (handle: DragHandle, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    activeDragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDragRef.current || containerSize.width === 0 || containerSize.height === 0) return;

    const { handle, startX, startY, initialBox } = activeDragRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const maxW = containerSize.width;
    const maxH = containerSize.height;
    const minSize = 25;

    let newX = initialBox.x;
    let newY = initialBox.y;
    let newW = initialBox.width;
    let newH = initialBox.height;

    if (handle === 'move') {
      newX = initialBox.x + deltaX;
      newY = initialBox.y + deltaY;
      const clamped = clampCropBox({ x: newX, y: newY, width: newW, height: newH }, maxW, maxH);
      onChangeCropBox(clamped);
      return;
    }

    // Handle corner/edge resizing
    if (handle === 'se') {
      newW = Math.max(minSize, initialBox.width + deltaX);
      newH = aspectRatio ? newW / aspectRatio : Math.max(minSize, initialBox.height + deltaY);
      if (aspectRatio && newH > maxH - initialBox.y) {
        newH = maxH - initialBox.y;
        newW = newH * aspectRatio;
      }
    } else if (handle === 'sw') {
      newW = Math.max(minSize, initialBox.width - deltaX);
      newH = aspectRatio ? newW / aspectRatio : Math.max(minSize, initialBox.height + deltaY);
      newX = initialBox.x + (initialBox.width - newW);
    } else if (handle === 'ne') {
      newW = Math.max(minSize, initialBox.width + deltaX);
      newH = aspectRatio ? newW / aspectRatio : Math.max(minSize, initialBox.height - deltaY);
      newY = initialBox.y + (initialBox.height - newH);
    } else if (handle === 'nw') {
      newW = Math.max(minSize, initialBox.width - deltaX);
      newH = aspectRatio ? newW / aspectRatio : Math.max(minSize, initialBox.height - deltaY);
      newX = initialBox.x + (initialBox.width - newW);
      newY = initialBox.y + (initialBox.height - newH);
    } else if (handle === 'e') {
      newW = Math.max(minSize, initialBox.width + deltaX);
      if (aspectRatio) newH = newW / aspectRatio;
    } else if (handle === 'w') {
      newW = Math.max(minSize, initialBox.width - deltaX);
      newX = initialBox.x + (initialBox.width - newW);
      if (aspectRatio) newH = newW / aspectRatio;
    } else if (handle === 's') {
      newH = Math.max(minSize, initialBox.height + deltaY);
      if (aspectRatio) newW = newH * aspectRatio;
    } else if (handle === 'n') {
      newH = Math.max(minSize, initialBox.height - deltaY);
      newY = initialBox.y + (initialBox.height - newH);
      if (aspectRatio) newW = newH * aspectRatio;
    }

    // Boundary constraints check
    if (newX < 0) {
      newW += newX;
      newX = 0;
      if (aspectRatio) newH = newW / aspectRatio;
    }
    if (newY < 0) {
      newH += newY;
      newY = 0;
      if (aspectRatio) newW = newH * aspectRatio;
    }
    if (newX + newW > maxW) {
      newW = maxW - newX;
      if (aspectRatio) newH = newW / aspectRatio;
    }
    if (newY + newH > maxH) {
      newH = maxH - newY;
      if (aspectRatio) newW = newH * aspectRatio;
    }

    const finalBox = clampCropBox(
      { x: newX, y: newY, width: Math.max(minSize, newW), height: Math.max(minSize, newH) },
      maxW,
      maxH
    );
    onChangeCropBox(finalBox);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      activeDragRef.current = null;
    }
  };

  // Calculate pixel resolution in original image coordinates for live display
  const scaleX = containerSize.width > 0 ? naturalWidth / containerSize.width : 1;
  const scaleY = containerSize.height > 0 ? naturalHeight / containerSize.height : 1;
  const currentNaturalCropW = Math.round(cropBox.width * scaleX);
  const currentNaturalCropH = Math.round(cropBox.height * scaleY);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-2"
      style={{ maxHeight: '600px' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative inline-block max-w-full">
        {/* Source Image */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Crop target"
          onLoad={updateDimensions}
          className="max-h-[500px] w-auto max-w-full object-contain block mx-auto pointer-events-none transition-transform duration-100"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        />

        {/* Dimmed backdrop outside active crop box (4 overlay rectangles) */}
        {containerSize.width > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top mask */}
            <div
              className="absolute left-0 right-0 top-0 bg-black/60 backdrop-blur-[1px]"
              style={{ height: `${cropBox.y}px` }}
            />
            {/* Bottom mask */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-black/60 backdrop-blur-[1px]"
              style={{
                top: `${cropBox.y + cropBox.height}px`,
              }}
            />
            {/* Left mask */}
            <div
              className="absolute left-0 bg-black/60 backdrop-blur-[1px]"
              style={{
                top: `${cropBox.y}px`,
                height: `${cropBox.height}px`,
                width: `${cropBox.x}px`,
              }}
            />
            {/* Right mask */}
            <div
              className="absolute right-0 bg-black/60 backdrop-blur-[1px]"
              style={{
                top: `${cropBox.y}px`,
                height: `${cropBox.height}px`,
                left: `${cropBox.x + cropBox.width}px`,
              }}
            />
          </div>
        )}

        {/* Interactive Crop Box Overlay */}
        {containerSize.width > 0 && (
          <div
            className="absolute border-2 border-blue-400 shadow-sm cursor-move touch-none z-10"
            style={{
              left: `${cropBox.x}px`,
              top: `${cropBox.y}px`,
              width: `${cropBox.width}px`,
              height: `${cropBox.height}px`,
            }}
            onPointerDown={(e) => handlePointerDown('move', e)}
          >
            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-blue-400/30" />
              <div className="border-r border-b border-blue-400/30" />
              <div className="border-b border-blue-400/30" />
              <div className="border-r border-b border-blue-400/30" />
              <div className="border-r border-b border-blue-400/30" />
              <div className="border-b border-blue-400/30" />
              <div className="border-r border-blue-400/30" />
              <div className="border-r border-blue-400/30" />
              <div />
            </div>

            {/* Live Cropped Resolution Badge */}
            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-sm border border-slate-700/60 text-[10px] font-mono font-bold text-white pointer-events-none shadow-md">
              {currentNaturalCropW} × {currentNaturalCropH} px
            </div>

            {/* Corner Handles */}
            <div
              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-20 shadow-md"
              onPointerDown={(e) => handlePointerDown('nw', e)}
            />
            <div
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-20 shadow-md"
              onPointerDown={(e) => handlePointerDown('ne', e)}
            />
            <div
              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform z-20 shadow-md"
              onPointerDown={(e) => handlePointerDown('sw', e)}
            />
            <div
              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform z-20 shadow-md"
              onPointerDown={(e) => handlePointerDown('se', e)}
            />

            {/* Edge Midpoint Handles (for freeform or 1-axis expansion) */}
            {!aspectRatio && (
              <>
                <div
                  className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-4 bg-blue-400 border border-white rounded-sm cursor-ew-resize hover:scale-110 z-20"
                  onPointerDown={(e) => handlePointerDown('w', e)}
                />
                <div
                  className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-4 bg-blue-400 border border-white rounded-sm cursor-ew-resize hover:scale-110 z-20"
                  onPointerDown={(e) => handlePointerDown('e', e)}
                />
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-blue-400 border border-white rounded-sm cursor-ns-resize hover:scale-110 z-20"
                  onPointerDown={(e) => handlePointerDown('n', e)}
                />
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-blue-400 border border-white rounded-sm cursor-ns-resize hover:scale-110 z-20"
                  onPointerDown={(e) => handlePointerDown('s', e)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
