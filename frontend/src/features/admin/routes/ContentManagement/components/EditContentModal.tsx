import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

type EditContentForm = {
  title: string;
  description: string;
};

type EditContentModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: EditContentForm) => void;
  title: string;
  initialValues: EditContentForm;
};

export const EditContentModal = ({
  open,
  onClose,
  onSave,
  title,
  initialValues,
}: EditContentModalProps) => {
  const { register, handleSubmit, reset } = useForm<EditContentForm>({
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <TextField
            {...register('title')}
            label="Title"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register('description')}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
