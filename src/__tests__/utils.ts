export const arrayContains = (arr: any[], expected: any[]) =>
  expect(arr).toEqual(expect.arrayContaining(expected));
