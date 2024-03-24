"use client";
import { useRouter } from "next/router";

const FrameRoutePage = () => {
  const router = useRouter();
  const { id } = router.query; // Access the dynamic parameter `id`

  return (
    <div>
      <h1>Frame ID: {id}</h1>
      {/* Render your page content here, using the `id` parameter as needed */}
    </div>
  );
};

export default FrameRoutePage;
