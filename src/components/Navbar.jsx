import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/",             label: "Dashboard",    icon: "⬡" },
  { to: "/add",          label: "Add",          icon: "+" },
  { to: "/transactions", label: "Transactions", icon: "⇄" },
  { to: "/activity",     label: "Activity",     icon: "◈" },
  { to: "/goals",        label: "Goals",        icon: "◎" },
  { to: "/suggestions",  label: "Suggestions",  icon: "✦" },
];

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "rgba(17,17,24,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid #2a2a35",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    zIndex: 100,
    gap: "1rem",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },
  logo: {
    width: "32px",
    height: "32px",
    background: "#c8f135",
    color: "#0a0a0f",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1,
  },
  title: {
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#e8e8f0",
    fontFamily: "var(--font-display)",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    listStyle: "none",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#6b6b80",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "var(--font-display)",
    transition: "all 0.18s ease",
    whiteSpace: "nowrap",
  },
  linkActive: {
    background: "#c8f135",
    color: "#0a0a0f",
  },
  icon: {
    fontSize: "14px",
    lineHeight: 1,
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/" style={styles.brand}>
        <span style={styles.logo}>₹</span>
        <span style={styles.title}>FinTrack</span>
      </NavLink>

      <ul style={styles.links}>
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes("c8f135")) {
                  e.currentTarget.style.background = "#18181f";
                  e.currentTarget.style.color = "#e8e8f0";
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.background.includes("c8f135")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b6b80";
                }
              }}
            >
              <span style={styles.icon}>{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}