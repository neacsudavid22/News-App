import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

const uploadImages = (files) => {
  if (!files || files.length === 0) {
    throw new Error("No images uploaded");
  }

  const imageUrls = files.map(file => file.path);
  return { message: "Images uploaded successfully", imageUrls };
};

const getUnusedImagesPublicIds = async (uploadedImageUrls = []) => {
  const result = await cloudinary.search
    .expression(`folder:images`)
    .sort_by('public_id')
    .max_results(100)
    .execute();

  const allPublicIds = result.resources.map(resource => resource.public_id);

  if (uploadedImageUrls.length === 0) {
    return { unusedPublicIds: allPublicIds };
  }

  const uploadedIds = new Set(uploadedImageUrls.map(url => extractPublicId(url)));

  const unusedPublicIds = allPublicIds.filter(id => !uploadedIds.has(id));
  return { unusedPublicIds };
};

const cleanUpUnusedImages = async (unusedPublicIds = []) => {
  if (unusedPublicIds.length === 0) {
    throw new Error("No unused images to delete");
  }

  const result = await cloudinary.api.delete_resources(unusedPublicIds);
  return { message: 'Unused images deleted successfully', result };
};

const deleteImages = async (imageUrls = []) => {
  if (imageUrls.length === 0) {
    throw new Error("No images to delete");
  }

  const imagePublicIds = imageUrls.map(url => extractPublicId(url));
  const result = await cloudinary.api.delete_resources(imagePublicIds);

  return { message: 'Images deleted successfully', result };
};

export {
  uploadImages,
  getUnusedImagesPublicIds,
  cleanUpUnusedImages,
  deleteImages
};