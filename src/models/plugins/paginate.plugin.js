const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options = {}) {
    // -------------------------
    // SORT
    // -------------------------
    let sort = "createdAt";
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    }

    // -------------------------
    // PAGINATION
    // -------------------------
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;

    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;

    const skip = (page - 1) * limit;

    // -------------------------
    // QUERY
    // -------------------------
    const countPromise = this.countDocuments(filter).exec();
    let query = this.find(filter).sort(sort).skip(skip).limit(limit);

    // -------------------------
    // POPULATE (STRING OR ARRAY)
    // -------------------------
    if (options.populate) {
      // ✅ ARRAY-BASED POPULATE (BEST PRACTICE)
      if (Array.isArray(options.populate)) {
        options.populate.forEach((populateOption) => {
          query = query.populate(populateOption);
        });
      }

      // ✅ STRING-BASED POPULATE (BACKWARD COMPATIBLE)
      else if (typeof options.populate === "string") {
        options.populate.split(",").forEach((populateOption) => {
          const parts = populateOption.trim().split(" ");
          const path = parts[0];
          const select = parts.slice(1).join(" ");

          query = query.populate({
            path,
            select: select || undefined,
          });
        });
      }
    }

    // -------------------------
    // EXECUTE
    // -------------------------
    const docsPromise = query.exec();

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise,
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
};

module.exports = paginate;
