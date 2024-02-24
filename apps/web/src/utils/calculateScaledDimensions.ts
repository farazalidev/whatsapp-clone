export const calculateScaledDimensions = (
  originalWidth: number | null | undefined,
  originalHeight: number | null | undefined,
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number,
) => {
  if (originalWidth && originalHeight) {
    const aspectRatio = originalWidth / originalHeight;

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    // Apply minimum constraints
    if (newWidth < minWidth) {
      newWidth = minWidth;
      newHeight = newWidth / aspectRatio;

      // Adjust if the new height is still less than the minimum
      if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = newHeight * aspectRatio;
      }
    }

    if (newHeight < minHeight) {
      newHeight = minHeight;
      newWidth = newHeight * aspectRatio;

      // Adjust if the new width is still less than the minimum
      if (newWidth < minWidth) {
        newWidth = minWidth;
        newHeight = newWidth / aspectRatio;
      }
    }

    // Apply maximum constraints
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    return { width: newWidth, height: newHeight };
  }

  return { width: 400, height: 400 }; // Default dimensions if original dimensions are not available
};
