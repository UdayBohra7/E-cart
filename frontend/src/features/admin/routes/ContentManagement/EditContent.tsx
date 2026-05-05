import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { AddEditContentForm } from "./components/AddEditContent";

export const EditContent = () => {
  const { id } = useParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/content-management/content/${id}`);
        setContent(response.data);
      } catch (err) {
        console.error("Failed to fetch content:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchContent();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return <AddEditContentForm isEdit={true} data={content} />;
};
