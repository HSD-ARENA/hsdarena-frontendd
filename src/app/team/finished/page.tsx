"use client";

export default function TeamFinishedPage() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#c84b4b",
            color: "white",
            padding: "2rem",
            textAlign: "center"
        }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                🎉 Tebrikler!
            </h1>
            <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
                Quiz tamamlandı!
            </p>
            <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>
                Final skorları için admin panelini kontrol edin.
            </p>
        </div>
    );
}
