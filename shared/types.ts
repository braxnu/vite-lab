export type Test = {
  id: string,
  label: string,
}

export type Examination = {
  name: string,
  testList: Test['id'][],
  price: number,
}
