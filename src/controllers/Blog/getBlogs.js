const db = require("../../models")
const blog = db.Blog
const {Op} = require("sequelize")
const user = db.User
const category = db.Category
const country = db.Country

const getBlogs = async (req, res) => {
  try {
    const { category_id, sort, sortBy, search } = parseRequestParams(req.query)
    const { page, size } = parsePaginationParams(req.query)
    
    const { whereClause, orderClause } = buildQueryCriteria(category_id, sort, sortBy, search)
    
    const { count, rows } = await fetchBlogs(whereClause, orderClause, page, size)
    
    const totalPages = Math.ceil(count / size)
    
    res.status(200).json({ total: count, totalPages: totalPages, currentPage: page, blogs: rows })
  } catch (err) {
    console.error('Error fetching blogs:', err)
    res.status(500).json({ err: 'Internal Server Error' })
  }
}

const parseRequestParams = (query) => {
  const category_id = query.category_id ? parseInt(query.category_id) : null
  const sort = query.sort === 'asc' ? 'ASC' : 'DESC'
  const sortBy = query.sortBy || 'createdAt'
  const search = query.search || ''
  return { category_id, sort, sortBy, search }
}

const parsePaginationParams = (query) => {
  const page = parseInt(query.page) || 1
  let size = parseInt(query.size) || 10
  size = Math.min(Math.max(1, size), 10)
  return { page, size }
}

const buildQueryCriteria = (category_id, sort, sortBy, search) => {
  const whereClause = {}
  if (category_id) whereClause.category_id = category_id
  if (search) whereClause.title = { [Op.like]: `%${search}%` }
  
  let orderClause
  if (sortBy === 'title') orderClause = [['title', sort]]
  else if (sortBy === 'createdAt') orderClause = [['createdAt', sort]]
  else orderClause = [['createdAt', 'DESC']]
  
  return { whereClause, orderClause }
}

const fetchBlogs = async (whereClause, orderClause, page, size) => {
  const offset = (page - 1) * size
  return await blog.findAndCountAll({
    where: whereClause,
    order: orderClause,
    limit: size,
    offset: offset,
    include: [
      { model: user, attributes: ['userName'] },
      { model: category, attributes: ['category'] },
      { model: country, attributes: ['country'] },
    ],
  })
}

module.exports = getBlogs