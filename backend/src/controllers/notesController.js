const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Note = require('../models/Note');

exports.getNotes = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const where = { user_id: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Note.findAndCountAll({
      where,
      order: [['updated_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ notes: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, content, tags } = req.body;
    const note = await Note.create({ title, content, tags, user_id: req.user.id });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const note = await Note.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await note.update(req.body);
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};
