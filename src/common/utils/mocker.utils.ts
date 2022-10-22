import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

export const setMocker = (token) => {
  const moduleMocker = new ModuleMocker(global);
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);

  return new Mock();
};
