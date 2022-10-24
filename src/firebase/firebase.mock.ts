export const setFirebaseMock = () => {
  jest.mock('firebase-admin', () => {
    return {
      auth: jest.fn().mockReturnValue({
        createUser: jest.fn(),
      }),
      credential: {
        cert: jest.fn(),
      },
      initializeApp: jest.fn(),
      firestore: jest.fn().mockReturnValue({ collection: jest.fn() }),
    };
  });
};
