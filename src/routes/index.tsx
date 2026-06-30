import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#ffffff",
        textAlign: "center",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>GARHY | HYPER</h1>

        <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Under Maintenance</h2>

        <p
          style={{
            fontSize: "18px",
            color: "#cbd5e1",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          We're currently performing scheduled maintenance to improve your experience.
          <br />
          We'll be back online soon.
        </p>
      </div>
    </div>
  );
}
