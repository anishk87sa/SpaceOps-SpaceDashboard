import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getArticles(req, res) {
  try {
    const { category, q } = req.query;
    const articles = spaceopsRepo.getArticles({ category, q });
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve educational articles',
      error: error.message
    });
  }
}

export function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params;
    const article = spaceopsRepo.getArticleBySlugOrId(slug);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: `Educational article '${slug}' not found`
      });
    }
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve educational article details',
      error: error.message
    });
  }
}
