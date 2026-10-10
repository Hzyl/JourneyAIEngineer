import type { AppSettings } from '../api'

type SelectKey = 'language' | 'target_role' | 'experience_level' | 'track'
export const settingsLabels = (vi: boolean): Record<keyof AppSettings, string> => ({
  language: vi ? 'Ngôn ngữ giao diện' : 'Interface language',
  target_role: vi ? 'Mục tiêu nghề nghiệp' : 'Career goal',
  experience_level: vi ? 'Nền tảng hiện tại' : 'Current experience',
  track: vi ? 'Nhịp học' : 'Study rhythm',
  weekly_goal_minutes: vi ? 'Mục tiêu tuần' : 'Weekly goal',
  show_completed_lessons: vi ? 'Hiển thị bài đã hoàn thành trên lộ trình' : 'Show completed lessons on the roadmap',
  onboarding_complete: vi ? 'Đã hoàn thành nhập môn và đánh giá đầu vào' : 'Completed onboarding and baseline assessment',
})

export function settingsChoices(vi: boolean): Array<{ key: SelectKey; options: Array<[string, string]> }> {
  return [
    { key: 'language', options: [['vi', 'Tiếng Việt'], ['en', 'English']] },
    { key: 'target_role', options: [
      ['internship', vi ? 'Thực tập kỹ sư AI/ML' : 'AI/ML engineering internship'],
      ['junior', vi ? 'Kỹ sư AI mới vào nghề' : 'Junior AI Engineer'],
      ['career_switch', vi ? 'Chuyển sang nghề kỹ sư AI' : 'Switching to AI engineering'],
    ] },
    { key: 'experience_level', options: [
      ['beginner', vi ? 'Mới bắt đầu' : 'Beginner'],
      ['intermediate', vi ? 'Đã có nền tảng' : 'Some experience'],
      ['advanced', vi ? 'Muốn xây dựng dự án chuyên sâu' : 'Building an advanced portfolio'],
    ] },
    { key: 'track', options: [
      ['standard', vi ? 'Nhịp đều đặn' : 'Steady pace'],
      ['accelerated', vi ? 'Nhịp tập trung' : 'Focused pace'],
    ] },
  ]
}
