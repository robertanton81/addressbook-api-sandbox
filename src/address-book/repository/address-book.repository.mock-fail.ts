export const AddressBookRepositoryFail = {
  persistAndFlush: jest.fn().mockImplementation(() => {
    return Promise.reject('null');
  }),
  create: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      id: 1,
    });
  }),
};
