import * as Yup from 'yup';

export const profileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Must be 2 characters at minimum')
    .max(30, 'Must be 30 characters or less')
    .required(),
  username: Yup.string()
    .min(2, 'Must be 2 characters at minimum')
    .max(20, 'Must be 20 characters or less')
    .matches(/^[a-zA-Z0-9_]+$/, 'Invalid characters in username')
    .required(),
  password: Yup.string()
    .min(6, 'Must be 6 characters at minimum')
    .max(20, 'Must be 20 characters or less'),
  calendarId: Yup.string().required(),
  dueDateWeight: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(10, 'Must be 10 or less')
    .test('sum-validation', 'Weights must add up to 10.', function (value) {
      const { difficultyWeight = 0, typeWeight = 0 } = this.parent;
      return value + difficultyWeight + typeWeight === 10;
    }),
  difficultyWeight: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(10, 'Must be 10 or less')
    .test('sum-validation', 'Weights must add up to 10.', function (value) {
      const { dueDateWeight = 0, typeWeight = 0 } = this.parent;
      return dueDateWeight + value + typeWeight === 10;
    }),
  typeWeight: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(10, 'Must be 10 or less')
    .test('sum-validation', 'Weights must add up to 10.', function (value) {
      const { dueDateWeight = 0, difficultyWeight = 0 } = this.parent;
      return dueDateWeight + difficultyWeight + value === 10;
    }),
});
