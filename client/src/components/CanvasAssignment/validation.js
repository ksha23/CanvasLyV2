import * as Yup from 'yup';

/*
      assignment.name = newData.name;
      assignment.dueDate = newData.dueDate;
      assignment.type = newData.type;
      assignment.difficulty = newData.difficulty;
      assignment.description = newData.description;
      assignment.reminders = newData.reminders;
  */
export const assignmentFormSchema = Yup.object({
  name: Yup.string().required('Name required'),
  dueDate: Yup.date().required('Due date required'),
  type: Yup.string().required('Type required'),
  difficulty: Yup.number().required('Difficulty required'),
  description: Yup.string().max(250, 'Max 250 characters'),
  reminders: Yup.array(),
});
