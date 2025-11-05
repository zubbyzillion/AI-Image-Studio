"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Download, RotateCcw, Sparkles } from "lucide-react";
import { upload } from "@imagekit/next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("") as any;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadedImageUrl("");

      setIsUploading(true);

      try {
        // const authResponse = await fetch("/api/upload-auth", { cache: "no-store" });
        // // const auth = await authResponse.json();

        // // console.log("Auth params:", auth);

        // if (!authResponse.ok) {
        //   const errorMsg = await authResponse.text();
        //   throw new Error(`failed to get upload authentication: ${errorMsg}`);
        // }
        // // const data = await authResponse.json();
        //   const { token, expire, signature, publicKey } = await authResponse.json();

        const authResponse = await fetch("/api/upload-auth", { cache: "no-store" });
const authData = await authResponse.json();

if (!authResponse.ok || !authData?.token || !authData?.signature || !authData?.expire) {
  console.error("Auth API returned invalid data:", authData);
  throw new Error(`failed to get upload authentication: ${JSON.stringify(authData)}`);
}

const { token, signature, expire, publicKey } = authData;

console.log("Auth params received:", { token, signature, expire, publicKey });


          const uploadResponse = await upload({
            file,
            fileName: file.name,
            token,
            signature,
            expire,
            publicKey,
          });

          if(uploadResponse.url) {
            setUploadedImageUrl(uploadResponse.url);
            console.log("Image upload to ImageKit", uploadResponse.url);
          } else {
            throw new Error("upload response missing URL");
          }
      } catch (error) {
        console.error("upload error", error);
      } finally {
        setIsUploading(false);
      }
      // TODO: Add ImageKit upload logic here
      console.log("File selected:", file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const reset = () => {
    setUploadedImage(null);
    setImagePreview("");
  };

  const useDemoImage = () => {
    // For tutorial: Add demo image logic
    console.log("Demo image selected");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            AI Image Studio
          </h1>
          <p className="text-muted-foreground font-sans">
            Transform your images with AI
          </p>
        </div>

        {!uploadedImage ? (
          /* Upload State */
          <Card className="mx-auto">
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`p-12 text-center cursor-pointer border-2 border-dashed rounded-lg transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />

                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      {isDragActive ? "Drop your image" : "Upload an image"}
                    </h3>
                    <p className="text-muted-foreground font-sans">
                      JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>

                  <div className="flex gap-4 justify-center pt-4">
                    <Button onClick={(e) => e.stopPropagation()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        useDemoImage();
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Main Interface */
          <div className="space-y-8">
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Your Image</CardTitle>
                {isUploading && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        📤 Uploading to ImageKit...
                      </p>
                    </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 aspect-square flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transformation Tools Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">AI Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">
                    AI Transformations Coming Soon
                  </h3>
                  <p className="text-muted-foreground font-sans">
                    Follow the tutorial to add ImageKit AI transformations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button onClick={reset} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
