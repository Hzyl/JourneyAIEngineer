import type { PortfolioProject } from '../api'
import './portfolio.css'

type Program = {
  portfolio_projects?: PortfolioProject[]
  career_checklist?: string[]
  career_checklist_en?: string[]
}

export function PortfolioBoard({ program, language }: { program: Program; language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const projects = program.portfolio_projects ?? []
  const checklist = (vi ? program.career_checklist : program.career_checklist_en) ?? []
  return <section className="portfolio-board" aria-labelledby="portfolio-title">
    <div className="section-heading">
      <div>
        <span className="eyebrow accent">{vi ? 'SẢN PHẨM THỰC HÀNH' : 'BUILD YOUR PORTFOLIO'}</span>
        <h3 id="portfolio-title">{vi ? `${projects.length} gợi ý portfolio` : `${projects.length} portfolio ideas`}</h3>
      </div>
    </div>
    <p className="portfolio-intro">{vi
      ? 'Chọn dự án phù hợp hướng học và vị trí bạn muốn ứng tuyển. Không cần làm tất cả; thời gian là ước tính và phụ thuộc phạm vi bạn chọn.'
      : 'Choose projects for your learning path and target role. You do not need to build them all; time estimates depend on your scope.'}</p>
    {!projects.length && <p role="status">{vi ? 'Chưa có gợi ý dự án.' : 'No project ideas are available yet.'}</p>}
    <div className="portfolio-grid">{projects.map((project) => <article className="portfolio-card" key={project.slug}>
      <span className="tag">{project.estimated_weeks} {vi ? 'tuần ước tính' : 'estimated weeks'}</span>
      <h4>{vi ? project.title_vi : project.title_en}</h4>
      <p>{vi ? project.problem_vi : project.problem_en}</p>
      <div className="tag-list">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
      <details>
        <summary>{vi ? 'Yêu cầu & cách đánh giá' : 'Deliverables & evaluation'}</summary>
        <h5>{vi ? 'Sản phẩm cần bàn giao' : 'What to deliver'}</h5>
        <ul>{(vi ? project.deliverables_vi ?? project.deliverables : project.deliverables)
          .map((item) => <li key={item}>{item}</li>)}</ul>
        <h5>{vi ? 'Cách đánh giá' : 'How to evaluate'}</h5>
        <p>{vi ? project.evaluation_vi ?? project.evaluation : project.evaluation}</p>
        <h5>{vi ? 'Thư mục gợi ý cho bài làm của bạn' : 'Suggested folder for your own work'}</h5>
        <code>{project.github_path}</code>
      </details>
    </article>)}</div>
    <details className="career-checklist">
      <summary>{vi ? 'Checklist tham khảo khi ứng tuyển' : 'Application preparation checklist'}</summary>
      <p>{vi
        ? 'Chọn các mục liên quan đến vị trí tuyển dụng. Các dự án GenAI nâng cao là phần bổ sung theo hướng chuyên môn, không phải điều kiện cho mọi vị trí AI Engineer.'
        : 'Use the items relevant to the job description. Advanced GenAI projects are specialization options, not requirements for every AI engineering role.'}</p>
      {checklist.length ? <ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul>
        : <p>{vi ? 'Checklist đang được cập nhật.' : 'The checklist is being updated.'}</p>}
    </details>
  </section>
}
