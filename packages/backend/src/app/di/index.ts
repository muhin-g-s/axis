import { TestController } from "../controllers/test";

export interface Container  {
  testController: TestController;
};

export function createContainer(): Container {
  return {
    testController: new TestController(),
  };
}
