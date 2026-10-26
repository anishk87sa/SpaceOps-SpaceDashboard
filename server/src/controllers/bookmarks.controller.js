import { spaceopsRepo } from '../repositories/spaceops.repository.js';

export function getBookmarks(req, res) {
  try {
    const userId = req.user?.id || 'guest';
    const bookmarks = spaceopsRepo.getUserBookmarks(userId);
    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookmarks',
      error: error.message
    });
  }
}

export function addBookmark(req, res) {
  try {
    const userId = req.user?.id || 'guest';
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and details are required to save bookmark'
      });
    }
    const bookmark = spaceopsRepo.addBookmark(userId, item);
    res.status(201).json({
      success: true,
      message: 'Bookmark saved successfully',
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save bookmark',
      error: error.message
    });
  }
}

export function removeBookmark(req, res) {
  try {
    const userId = req.user?.id || 'guest';
    const { itemId } = req.params;
    const removed = spaceopsRepo.removeBookmark(userId, itemId);
    res.status(200).json({
      success: true,
      message: removed ? 'Bookmark removed' : 'Bookmark not found',
      removed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove bookmark',
      error: error.message
    });
  }
}
