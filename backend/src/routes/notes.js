const router = require('express').Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notesController');

const noteRules = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

router.use(authenticate);

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', noteRules, createNote);
router.put('/:id', noteRules, updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
