import { useState, useOptimistic, useActionState } from 'react';

async function addCommentAction(formData) {
  const commentText = formData.get('comment');
  await new Promise((r) => setTimeout(r, 1000));
  if (Math.random() < 0.3) throw new Error('Failed to send comment');
  return { id: Date.now(), text: commentText };
}

export const CommentsSection = () => {
  const [comments, setComments] = useState([
    { id: 1, text: 'Привет' },
    { id: 2, text: 'Это пример комментария' },
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newCommentText) => [
      ...state,
      { id: Date.now(), text: newCommentText, optimistic: true },
    ],
  );

  const [_, handleSubmit] = useActionState(async (prevState, formData) => {
    const comment = formData.get('comment');
    setError(null);
    addOptimisticComment(comment);

    try {
      const savedComment = await addCommentAction(formData);
      setComments((prev) => [...prev, savedComment]);
      setInput(''); // очищаем поле ввода
    } catch (err) {
      setError(err.message);
      setComments((prev) => [...prev]); // триггер ререндер для отката
    }

    return null;
  }, null);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Комментарии</h2>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {optimisticComments.map((c) => (
          <li key={c.id} style={{ opacity: c.optimistic ? 0.6 : 1 }}>
            {c.text} {c.optimistic && <em>(отправка...)</em>}
          </li>
        ))}
      </ul>

      <form action={handleSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          name="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Оставьте комментарий"
          rows={3}
          style={{
            width: '100%',
            marginBottom: '0.5rem',
            paddingTop: '0.5rem',
          }}
        />
        <button type="submit">Отправить</button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>
      )}
    </div>
  );
};
