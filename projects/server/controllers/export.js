const db = require('../models');
const { Op } = require('sequelize');

module.exports = {
  showAllStockData: async (req, res) => {
    try {
      const {
        id = '',
        _sortBy = 'id',
        _sortDir = 'ASC',
        _limit = 6,
        _page = 1,
        currentTime,
        endTime,
      } = req.query;
      const findAdminById = await db.User.findByPk(req.user.id);

      if (findAdminById.RoleId !== 3) {
        return res.status(400).json({
          message: 'User unauthorized',
        });
      }
      const whereCondition = {
        id: {
          [Op.like]: `%${id}%`,
        },
      };
      if (currentTime != 1 && endTime != 1) {
        whereCondition.createdAt = {
          [Op.between]: [currentTime, endTime],
        };
      }

      const response = await db.Journal.findAndCountAll({
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [[_sortBy, _sortDir]],
        include: [{ model: db.Type_Journal }, { model: db.Product }],
        where: whereCondition,
      });
      return res.status(200).json({
        message: 'Successfully getting stock data',
        data: response.rows,
        dataCount: response.count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server error when getting stock data',
      });
    }
  },
};
