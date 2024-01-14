import * as Yup from 'yup';

export const assignmentFormSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Must be 1 character at minimum')
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
  dueDate: Yup.date().required('Required'),
  type: Yup.string().required('Required'),
  difficulty: Yup.number().required('Required').min(1).max(5),
  // only one reminder is allowed
  reminders: Yup.string().max(100, 'Must be 100 characters or less'),
});
