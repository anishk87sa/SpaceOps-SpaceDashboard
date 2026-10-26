import { newsProviderService } from '../services/newsProvider.service.js';

export async function getNews(req, res) {
  try {
    const { category, q, refresh } = req.query;
    const news = await newsProviderService.getNews({
      category,
      q,
      refresh: refresh === 'true' || refresh === '1',
    });
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve space news',
      error: error.message,
    });
  }
}

export async function getNewsBySlug(req, res) {
  try {
    const { slug } = req.params;
    const article = await newsProviderService.getNewsBySlugOrId(slug);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: `News article '${slug}' not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve news article details',
      error: error.message,
    });
  }
}
