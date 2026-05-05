import ContentWrapper from "@/components/Layout/ContentWrapper";
import { Button } from "@/components/Elements";
import { Form, InputField } from "@/components/Form";
// TextAreaField removed in favour of rich-text ReactQuill editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Controller } from 'react-hook-form';
import { axios } from "@/lib/axios";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";


const schema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(10, "Please enter a description"),
});

type ContentValues = z.infer<typeof schema>;

type AddContentProps = {
  isEdit?: boolean;
  data?: Partial<ContentValues> & { id?: string }; // `id` for edit case
};

export const AddEditContentForm = ({ isEdit = false, data }: AddContentProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const description = useMemo<any>(() => decodeHtmlEntities(data?.description || ""), []);

  const handleSubmit = async (values: ContentValues) => {
    setIsSaving(true);
    try {
      let response: any;

      if (isEdit && data?.id) {
        response = await axios.put(`/content-management/content/${data.id}`, values);
        toast.success(response?.message || "Content updated successfully!");
      } else {
        response = await axios.post("/content-management", values);
        toast.success(response?.message || "Content added successfully!");
      }

      navigate("/admin/content-management");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  function decodeHtmlEntities(text: string) {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  return (
    <ContentWrapper title={isEdit ? "Edit Content" : "Add Content"}>
      <Form<ContentValues, typeof schema>
        onSubmit={handleSubmit}
        schema={schema}
        options={{
          defaultValues: {
            ...data,
            description: description || data?.description
          }
        }}
      >
        {({ register, formState, control }) => (
          <div className="detail-card customer mb-4">
            <div className="add-box">
              <h4 className="f-20 pb-4 bold">
                {isEdit ? "Edit Content" : "Add Content"}
              </h4>
              <div className="row">
                <div className="col-12 col-md-9 mb-3">
                  <InputField
                    type="text"
                    label="Title"
                    disabled={isEdit || false}
                    error={formState.errors["title"]}
                    registration={register("title")}
                  />
                </div>

                <div className="col-12 col-md-9 mb-3">
                  <Controller
                    name="description"
                    control={control}
                    defaultValue={data?.description || ''}
                    render={({ field }) => (
                      <div>
                        <div className="form-label">Description</div>
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        {formState.errors["description"] && (
                          <div className="form-text text-danger form-error">
                            {formState.errors["description"]?.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <Button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update' : 'Save'}
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
