export const getProfile = (req, res) => {
  res
    .status(200)
    .json({
      profile: req.user,
    });
};
