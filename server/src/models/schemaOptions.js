export const schemaOptions = {
  timestamps: false,
  toJSON: {
    virtuals: true,
    transform(_doc, value) {
      value.id = String(value._id);
      delete value._id;
      delete value.__v;
      return value;
    },
  },
  toObject: { virtuals: true },
};
