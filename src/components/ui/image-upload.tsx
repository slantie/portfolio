import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
  Link,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  transformToWebP,
  validateImageFile,
} from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  tags?: string[];
  label?: string;
  description?: string;
  className?: string;
  previewHeight?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "portfolio",
  tags = ["portfolio"],
  label = "Image",
  description,
  className,
  previewHeight = "h-48",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [imageError, setImageError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setUploadSuccess(false);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      // Simulate progress for visual feedback
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      try {
        const result = await uploadToCloudinary(file, { folder, tags });
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Get optimized URL
        const optimizedUrl = transformToWebP(result.secure_url, {
          width: 1200,
        });
        onChange(optimizedUrl);
        setImageError(false);
        setUploadSuccess(true);

        // Reset success state after animation
        setTimeout(() => setUploadSuccess(false), 2000);
      } catch (err) {
        clearInterval(progressInterval);
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [folder, tags, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const finalUrl = transformToWebP(urlInput.trim(), { width: 1200 });
      onChange(finalUrl);
      setUrlInput("");
      setShowUrlInput(false);
      setImageError(false);
      setError(null);
    }
  };

  const handleRemove = () => {
    onChange("");
    setImageError(false);
    setError(null);
  };

  const previewUrl = value ? transformToWebP(value, { width: 800 }) : "";

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload image"
      />

      <AnimatePresence mode="wait">
        {value && !imageError ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative border border-border rounded-lg overflow-hidden bg-muted/30"
          >
            <img
              src={previewUrl}
              alt="Preview"
              className={cn("w-full object-cover", previewHeight)}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <span className="text-white text-xs truncate max-w-[60%]">
                  {value.includes("f_webp")
                    ? "WebP optimized"
                    : value.split("/").pop()}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/20 hover:bg-red-500/80 text-white border-0"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-green-500/20"
              >
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : value && imageError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-center justify-center border border-dashed border-destructive/50 rounded-lg bg-destructive/5",
              previewHeight,
            )}
          >
            <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-sm text-destructive">Failed to load image</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group",
              previewHeight,
              dragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50",
              uploading && "pointer-events-none",
            )}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3 px-6 w-full">
                <div className="relative">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            ) : (
              <>
                <motion.div
                  animate={{ y: dragActive ? -5 : 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      dragActive
                        ? "bg-primary/10"
                        : "bg-muted group-hover:bg-primary/10",
                    )}
                  >
                    <Upload
                      className={cn(
                        "h-6 w-6 transition-colors",
                        dragActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary",
                      )}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {dragActive
                        ? "Drop image here"
                        : "Click or drag to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </div>
                </motion.div>

                <div
                  className="flex items-center gap-4 mt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isCloudinaryConfigured && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Paste URL
                  </Button>
                </div>

                {!isCloudinaryConfigured && (
                  <p className="text-xs text-amber-500 mt-2">
                    Cloudinary not configured. Use URL input.
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL Input */}
      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            <Input
              placeholder="https://res.cloudinary.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())
              }
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              size="sm"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowUrlInput(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default ImageUpload;
