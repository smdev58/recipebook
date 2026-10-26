import { useState } from 'react';
import { Link } from 'react-router';

export default function RecipeForm({ initialValues, onSave }) {
    const [values, setValues] = useState(initialValues || { title: '', image_url: '', ingredients: '', instructions: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function changeHandler(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        if (values.title.trim().length < 3 || values.title.trim().length > 100) {
            setError('Recipe name must be at least 3 and at most 100 characters.');
            return;
        }
        if (!/^https?:\/\/\S+$/i.test(values.image_url.trim())) {
            setError('Enter an image URL starting with http:// or https://.');
            return;
        }
        try {
            new URL(values.image_url.trim());
        } catch {
            setError('Enter a valid image URL.');
            return;
        }
        if (!values.ingredients.trim() || !values.instructions.trim()) {
            setError('Ingredients and instructions are required.');
            return;
        }
        setError('');
        setSaving(true);
        try {
            await onSave({
                title: values.title.trim(), image_url: values.image_url.trim(),
                ingredients: values.ingredients.trim(), instructions: values.instructions.trim(),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={submitHandler} noValidate>
            <label htmlFor="title">Recipe name</label>
            <input id="title" name="title" value={values.title} onChange={changeHandler} maxLength={100} required />
            <label htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" type="url" value={values.image_url} onChange={changeHandler} required />
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" rows={5} value={values.ingredients} onChange={changeHandler} required />
            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" rows={7} value={values.instructions} onChange={changeHandler} required />
            {error && <p role="alert" className="error">{error}</p>}
            <div className="actions">
                <button disabled={saving}>{saving ? 'Saving...' : 'Save recipe'}</button>
                <Link to="/catalog">Cancel</Link>
            </div>
        </form>
    );
}
