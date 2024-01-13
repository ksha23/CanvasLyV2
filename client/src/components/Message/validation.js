import * as Yup from 'yup';

export const messageFormSchema = Yup.object({
  difficulty: Yup.number().required('Required'),
  type: Yup.string().required('Required'),
  reminders: Yup.array(),
});
