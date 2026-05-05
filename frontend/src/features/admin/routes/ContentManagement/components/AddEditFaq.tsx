import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
import { TextAreaField } from "@/components/Form/TextArea";
import { axios } from "@/lib/axios";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  question: z.string().min(1, "Please enter a question"),
  answer: z.string().min(5, "Please enter an answer"),
});

type FaqValues = z.infer<typeof schema>;

interface AddEditFaqProps {
  isEdit?: boolean;
  data?: Partial<FaqValues> & { id?: string };
}

export const AddEditFaqForm = ({ isEdit = false, data }: AddEditFaqProps) => {
  const navigate = useNavigate();

  const handleSubmit = async (values: FaqValues) => {
    try {
      let response:any;
      if (isEdit && data?.id) {
        response = await axios.put(`/content-management/faq/${data.id}`, values);
        toast.success(response?.message || "FAQ updated successfully!");
      } else {
        response = await axios.post("/content-management/faq", values);
        toast.success(response?.message || "FAQ added successfully!");
      }
      navigate("/admin/faq");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <ContentWrapper title={isEdit ? "Edit FAQ" : "Add FAQ"}>
      <Form<FaqValues, typeof schema>
        onSubmit={handleSubmit}
        schema={schema}
        options={{ defaultValues: data }}
      >
        {({ register, formState }) => (
          <div className="detail-card customer mb-4">
            <div className="add-box">
              <h4 className="f-20 pb-4 bold">
                {isEdit ? "Edit FAQ" : "Add FAQ"}
              </h4>
              <div className="row">
                <div className="col-12 col-md-9 mb-3">
                  <InputField
                    type="text"
                    label="Question"
                    error={formState.errors["question"]}
                    registration={register("question")}
                  />
                </div>

                <div className="col-12 col-md-9 answer-area mb-3">
                  <TextAreaField
                    label="Answer"
                    rows={4}
                    error={formState.errors["answer"]}
                    registration={register("answer")}
                  />
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <Button type="submit" className="btn btn-primary">
                  {isEdit ? "Update FAQ" : "Add FAQ"}
                </Button>
                <Button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Form>
    </ContentWrapper>
  );
};
