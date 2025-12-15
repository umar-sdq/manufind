export function makeSupabaseMock() {
  const queue = [];
  const push = (r) => queue.push(r);
  const reset = () => (queue.length = 0);

  const from = () => {
    const next = () => (queue.length ? queue.shift() : { data: null, error: null });

    const builder = {
      select: () => builder,
      eq: () => builder,
      order: () => builder,
      limit: () => builder,
      update: () => builder,
      delete: () => builder,
      insert: async () => next(),
      single: async () => next(),
      then: (resolve, reject) => Promise.resolve(next()).then(resolve, reject),
    };
    return builder;
  };

  return { supabase: { from }, push, reset };
}