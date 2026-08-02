import VideoGallery from "@/src/components/VideoGallery/VideoGallery";
import { getVideoCategories, getVideos } from "@/src/components/services/videoService";

const Page = async () => {
  const [videos, categories] = await Promise.all([
    getVideos(),
    getVideoCategories(),
  ]);

  return (
    <>
      <VideoGallery videos={videos} categories={categories} />
    </>
  );
};

export default Page;
