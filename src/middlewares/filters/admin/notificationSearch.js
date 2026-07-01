const notificationSearch = (req, res, next) => {
  const { search, unread } = req.query;
  let query = {};
  if (unread) {
    query.isRead = unread === "true" ? false : true;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
      { receiverRole: { $regex: search, $options: "i" } },
      { relatedModule: { $regex: search, $options: "i" } },
      { actionUrl: { $regex: search, $options: "i" } },
    ];
  }
  req.notifications_query = query;
  next();
};

export default notificationSearch;
