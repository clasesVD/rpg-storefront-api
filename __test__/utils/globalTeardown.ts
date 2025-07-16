import { TestContextBuilder } from './TestContextBuilder'

const globalTeardown = async (): Promise<void> => {
  await TestContextBuilder.closeApp()
}

export default globalTeardown
