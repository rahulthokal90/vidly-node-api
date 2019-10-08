const mongoose = require('mongoose');

const ExamSchema = mongoose.model('Exams', new mongoose.Schema({
  exm_cd: {
    type: Number, 
    maxlength: 20
  },
  exm_prd: {
    type: Number, 
    maxlength: 20
  },
  total_exam_reg: {
    type: Number, 
    maxlength: 20
  },
  total_invc: {
    type: Number, 
    maxlength: 20
  },
  exm_app_upd: {
    type: Number, 
    maxlength: 20
  },
  exm_app_hist: {
    type: Number, 
    maxlength: 20
  },
  exm_invc_upd: {
    type: Number, 
    maxlength: 20
  },
  exm_invc_hist: {
    type: Number, 
    maxlength: 20
  },
  date: {
    type: Date,
    default: Date.now
  }
}));

exports.Exam = ExamSchema; 
