// Dummy replacement for Base44's missing SDK/client
// Prevents build errors from auth/DB imports
// Returns fake data so UI renders

const base44 = {
  auth: {
    login: async () => ({ success: true, user: { name: 'Matthew (demo)' } }),
    logout: async () => {},
    getCurrentUser: () => ({ name: 'Matthew (demo)', email: 'demo@example.com' }),
    onAuthStateChanged: (callback) => {
      callback({ name: 'Matthew (demo)' });
      return () => {};
    },
  },
  db: {
    collection: () => ({
      doc: () => ({
        set: async () => console.log('Fake save'),
        get: async () => ({ data: () => ({}) }),
      }),
      get: async () => ({ docs: [] }),
    }),
  },
  // Add more if new errors appear (e.g. AI calls)
};

export default base44;