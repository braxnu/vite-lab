export type Test = {
  id: string,
  label: string,
}

export type Examination = {
  id: string,
  name: string,
  testList: Test['id'][],
  price: number,
}

export type User = {
  email: string,
  password: string,
  isAdmin?: boolean,
}

export type ExamMap = Record<Examination['id'], Examination>
export type TestMap =  Record<Test['id'], Test>

