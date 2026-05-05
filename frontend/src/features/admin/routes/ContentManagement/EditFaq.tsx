import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { Spinner } from "@/components/Elements";
import { AddEditFaqForm } from "./components/AddEditFaq";

export const EditFaq = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await axios.get(`/content-management/faq/${id}`);
        setFaq(response.data);
      } catch (err) {
        console.error("Failed to fetch FAQ:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFaq();
  }, [id]);

  if (loading) return <Spinner />;

  return <AddEditFaqForm isEdit={true} data={faq} />;
};
