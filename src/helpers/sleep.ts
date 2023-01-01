export const sleep = async (t: number): Promise<void> => {
  await new Promise(r => setTimeout(r, t));
};
