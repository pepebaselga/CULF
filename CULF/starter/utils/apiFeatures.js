class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //TODO: 1A) Filtering Fields
  fitler() {
    const queryObj = { ...this.queryString };
    const excludedField = ['page', 'sort', 'limit', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  //TODO: 2) Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);

      this.query = this.query.sort(sortBy);
      //sort('price ratingsAverage) how mongoose does it so we need to get space
    } else {
      this.query = this.query.sort('-dateFound');
    }
    return this;
  }
  //TODO: 3) Limiting Data for each request
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  //TODO: 4) Pagination
  paginate() {
    //EXAMPLE QUERY STRING: page=2&limit=10, 1-10, page 1, 11-20, page 2, ...
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
