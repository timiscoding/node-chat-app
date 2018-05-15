export const createOne = (req, res) => {
  res.send('create user');
};

export const getOne = (req, res) => {
  res.send(`get user\n ${req.docFromId}`);
};

export const updateOne = (req, res) => {
  res.send(`update user\n ${req.docFromId}`);
};

export const deleteOne = (req, res) => {
  res.send(`delete user\n ${req.docFromId}`);
};

export const getAll = (req, res) => {
  res.send('get all users');
};
