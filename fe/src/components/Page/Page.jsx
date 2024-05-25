import './page.scss';

export function Page({children, className}) {
  return (
    <div className={`page_style${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
