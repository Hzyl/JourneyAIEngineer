import type { ReviewRating } from './ReviewCard'

export function reviewRatings(language: 'vi' | 'en') {
  const ratings: ReviewRating[] = ['again', 'hard', 'good', 'easy']
  const labels = language === 'vi' ? ['Chưa nhớ', 'Khó', 'Nhớ được', 'Dễ'] : ['Again', 'Hard', 'Good', 'Easy']
  const descriptions = language === 'vi'
    ? ['Quên hoặc trả lời sai', 'Nhớ được nhưng phải cố gắng', 'Tự trả lời đúng', 'Nhớ ngay, chắc chắn']
    : ['Forgot or answered incorrectly', 'Recalled with effort', 'Answered correctly on your own', 'Immediate, confident recall']
  return ratings.map((rating, index) => ({ rating, label: labels[index], description: descriptions[index] }))
}

export function reviewRatingLabel(rating: string, language: 'vi' | 'en') {
  return reviewRatings(language).find((item) => item.rating === rating)?.label ?? rating
}
