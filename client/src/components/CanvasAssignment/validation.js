import * as Yup from 'yup';

export const assignmentFormSchema = Yup.object({
  difficulty: Yup.number().required('Required'),
  type: Yup.string().required('Required'),
  reminders: Yup.array(),
});
