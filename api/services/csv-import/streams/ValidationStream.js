'use strict';

const {Transform} = require('stream');
const Joi = require('joi');

const schema = {
  id: Joi.number().integer().positive().required(),
  name: Joi.string().max(50).required(),
  age: Joi.number().integer().positive().max(100),
  address: Joi.string().max(80).required(),
  team: Joi.string().max(10).required()
};

class ValidationStream extends Transform {
  constructor(options) {
    super(Object.assign({}, options, {readableObjectMode: true, writableObjectMode: true}));
  }

  _transform(chunk, encoding, callback) {
    const {error} = Joi.validate(chunk, schema);

    if (error) {
      this.emit('skip', error.details);
    } else {
      this.push(chunk);
    }
    callback();
  }
}

module.exports = ValidationStream;
