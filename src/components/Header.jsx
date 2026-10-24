import chefClaudeIcon from "../assets/chef-claude-icon.png";

export default function Header() {
  return (
    <header>
      <img src={chefClaudeIcon} alt="Chef Claude icon" />
      <h1 className="LogoText">Chef Claude</h1>
    </header>
  );
}
