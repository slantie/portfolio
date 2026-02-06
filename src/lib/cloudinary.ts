import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto as autoFormat } from "@cloudinary/url-gen/qualifiers/format";
import { auto as autoQuality } from "@cloudinary/url-gen/qualifiers/quality";
import { scale, fill } from "@cloudinary/url-gen/actions/resize";

// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

// Check if Cloudinary is configured
export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
});

// Types for upload result
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: string;
  url: string;
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  maxWidth?: number;
  maxHeight?: number;
  targetFormat?: "webp" | "svg" | "auto";
}

/**
 * Get optimized image URL with automatic format conversion
 * Converts to WebP for photos or keeps as SVG for vector graphics
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "scale" | "fill";
  } = {}
): string {
  let image = cld.image(publicId);

  // Auto format delivers WebP to supported browsers, falls back to original
  image = image.delivery(format(autoFormat())).delivery(quality(autoQuality()));

  // Apply resize if dimensions provided
  if (options.width || options.height) {
    if (options.crop === "fill") {
      image = image.resize(
        fill().width(options.width).height(options.height)
      );
    } else {
      image = image.resize(
        scale().width(options.width).height(options.height)
      );
    }
  }

  return image.toURL();
}

/**
 * Upload widget configuration for the Cloudinary Upload Widget
 * This creates a configuration object for the widget
 */
export function getUploadWidgetConfig(options: UploadOptions = {}) {
  return {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    folder: options.folder || "portfolio",
    tags: options.tags || ["portfolio"],
    maxFileSize: 10000000, // 10MB
    clientAllowedFormats: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
    cropping: false,
    showAdvancedOptions: false,
    showUploadMoreButton: false,
    singleUploadAutoClose: true,
    // Auto-convert to WebP for better performance
    eager: [
      {
        width: 1200,
        crop: "scale",
        format: "webp",
        quality: "auto:good",
      },
      {
        width: 800,
        crop: "scale",
        format: "webp",
        quality: "auto:good",
      },
      {
        width: 400,
        crop: "scale",
        format: "webp",
        quality: "auto:good",
      },
    ],
    eagerAsync: true,
    styles: {
      palette: {
        window: "#0A0A0A",
        windowBorder: "#262626",
        tabIcon: "#FAFAFA",
        menuIcons: "#A3A3A3",
        textDark: "#0A0A0A",
        textLight: "#FAFAFA",
        link: "#FAFAFA",
        action: "#FAFAFA",
        inactiveTabIcon: "#525252",
        error: "#EF4444",
        inProgress: "#3B82F6",
        complete: "#22C55E",
        sourceBg: "#171717",
      },
    },
  };
}

/**
 * Transform any Cloudinary URL to use WebP format with auto quality
 */
export function transformToWebP(
  url: string,
  options: { width?: number; quality?: string } = {}
): string {
  if (!url.includes("cloudinary.com")) {
    return url;
  }

  // Extract the path after /upload/
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  let afterUpload = url.substring(uploadIndex + 8);

  // Remove any existing transformations (they start after /upload/ and end at /v or the filename)
  const versionMatch = afterUpload.match(/^.*?(v\d+\/)/);
  if (versionMatch) {
    afterUpload = afterUpload.substring(afterUpload.indexOf(versionMatch[1]));
  }

  // Build transformation string
  const transformations: string[] = [];
  transformations.push("f_webp");
  transformations.push(`q_${options.quality || "auto:good"}`);
  if (options.width) {
    transformations.push(`w_${options.width}`);
    transformations.push("c_scale");
  }

  return `${beforeUpload}${transformations.join(",")}/${afterUpload}`;
}

/**
 * Get multiple responsive URLs for srcset
 */
export function getResponsiveUrls(url: string): {
  small: string;
  medium: string;
  large: string;
  original: string;
} {
  return {
    small: transformToWebP(url, { width: 400 }),
    medium: transformToWebP(url, { width: 800 }),
    large: transformToWebP(url, { width: 1200 }),
    original: transformToWebP(url),
  };
}

/**
 * Check if URL is an SVG (should not be converted)
 */
export function isSvgUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".svg") || url.includes("/f_svg/");
}

/**
 * Get the best format URL - WebP for photos, keep SVG for vectors
 */
export function getOptimalFormatUrl(
  url: string,
  options: { width?: number } = {}
): string {
  // Don't transform SVGs - they're already optimal for vectors
  if (isSvgUrl(url)) {
    return url;
  }

  // Transform to WebP for raster images
  return transformToWebP(url, options);
}

/**
 * Direct upload to Cloudinary without using the heavy widget
 * Uses unsigned upload with your upload preset
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  
  if (options.folder) {
    formData.append("folder", options.folder);
  }
  
  if (options.tags && options.tags.length > 0) {
    formData.append("tags", options.tags.join(","));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  return response.json();
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Allowed: PNG, JPG, GIF, WebP, SVG" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File too large. Maximum size: 10MB" };
  }

  return { valid: true };
}

