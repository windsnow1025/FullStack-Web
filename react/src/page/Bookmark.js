import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AuthDiv from '../component/AuthDiv';
import ThemeSelect from '../component/ThemeSelect';

function Bookmark() {
    const [bookmarks, setBookmarks] = useState([]);
    const [editBookmarkId, setEditBookmarkId] = useState(null);
    const [newBookmark, setNewBookmark] = useState({firstTitle: '', secondTitle: '', url: '', comment: ''});
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [searchFirstTitle, setSearchFirstTitle] = useState('');
    const [searchSecondTitle, setSearchSecondTitle] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [searchComment, setSearchComment] = useState('');

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/bookmark/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            sortAndSetBookmarks(res.data);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    const sortAndSetBookmarks = (bookmarksArray) => {
        bookmarksArray.sort((a, b) => {
            if (a.first_title < b.first_title) return -1;
            if (a.first_title > b.first_title) return 1;
            if (a.second_title < b.second_title) return -1;
            if (a.second_title > b.second_title) return 1;
            if (a.comment < b.comment) return -1;
            if (a.comment > b.comment) return 1;
            return 0;
        });
        setBookmarks(bookmarksArray);
    };

    const handleAddBookmark = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/bookmark/', {data: newBookmark}, {
                headers: {Authorization: `Bearer ${token}`}
            });
            fetchBookmarks();
            setNewBookmark({firstTitle: '', secondTitle: '', url: '', comment: ''}); // Clear fields
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    };

    const handleEditBookmark = async (id) => {
        if (editBookmarkId !== id) {
            setEditBookmarkId(id);
        } else {
            const bookmarkToUpdate = bookmarks.find(b => b.id === id);
            const token = localStorage.getItem('token');
            try {
                await axios.put(`/api/bookmark/${id}`, {data: bookmarkToUpdate}, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                fetchBookmarks();
                setEditBookmarkId(null);
            } catch (error) {
                console.error('Error updating bookmark:', error);
            }
        }
    };

    const handleDeleteBookmark = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/bookmark/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            fetchBookmarks();
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    const filteredBookmarks = bookmarks.filter(bookmark =>
        (globalSearchTerm === '' ||
            bookmark.first_title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
            bookmark.second_title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
            bookmark.url.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
            bookmark.comment.toLowerCase().includes(globalSearchTerm.toLowerCase())) &&
        (searchFirstTitle === '' || bookmark.first_title.toLowerCase().includes(searchFirstTitle.toLowerCase())) &&
        (searchSecondTitle === '' || bookmark.second_title.toLowerCase().includes(searchSecondTitle.toLowerCase())) &&
        (searchUrl === '' || bookmark.url.toLowerCase().includes(searchUrl.toLowerCase())) &&
        (searchComment === '' || bookmark.comment.toLowerCase().includes(searchComment.toLowerCase()))
    );


    return (
        <div>
            <div className="Flex-space-around">
                <AuthDiv/>
                <ThemeSelect/>
            </div>
            <div className="search-container">
                <input type="text" value={globalSearchTerm} onChange={e => setGlobalSearchTerm(e.target.value)}
                       placeholder="Global Search..."/>
                <input type="text" value={searchFirstTitle} onChange={e => setSearchFirstTitle(e.target.value)}
                       placeholder="Search by First Title..."/>
                <input type="text" value={searchSecondTitle} onChange={e => setSearchSecondTitle(e.target.value)}
                       placeholder="Search by Second Title..."/>
                <input type="text" value={searchUrl} onChange={e => setSearchUrl(e.target.value)}
                       placeholder="Search by URL..."/>
                <input type="text" value={searchComment} onChange={e => setSearchComment(e.target.value)}
                       placeholder="Search by Comment..."/>
            </div>
            <table id="bookmarksTable">
                <thead>
                <tr>
                    <th>First Title</th>
                    <th>Second Title</th>
                    <th>URL</th>
                    <th>Comment</th>
                    <th>Link</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* Add bookmark row */}
                <tr>
                    <td contentEditable="plaintext-only"
                        onInput={e => setNewBookmark({...newBookmark, firstTitle: e.target.textContent})}></td>
                    <td contentEditable="plaintext-only"
                        onInput={e => setNewBookmark({...newBookmark, secondTitle: e.target.textContent})}></td>
                    <td contentEditable="plaintext-only"
                        onInput={e => setNewBookmark({...newBookmark, url: e.target.textContent})}></td>
                    <td contentEditable="plaintext-only"
                        onInput={e => setNewBookmark({...newBookmark, comment: e.target.textContent})}></td>
                    <td></td>
                    <td>
                        <button onClick={handleAddBookmark}>Add</button>
                    </td>
                </tr>
                {/* Bookmark rows */}
                {filteredBookmarks.map(bookmark => (
                    <tr key={bookmark.id}>
                        <td contentEditable={editBookmarkId === bookmark.id}
                            onInput={e => bookmark.first_title = e.target.textContent}>{bookmark.first_title}</td>
                        <td contentEditable={editBookmarkId === bookmark.id}
                            onInput={e => bookmark.second_title = e.target.textContent}>{bookmark.second_title}</td>
                        <td contentEditable={editBookmarkId === bookmark.id}
                            onInput={e => bookmark.url = e.target.textContent}
                            className="word-break">{bookmark.url}</td>
                        <td contentEditable={editBookmarkId === bookmark.id}
                            onInput={e => bookmark.comment = e.target.textContent}>{bookmark.comment}</td>
                        <td className="word-break"><a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a></td>
                        <td>
                            <button
                                onClick={() => handleEditBookmark(bookmark.id)}>{editBookmarkId === bookmark.id ? 'Submit' : 'Edit'}</button>
                            <button onClick={() => handleDeleteBookmark(bookmark.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Bookmark;
