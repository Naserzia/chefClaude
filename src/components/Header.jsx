import chefClaudeIcon from "../assets/chef-claude-icon.png";

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-mark">
        <img src={chefClaudeIcon} alt="Chef Claude icon" />
        <div>
          <h1 className="logo-text">Chef Claude</h1>
          <span className="brand-tag">AI-powered kitchen helper</span>
        </div>
      </div>
    </header>
  );
}
