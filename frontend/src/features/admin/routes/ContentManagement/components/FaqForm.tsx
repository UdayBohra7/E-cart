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
import { Faq } from '../../../types';

type FaqFormProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Faq) => void;
  title: string;
  initialValues?: Faq;
};

export const FaqForm = ({
  open,
  onClose,
  onSave,
  title,
  initialValues,
}: FaqFormProps) => {
  const { register, handleSubmit, reset } = useForm<Faq>({
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({ question: '', answer: '' });
    }
  }, [initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent>
          <TextField
            {...register('question')}
            label="Question"
            fullWidth
            margin="normal"
          />
          <TextField
            {...register('answer')}
            label="Answer"
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
