import { useEffect, useState } from 'react';
import * as favoriteApi from '../../api/favorite-api';

export default function FavoriteButton({ userId, recipeId, onRemove }) {
    const [saved, setSaved] = useState(Boolean(onRemove));
    const [ready, setReady] = useState(Boolean(onRemove));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (onRemove) return;
        const controller = new AbortController();
        favoriteApi.isSaved(userId, recipeId, controller.signal)
            .then(value => {
                if (controller.signal.aborted) return;
                setSaved(value);
                setReady(true);
            })
            .catch(err => {
                if (!controller.signal.aborted) setError(err.message);
            });
        return () => controller.abort();
    }, [userId, recipeId, onRemove]);

    async function toggleFavorite() {
        setBusy(true);
        setError('');
        try {
            if (saved) {
                await favoriteApi.remove(userId, recipeId);
                setSaved(false);
                onRemove?.(recipeId);
            } else {
                await favoriteApi.save(userId, recipeId);
                setSaved(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="actions">
            {ready && <button type="button" disabled={busy} onClick={toggleFavorite}>
                {busy ? 'Updating favorites...' : saved ? 'Remove from Favorites' : 'Save to Favorites'}
            </button>}
            {!ready && !error && <span role="status">Loading favorite...</span>}
            {error && <p className="error" role="alert">{error}</p>}
        </div>
    );
}
