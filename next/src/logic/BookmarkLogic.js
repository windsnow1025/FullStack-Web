import BookmarkService from "../service/BookmarkService";

export class BookmarkLogic {

  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  async fetchBookmarks() {
    try {
      const bookmarks = await this.bookmarkService.fetchBookmarks();
      return this.sortBookmarks(bookmarks);
    } catch (error) {
      console.error(error);
    }
  }

  async addBookmark(newBookmark) {
    try {
      await this.bookmarkService.addBookmark(newBookmark);
    } catch (error) {
      if (error.response.status === 401) {
        alert('Unauthorized');
      } else if (error.response.status === 403) {
        alert('Forbidden');
      } else {
        console.error(error);
      }
    }
  }

  async updateBookmark(id, updatedFields) {
    try {
      await this.bookmarkService.updateBookmark(id, updatedFields);
    } catch (error) {
      if (error.response.status === 401) {
        alert('Unauthorized');
      } else if (error.response.status === 403) {
        alert('Forbidden');
      } else {
        console.error(error);
      }
    }
  }

  async deleteBookmark(id) {
    try {
      await this.bookmarkService.deleteBookmark(id);
    } catch (error) {
      if (error.response.status === 401) {
        alert('Unauthorized');
      } else if (error.response.status === 403) {
        alert('Forbidden');
      } else {
        console.error(error);
      }
    }
  }

  sortBookmarks(bookmarks) {
    bookmarks.sort((a, b) => {
      if (a.first_title < b.first_title) return -1;
      if (a.first_title > b.first_title) return 1;
      if (a.second_title < b.second_title) return -1;
      if (a.second_title > b.second_title) return 1;
      if (a.comment < b.comment) return -1;
      if (a.comment > b.comment) return 1;
      return 0;
    });
    return bookmarks;
  }

  filterBookmarks(bookmarks, filters) {
    const { searchGlobal, searchFirstTitle, searchSecondTitle, searchUrl, searchComment } = filters;

    let filteredBookmarks = bookmarks.filter(bookmark =>
      (searchGlobal === '' ||
        bookmark.first_title.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        bookmark.second_title.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        bookmark.comment.toLowerCase().includes(searchGlobal.toLowerCase())) &&
      (searchFirstTitle === '' || bookmark.first_title.toLowerCase().includes(searchFirstTitle.toLowerCase())) &&
      (searchSecondTitle === '' || bookmark.second_title.toLowerCase().includes(searchSecondTitle.toLowerCase())) &&
      (searchUrl === '' || bookmark.url.toLowerCase().includes(searchUrl.toLowerCase())) &&
      (searchComment === '' || bookmark.comment.toLowerCase().includes(searchComment.toLowerCase()))
    );

    return this.sortBookmarks(filteredBookmarks);
  }

}