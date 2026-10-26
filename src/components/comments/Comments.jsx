import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import AuthContext from '../../contexts/auth-context';
import * as commentApi from '../../api/comment-api';

export default function Comments({ recipeId }) {
    const { isAuthenticated } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        commentApi.getAll(recipeId, controller.signal)
            .then(setComments)
            .catch(err => { if (!controller.signal.aborted) setError(err.message); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [recipeId]);

    async function submitHandler(e) {
        e.preventDefault();
        if (!comment.trim() || comment.trim().length > 2000) {
            setError('Write a comment between 1 and 2000 characters.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const result = await commentApi.create(recipeId, comment.trim());
            setComments(current => [...current, result]);
            setComment('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="comments">
            <h2>Comments</h2>
            {loading && <p role="status">Loading comments...</p>}
            {!loading && !error && comments.length === 0 && <p>No comments yet.</p>}
            {comments.map(item => <article className="comment" key={item.id}>
                <p className="comment-date">{new Date(item.created_at).toLocaleDateString('en-GB')}</p>
                <p className="multiline">{item.comment}</p>
            </article>)}
            {error && <p role="alert" className="error">{error}</p>}
            {isAuthenticated ? <form onSubmit={submitHandler} noValidate>
                <label htmlFor="comment">Add a comment</label>
                <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={2000} required />
                <button disabled={saving || loading}>{saving ? 'Adding...' : 'Add comment'}</button>
            </form> : <p><Link to="/login">Login</Link> to add a comment.</p>}
        </section>
    );
}
