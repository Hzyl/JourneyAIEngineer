import type { LearningTool, ToolTextField } from '../api'
import './tools.css'

const fields: Array<[ToolTextField, string, string]> = [
  ['install', 'Cài đặt', 'Setup'], ['how', 'Cách dùng', 'How to use it'],
  ['when_not', 'Không nên dùng khi', 'When to avoid it'], ['error', 'Khi gặp lỗi', 'Troubleshooting'],
  ['combine', 'Kết hợp với', 'Use alongside'], ['risks', 'Rủi ro', 'Risks'],
]
const categories: Record<string, string> = {
  Foundation: 'Nền tảng', Development: 'Phát triển', Workflow: 'Quy trình', Exploration: 'Khám phá',
  Deployment: 'Triển khai', 'Learning assistant': 'Trợ lý học tập', Security: 'Bảo mật',
}

export function ToolsView({ tools, language }: { tools: LearningTool[]; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  return <div className="tools-page">
    <div className="page-intro">
      <div>
        <span className="eyebrow accent">{vi ? 'BỘ CÔNG CỤ' : 'TOOLKIT'}</span>
        <h2>{vi ? 'Dùng công cụ' : 'Use the right tool'}<br /><em>{vi ? 'đúng lúc.' : 'at the right time.'}</em></h2>
      </div>
      <p>{vi ? 'Công cụ không thay thế tư duy. Mỗi công cụ ở đây gắn với một tình huống cụ thể trong hành trình học.'
        : 'Tools support your thinking. Each tool here serves a specific purpose in your learning journey.'}</p>
    </div>
    {!tools.length && <div className="empty-state" role="status">
      <h3>{vi ? 'Chưa có công cụ' : 'No tools available'}</h3>
      <p>{vi ? 'Thử làm mới dữ liệu để tải lại danh mục.' : 'Refresh the data to reload the catalogue.'}</p>
    </div>}
    <div className="tools-grid">
      {tools.map((tool) => <article className="tool-card" key={tool.slug}>
        <div className="tool-symbol" aria-hidden="true">{tool.name.slice(0, 1)}</div>
        <div className="tool-content">
          <span className="eyebrow">{vi ? categories[tool.category] ?? tool.category : tool.category}</span>
          <h3>{tool.name}</h3>
          <p>{tool[`when_${language}`]}</p>
          {fields.map(([field, labelVi, labelEn]) => <div key={field}>
            <strong>{vi ? labelVi : labelEn}</strong>
            <p>{tool[`${field}_${language}`]}</p>
          </div>)}
          <div className="command-list" aria-label={vi ? 'Lệnh và thao tác mẫu' : 'Example commands and actions'}>
            {(language === 'en' ? tool.commands_en ?? tool.commands : tool.commands).map((command) =>
              <code key={command}>{command}</code>)}
          </div>
        </div>
      </article>)}
    </div>
  </div>
}
