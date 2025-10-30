// TODO: Add your ImageKit configuration here
export const imagekitConfig = {
  urlEndpoint: "https://ik.imagekit.io/iwmw9mw6e", // Add your ImageKit URL endpoint
  publicKey: "process.env.IMAGEKIT_PUBLIC_KEY", // Add your public key
  // Note: Private key should be used server-side only
};

// TODO: Add transformation options during the tutorial
export const transformationOptions = [
  // Students will add transformation options here
  backgroundRemoval: {
    standard: "e-removedotbg",
    efficient: "e-bgremove"
  },
  enhance: {
    retouch: "e-retouch",
    upscale: "e-upscale",
  },
  effects: {
    dropShadow: "e-dropshadow",
    generateVar: "e-genvar",
  }, 
  smart: {
    faceCrop: "fo-face",
    smartCrop: "fo-auto",
  },
];

// TODO: Add demo images for testing
export const demoImages = [
  // Students will add demo images here
  {
    id: "bg-removal",
    name: "Background Removal",
    description: "Remove background instantly with AI",
    icon: "eraser",
    transformation: "e-bgremove",
    cost: 10,
    category: "background",
  },
  {
    id: "bg-removal-premium",
    name: "Premium Background Removal",
    description: "Higher quality background removal",
    icon: "scissors",
    transformation: "e-removedotbg",
    cost: 130,
    category: "background",
  },
  {
    id: "smart-crop",
    name: "Smart Crop Square",
    description: "Auto-crop to 400x400 square",
    icon: "crop",
    transformation: "w-400,h-400,fo-auto",
    cost: 0,
    category: "smart",
  },
  {
    id: "resize-optimize",
    name: "Optimize & Resize",
    description: "Resize to 880px width with quality optimization",
    icon: "zoom-in",
    transformation: "w-800,q-80,f-auto",
    cost: 0,
    category: "optimizeImage",
  },
  {
    name: "Enhance Quality",
    description: "Basic image enhancement",
    icon: "sparkles",
    transformation: "e-sharpen,e-contrast",
    cost: 0,
    category: "enhance",
  },
];

// TODO: Build transformation URL function
export const buildTransformationUrl = (
  imageUrl: string,
  transformations: string[]
) => {
  // Students will implement this function
  if (!imageUrl || transformations.length === 0) return imageUrl;

  const transformationStr = transformations.join(",");

  if (imageUrl.includes("/demo")){
    const urlParts = imageUrl.split("/");
    const demoIndex = urlParts.findIndex((part) => part === "demo");

    if(demoIndex === -1) {
      return imageUrl;
    }

    const imagePath = urlParts.slice(demoIndex + 1).join("/");
    const transformedUrl = `https://ik.imagekit.io/demo/tr:$(transformationStr)/$(imagePath)`;

    return transformedUrl;
  } else {
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;

      let filePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

      const accountId = "iwmw9mw6e";

      if (filePath.startsWith(accountId + "/")) {
        filePath = filePath.substring(accountId.length + 1);
      }

      const chainedTransformations = transformations.join(":");

      const transformedUrl = `${imagekitConfig.urlEndpoint}/tr:${chainedTransformations}/${filePath}`;

      return transformedUrl;
    } catch(error) {
      console.error("Error building transformation URL:", error);
      return imageUrl;
    }
  }
  return imageUrl;
};
