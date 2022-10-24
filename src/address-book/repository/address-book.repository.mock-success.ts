export const mockedAddressBookRepositorySuccess = {
  persistAndFlush: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      id: 1,
    });
  }),
  create: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      id: 1,
    });
  }),
  findOneOrFail: jest.fn().mockImplementation(() => {
    return Promise.resolve({ id: 1, contacts: [] });
  }),
};
