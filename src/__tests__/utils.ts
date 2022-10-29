export const arrayContains = (arr: any[], expected: any[]) =>
  expect(arr).toEqual(expect.arrayContaining(expected));

export const strNotContains = (str: string, notExpected: string) =>
  expect(str).toEqual(expect.not.stringContaining(notExpected));

export const strContains = (str: string, expected: string) =>
  expect(str).toEqual(expect.stringContaining(expected));
