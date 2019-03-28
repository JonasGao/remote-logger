module.exports = context => {
  const data = context.data;
  if (typeof data === "string") {
    context.data = { data: data };
  }
};
