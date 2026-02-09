export async function addCommentAction(formData) {
  const commentText = formData.get('comment');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.3) {
    throw new Error('Failed to send comment');
  }

  return {
    id: Date.now(),
    text: commentText,
  };
}
